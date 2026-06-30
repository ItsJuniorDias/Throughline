/**
 * Subscription store — the single source of truth for entitlement.
 *
 * Persists `isPremium` so the demo (mock provider) unlocks durably across
 * launches. With a live provider (RevenueCat), entitlement is refreshed from
 * the backend on init. Purchase / restore round-trips go through the provider.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { purchases, PURCHASES_IS_LIVE, type Plan } from '../lib/purchases';

type Status = 'idle' | 'loading' | 'purchasing' | 'restoring';

interface SubState {
  isPremium: boolean;
  plans: Plan[];
  selectedPlanId: string | null;
  status: Status;
  error: string | null;
  initialized: boolean;

  init: () => Promise<void>;
  reloadPlans: () => Promise<void>;
  selectPlan: (id: string) => void;
  purchaseSelected: () => Promise<boolean>;
  restore: () => Promise<boolean>;
}

export const useSubscription = create<SubState>()(
  persist(
    (set, get) => ({
      isPremium: false,
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
            set({ isPremium });
            // keep entitlement fresh as renewals / expirations / external purchases land
            purchases.addStatusListener(({ isPremium }) => set({ isPremium }));
          }
        } catch (e: any) {
          set({ status: 'idle', error: e?.message ?? 'Could not load plans', initialized: true });
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
          set({ status: 'idle', error: e?.message ?? 'Could not load plans' });
        }
      },

      selectPlan: (id) => set({ selectedPlanId: id }),

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
          set({ status: 'idle', error: cancelled ? null : e?.message ?? 'Purchase failed' });
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
          set({ status: 'idle', error: e?.message ?? 'Restore failed' });
          return false;
        }
      },
    }),
    {
      name: 'throughline.subscription.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ isPremium: s.isPremium, selectedPlanId: s.selectedPlanId }),
    },
  ),
);

/** Convenience selector hook for gating premium features. */
export const usePremium = () => useSubscription((s) => s.isPremium);

export type { Plan };
