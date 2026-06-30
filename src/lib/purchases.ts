/**
 * Purchases — a thin provider abstraction over the billing/entitlement layer.
 *
 * Ships with a MOCK provider so the whole paywall flow is functional in the
 * scaffold: no API keys, no native build, no store account. The mock simulates
 * a purchase and reports premium back to the subscription store (which is the
 * source of truth and persists it).
 *
 * ── Going live with RevenueCat ──────────────────────────────────────────────
 *   1. npx expo install react-native-purchases
 *   2. fill in REVENUECAT_API_KEYS below (and create a "premium" entitlement +
 *      an offering with your annual/monthly packages in the RevenueCat dashboard)
 *   3. set USE_REVENUECAT = true
 *
 * The RevenueCat adapter below is real, working code. It LAZY-requires the SDK
 * inside each method, so as long as USE_REVENUECAT stays false the (uninstalled)
 * dependency is never touched and the project builds fine.
 */

import { Platform } from 'react-native';

export interface Plan {
  id: string; // the store product / RC package identifier
  title: string; // "Annual" | "Monthly"
  priceString: string; // localized, e.g. "$39.99"
  period: 'month' | 'year';
  perMonthString?: string; // e.g. "$3.33 / mo" (shown on the annual plan)
  trialDays?: number; // free-trial length, if any
  badge?: string; // e.g. "Best value"
  savingsPct?: number; // annual vs monthly savings, if any
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
}

// ─── Config ──────────────────────────────────────────────────────────────────

/** The entitlement identifier configured in RevenueCat. */
export const ENTITLEMENT_ID = 'premium';

export const REVENUECAT_API_KEYS = {
  ios: 'appl_XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  android: 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXXX',
};

/** Flip to true once steps 1–2 above are done. */
const USE_REVENUECAT = false;

/** Whether the active provider is backed by a real store/backend. The store
 *  only refreshes entitlement from getStatus() on launch when this is true. */
export const PURCHASES_IS_LIVE = USE_REVENUECAT;

// ─── Mock provider (default) ─────────────────────────────────────────────────

const MOCK_PLANS: Plan[] = [
  {
    id: 'throughline_annual',
    title: 'Annual',
    priceString: '$39.99',
    period: 'year',
    perMonthString: '$3.33 / mo',
    trialDays: 7,
    badge: 'Best value',
    savingsPct: 33,
  },
  {
    id: 'throughline_monthly',
    title: 'Monthly',
    priceString: '$4.99',
    period: 'month',
    trialDays: 7,
  },
];

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const mockProvider: PurchasesProvider = {
  async init() {
    /* nothing to configure */
  },
  async getPlans() {
    await wait(250);
    return MOCK_PLANS;
  },
  async purchase(_planId) {
    // simulate the native purchase sheet round-trip
    await wait(1200);
    return { isPremium: true };
  },
  async restore() {
    await wait(700);
    // nothing to restore in the mock; the store's persisted value stands
    return { isPremium: false };
  },
  async getStatus() {
    return { isPremium: false };
  },
};

// ─── RevenueCat provider (real; activated by the flag) ───────────────────────

let _rc: any = null;
function rc() {
  // lazy-require so a false flag never imports the (possibly uninstalled) SDK
  if (!_rc) _rc = require('react-native-purchases').default;
  return _rc;
}

function mapPackageToPlan(pkg: any): Plan {
  const product = pkg.product;
  const isYear = /ANNUAL|YEAR/i.test(pkg.packageType ?? '') || product.subscriptionPeriod === 'P1Y';
  const intro = product.introPrice;
  return {
    id: pkg.identifier,
    title: isYear ? 'Annual' : 'Monthly',
    priceString: product.priceString,
    period: isYear ? 'year' : 'month',
    perMonthString:
      isYear && typeof product.price === 'number'
        ? `${product.currencyCode ? '' : ''}${(product.price / 12).toFixed(2)} / mo`
        : undefined,
    trialDays: intro?.periodNumberOfUnits ? intro.periodNumberOfUnits : undefined,
    badge: isYear ? 'Best value' : undefined,
  };
}

const revenueCatProvider: PurchasesProvider = {
  async init() {
    const Purchases = rc();
    const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEYS.ios : REVENUECAT_API_KEYS.android;
    Purchases.configure({ apiKey });
  },
  async getPlans() {
    const Purchases = rc();
    const offerings = await Purchases.getOfferings();
    const pkgs = offerings.current?.availablePackages ?? [];
    // annual first so it lands as the default selection
    return pkgs
      .map(mapPackageToPlan)
      .sort((a: Plan, b: Plan) => (a.period === 'year' ? -1 : 1));
  },
  async purchase(planId) {
    const Purchases = rc();
    const offerings = await Purchases.getOfferings();
    const pkg = (offerings.current?.availablePackages ?? []).find(
      (p: any) => p.identifier === planId || p.product.identifier === planId,
    );
    if (!pkg) throw new Error('Plan not available');
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { isPremium: !!customerInfo.entitlements.active[ENTITLEMENT_ID] };
  },
  async restore() {
    const Purchases = rc();
    const info = await Purchases.restorePurchases();
    return { isPremium: !!info.entitlements.active[ENTITLEMENT_ID] };
  },
  async getStatus() {
    const Purchases = rc();
    const info = await Purchases.getCustomerInfo();
    return { isPremium: !!info.entitlements.active[ENTITLEMENT_ID] };
  },
};

export const purchases: PurchasesProvider = USE_REVENUECAT ? revenueCatProvider : mockProvider;
