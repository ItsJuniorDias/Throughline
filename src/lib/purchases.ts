/**
 * Purchases — provider abstraction over the billing / entitlement layer.
 *
 * RevenueCat is the live path: it pulls the current offering's packages (real
 * localized prices, trials, per-month figures) and runs purchase / restore /
 * entitlement through the SDK. A MOCK provider stays as a fallback so the paywall
 * still works on a platform whose RevenueCat key isn't configured yet (e.g.
 * Android here), and so the flow is demoable without a build.
 *
 * Which provider is active is decided at load time by whether the current
 * platform's RevenueCat key looks real (see `keyLooksReal`). The iOS key below is
 * a RevenueCat **Test Store** key — it returns real offerings in the simulator
 * without App Store Connect products.
 *
 * RevenueCat public SDK keys are designed to live in the app bundle — they are
 * NOT secret (unlike the OpenRouter key), so hard-coding them here is expected.
 */

import { Platform } from "react-native";

export interface Plan {
  id: string; // the RevenueCat package identifier (e.g. "$rc_annual")
  title: string; // "Annual" | "Monthly" | …
  priceString: string; // localized, e.g. "$39.99"
  period: string; // "year" | "month" | "week" | …
  perMonthString?: string; // e.g. "$3.33 / mo" (shown on longer plans)
  trialDays?: number; // free-trial length in days, if any
  badge?: string; // e.g. "Best value"
  savingsPct?: number; // annual vs monthly savings, if computable
}

export interface CustomerStatus {
  isPremium: boolean;
}

export interface PurchasesProvider {
  init(): Promise<void>;
  getPlans(): Promise<Plan[]>;
  purchase(planId: string): Promise<CustomerStatus>;
  restore(): Promise<CustomerStatus>;
  getStatus(): Promise<CustomerStatus>;
  /** subscribe to entitlement changes (renewals, expirations). returns unsubscribe. */
  addStatusListener(cb: (s: CustomerStatus) => void): () => void;
}

// ─── Config ──────────────────────────────────────────────────────────────────

/** Must match the entitlement identifier in your RevenueCat dashboard exactly. */
export const ENTITLEMENT_ID =
  process.env.EXPO_PUBLIC_RC_ENTITLEMENT ?? "Throughline Pro";

export const REVENUECAT_API_KEYS = {
  ios: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? "appl_JQXLWdeUSAznmYeKcnpvdaLnfQo",
  android:
    process.env.EXPO_PUBLIC_RC_ANDROID_KEY ??
    "goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXX",
};

function platformKey(): string {
  return Platform.OS === "ios"
    ? REVENUECAT_API_KEYS.ios
    : REVENUECAT_API_KEYS.android;
}

/** A key is "real" if it isn't an obvious placeholder. */
function keyLooksReal(k: string): boolean {
  return !!k && k.length > 12 && !/X{4,}|your[-_ ]?key|placeholder/i.test(k);
}

// ─── Mapping helpers (RevenueCat package → Plan) ─────────────────────────────

const DAYS_PER_UNIT: Record<string, number> = {
  DAY: 1,
  WEEK: 7,
  MONTH: 30,
  YEAR: 365,
};
const LONGER_THAN_MONTH = ["ANNUAL", "SIX_MONTH", "THREE_MONTH", "TWO_MONTH"];
const RANK: Record<string, number> = {
  LIFETIME: 0,
  ANNUAL: 1,
  SIX_MONTH: 2,
  THREE_MONTH: 3,
  TWO_MONTH: 4,
  MONTHLY: 5,
  WEEKLY: 6,
};

function packageTitle(pkg: any): string {
  switch (pkg.packageType) {
    case "ANNUAL":
      return "Annual";
    case "SIX_MONTH":
      return "6 months";
    case "THREE_MONTH":
      return "3 months";
    case "TWO_MONTH":
      return "2 months";
    case "MONTHLY":
      return "Monthly";
    case "WEEKLY":
      return "Weekly";
    case "LIFETIME":
      return "Lifetime";
    default:
      return pkg.product?.title ?? "Subscription";
  }
}

function packagePeriod(pkg: any): string {
  switch (pkg.packageType) {
    case "ANNUAL":
      return "year";
    case "SIX_MONTH":
      return "6 mo";
    case "THREE_MONTH":
      return "3 mo";
    case "TWO_MONTH":
      return "2 mo";
    case "MONTHLY":
      return "month";
    case "WEEKLY":
      return "week";
    case "LIFETIME":
      return "one-time";
    default: {
      const p = pkg.product?.subscriptionPeriod;
      if (p === "P1Y") return "year";
      if (p === "P1M") return "month";
      if (p === "P1W") return "week";
      return "period";
    }
  }
}

function isLongerThanMonth(pkg: any): boolean {
  return (
    LONGER_THAN_MONTH.includes(pkg.packageType) ||
    pkg.product?.subscriptionPeriod === "P1Y"
  );
}

/** Free-trial length in days, from the iOS introPrice or the Android free phase. */
function trialDays(product: any): number | undefined {
  const intro = product?.introPrice;
  if (intro && intro.price === 0 && intro.periodNumberOfUnits > 0) {
    const d =
      (DAYS_PER_UNIT[String(intro.periodUnit).toUpperCase()] ?? 0) *
      intro.periodNumberOfUnits;
    return d || undefined;
  }
  // Android: trial lives on the default subscription option's free phase
  const free = product?.defaultOption?.freePhase;
  const bp = free?.billingPeriod;
  if (bp) {
    const unit = String(bp.unit ?? "").toUpperCase();
    const value = bp.value ?? 1;
    const d = (DAYS_PER_UNIT[unit] ?? 0) * value;
    if (d) return d;
  }
  return undefined;
}

/** Build the paywall's Plan[] from RevenueCat packages (longest period first). */
export function buildPlans(pkgs: any[]): Plan[] {
  const sorted = [...pkgs].sort(
    (a, b) => (RANK[a.packageType] ?? 9) - (RANK[b.packageType] ?? 9),
  );

  const monthly = sorted.find((p) => p.packageType === "MONTHLY");

  const monthlyPrice =
    typeof monthly?.product?.price === "number"
      ? monthly.product.price
      : undefined;

  return sorted.map((pkg) => {
    const product = pkg.product ?? {};
    const longer = isLongerThanMonth(pkg);

    let savingsPct: number | undefined;
    if (
      pkg.packageType === "ANNUAL" &&
      monthlyPrice &&
      typeof product.pricePerMonth === "number" &&
      product.pricePerMonth > 0
    ) {
      const pct = Math.round((1 - product.pricePerMonth / monthlyPrice) * 100);
      if (pct > 0) savingsPct = pct;
    }

    return {
      id: pkg.identifier,
      title: packageTitle(pkg),
      priceString: product.priceString ?? "",
      period: packagePeriod(pkg),
      perMonthString:
        longer && product.pricePerMonthString
          ? `${product.pricePerMonthString} / mo`
          : undefined,
      trialDays: trialDays(product),
      badge: pkg.packageType === "ANNUAL" ? "Best value" : undefined,
      savingsPct,
    };
  });
}

// ─── RevenueCat provider (live) ──────────────────────────────────────────────

let _rc: any = null;
function rc() {
  // lazy-require so the (native) SDK is only touched when the live path is used
  if (!_rc) _rc = require("react-native-purchases").default;
  return _rc;
}

let _configured = false;
let _packages = new Map<string, any>();

function hasEntitlement(info: any): boolean {
  return !!info?.entitlements?.active?.[ENTITLEMENT_ID];
}

const revenueCatProvider: PurchasesProvider = {
  async init() {
    const Purchases = rc();
    if (!_configured) {
      Purchases.configure({ apiKey: platformKey() });
      _configured = true;
    }
  },

  async getPlans() {
    const Purchases = rc();
    const offerings = await Purchases.getOfferings();
    const pkgs = offerings?.current?.availablePackages ?? [];

    _packages = new Map(pkgs.map((p) => [p.identifier, p]));
    return buildPlans(pkgs);
  },

  async purchase(planId) {
    const Purchases = rc();
    let pkg = _packages.get(planId);
    if (!pkg) {
      const offerings = await Purchases.getOfferings();
      pkg = (offerings?.current?.availablePackages ?? []).find(
        (p: any) => p.identifier === planId || p.product?.identifier === planId,
      );
    }
    if (!pkg) throw new Error("This plan isn’t available right now.");
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { isPremium: hasEntitlement(customerInfo) };
  },

  async restore() {
    const Purchases = rc();
    const info = await Purchases.restorePurchases();
    return { isPremium: hasEntitlement(info) };
  },

  async getStatus() {
    const Purchases = rc();
    const info = await Purchases.getCustomerInfo();
    return { isPremium: hasEntitlement(info) };
  },

  addStatusListener(cb) {
    const Purchases = rc();
    const listener = (info: any) => cb({ isPremium: hasEntitlement(info) });
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      try {
        Purchases.removeCustomerInfoUpdateListener(listener);
      } catch {
        /* no-op */
      }
    };
  },
};

// ─── Mock provider (fallback when a platform key isn't configured) ───────────

const MOCK_PLANS: Plan[] = [
  {
    id: "throughline_annual",
    title: "Annual",
    priceString: "$39.99",
    period: "year",
    perMonthString: "$3.33 / mo",
    trialDays: 7,
    badge: "Best value",
    savingsPct: 33,
  },
  {
    id: "throughline_monthly",
    title: "Monthly",
    priceString: "$4.99",
    period: "month",
    trialDays: 7,
  },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const mockProvider: PurchasesProvider = {
  async init() {
    /* nothing to configure */
  },
  async getPlans() {
    await wait(200);
    return MOCK_PLANS;
  },
  async purchase() {
    await wait(1000);
    return { isPremium: true };
  },
  async restore() {
    await wait(600);
    return { isPremium: false };
  },
  async getStatus() {
    return { isPremium: false };
  },
  addStatusListener() {
    return () => {};
  },
};

// ─── Provider selection ──────────────────────────────────────────────────────

const LIVE = keyLooksReal(platformKey());

/** True when the active provider is RevenueCat (the store refreshes entitlement
 *  from the backend on launch and subscribes to updates only when this is true). */
export const PURCHASES_IS_LIVE = LIVE;
export const USE_REVENUECAT = LIVE;

export const purchases: PurchasesProvider = LIVE
  ? revenueCatProvider
  : mockProvider;
