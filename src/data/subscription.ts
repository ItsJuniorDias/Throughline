/**
 * Subscription store — entitlement state, layered:
 *
 *   1. RevenueCat (the live provider) is the source of truth for real purchases.
 *      Its result is mirrored into `isPremium` AND cached in AsyncStorage, so a
 *      cold start shows the last-known state instantly (no "not premium" flash
 *      while the SDK boots) and then gets corrected once the SDK refreshes /
 *      a renewal/expiration lands via the status listener.
 *
 *   2. A manual OVERRIDE (`premiumOverride`, also persisted in AsyncStorage) lets
 *      you force premium on/off for testing without touching the store — handy
 *      when a sandbox/TestFlight subscription is stuck active and you just want to
 *      see the paywall again (or preview premium without subscribing).
 *
 * Effective premium (what the whole app gates on) = the override when it's set
 * and honored, otherwise the RevenueCat/cached value. Read it via `usePremium()`
 * or the `selectIsPremium` selector — never read raw `isPremium` for gating.
 *
 * The override is only honored when `ALLOW_PREMIUM_OVERRIDE` is true (defaults to
 * __DEV__), so a forced-on flag can never unlock premium for real users in a
 * production build.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { purchases, PURCHASES_IS_LIVE, type Plan } from '../lib/purchases';
import { translate } from '../i18n';

type Status = 'idle' | 'loading' | 'purchasing' | 'restoring';

/**
 * Whether the local premium override is honored. Dev builds only by default, so
 * a forced-on flag can never reach production users. Flip to `true` if you also
 * need it in a release / TestFlight build — but understand the trade-off: anyone
 * who can set the flag (e.g. on a jailbroken device) would unlock premium.
 */
export const ALLOW_PREMIUM_OVERRIDE: boolean =
  typeof __DEV__ !== 'undefined' ? __DEV__ : false;

/**
 * Manual override of the premium state.
 *   true  → force premium ON  (preview paid features without subscribing)
 *   false → force premium OFF (see the paywall again despite an active sub)
 *   null  → no override; follow RevenueCat
 */
export type PremiumOverride = boolean | null;

interface SubState {
  /** Raw entitlement from RevenueCat (or the mock), cached across launches. */
  isPremium: boolean;
  /** Local test override; see PremiumOverride. */
  premiumOverride: PremiumOverride;
  plans: Plan[];
  selectedPlanId: string | null;
  status: Status;
  error: string | null;
  initialized: boolean;

  init: () => Promise<void>;
  reloadPlans: () => Promise<void>;
  selectPlan: (id: string) => void;
  setPremiumOverride: (value: PremiumOverride) => void;
  purchaseSelected: () => Promise<boolean>;
  restore: () => Promise<boolean>;
}

export const useSubscription = create<SubState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      premiumOverride: null,
      plans: [],
      selectedPlanId: null,
      status: 'idle',
      error: null,
      initialized: false,

      init: async () => {
        if (get().initialized) return;
        set({ status: 'loading', error: null });
        try {
          await purchases.init();
          const plans = await purchases.getPlans();
          set((s) => ({
            plans,
            selectedPlanId:
              s.selectedPlanId && plans.some((p) => p.id === s.selectedPlanId)
                ? s.selectedPlanId
                : plans[0]?.id ?? null,
            status: 'idle',
            initialized: true,
          }));
          // only a real backend can authoritatively refresh entitlement
          if (PURCHASES_IS_LIVE) {
            const { isPremium } = await purchases.getStatus();
            set({ isPremium }); // mirror RC → cache (persisted via partialize)
            // keep entitlement fresh as renewals / expirations / external purchases land
            purchases.addStatusListener(({ isPremium }) => set({ isPremium }));
          }
        } catch (e: any) {
          set({ status: 'idle', error: e?.message ?? translate('errors.loadPlans'), initialized: true });
        }
      },

      reloadPlans: async () => {
        set({ status: 'loading', error: null });
        try {
          await purchases.init();
          const plans = await purchases.getPlans();
          set((s) => ({
            plans,
            selectedPlanId:
              s.selectedPlanId && plans.some((p) => p.id === s.selectedPlanId)
                ? s.selectedPlanId
                : plans[0]?.id ?? null,
            status: 'idle',
          }));
        } catch (e: any) {
          set({ status: 'idle', error: e?.message ?? translate('errors.loadPlans') });
        }
      },

      selectPlan: (id) => set({ selectedPlanId: id }),

      setPremiumOverride: (value) => set({ premiumOverride: value }),

      purchaseSelected: async () => {
        const { selectedPlanId } = get();
        if (!selectedPlanId) return false;
        set({ status: 'purchasing', error: null });
        try {
          const { isPremium } = await purchases.purchase(selectedPlanId);
          set({ isPremium, status: 'idle' });
          return isPremium;
        } catch (e: any) {
          const cancelled = e?.userCancelled === true || /cancel/i.test(e?.message ?? '');
          set({ status: 'idle', error: cancelled ? null : e?.message ?? translate('errors.purchaseFailed') });
          return false;
        }
      },

      restore: async () => {
        set({ status: 'restoring', error: null });
        try {
          const { isPremium } = await purchases.restore();
          set({ isPremium, status: 'idle' });
          return isPremium;
        } catch (e: any) {
          set({ status: 'idle', error: e?.message ?? translate('errors.restoreFailed') });
          return false;
        }
      },
    }),
    {
      name: 'throughline.subscription.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        isPremium: s.isPremium,
        selectedPlanId: s.selectedPlanId,
        premiumOverride: s.premiumOverride,
      }),
    },
  ),
);

/**
 * Effective premium — the value the app should gate on. The local override wins
 * when it's set and honored; otherwise we fall back to the RevenueCat/cached
 * entitlement. Use this everywhere instead of reading raw `isPremium`.
 */
export function selectIsPremium(s: SubState): boolean {
  if (ALLOW_PREMIUM_OVERRIDE && s.premiumOverride !== null) return s.premiumOverride;
  return s.isPremium;
}

/** Convenience selector hook for gating premium features. */
export const usePremium = () => useSubscription(selectIsPremium);

export type { Plan };
