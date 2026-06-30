/**
 * Paywall — the subscription screen (pushed onto the navigation stack).
 *
 * Sells the outcome (the longitudinal read you can't see day to day), lists what
 * Premium unlocks, lets you pick a plan, and runs the purchase through the
 * subscription store. Plans, prices, trials, and entitlement all come from
 * RevenueCat (see src/lib/purchases.ts). Handles loading / purchasing / success /
 * already-a-member states, plus restore and the App Store auto-renew disclosure.
 */

import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSubscription } from "../src/data/subscription";
import { useTheme } from "../src/theme/ThemeProvider";
import { haptics } from "../src/lib/haptics";
import { Text } from "../src/components/ui/Text";
import { Button } from "../src/components/ui/Button";
import { Icon, type IconName } from "../src/components/ui/Divider";
import type { Plan } from "../src/lib/purchases";

const TERMS_URL = "https://throughline.app/terms";
const PRIVACY_URL = "https://throughline.app/privacy";

const FEATURES: { icon: IconName; title: string; detail: string }[] = [
  {
    icon: "sunrise",
    title: "A read for today",
    detail:
      "Every day you write, a frontier-model reflection on that day — ready the moment you subscribe, from your very first entry.",
  },
  {
    icon: "git-merge",
    title: "What lifts you, what drains you",
    detail:
      "Mood × theme correlations across your history — the patterns you can’t feel one day at a time.",
  },
  {
    icon: "trending-up",
    title: "All-time analytics",
    detail:
      "Your lifetime mood trend, longest streak, and the long arc — not just the last 30 days.",
  },
  {
    icon: "download",
    title: "Export everything",
    detail: "Your full journal, yours to keep, any time.",
  },
];

function PlanCard({
  plan,
  selected,
  onPress,
}: {
  plan: Plan;
  selected: boolean;
  onPress: () => void;
}) {
  const t = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={() => {
        haptics.select();
        onPress();
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: t.space[3],
        padding: t.space[4],
        borderRadius: t.radius.lg,
        borderWidth: 1.5,
        borderColor: selected ? t.colors.accent : t.colors.border,
        backgroundColor: selected ? t.colors.accentMuted : t.colors.surface,
      }}
    >
      {/* radio */}
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 2,
          borderColor: selected ? t.colors.accent : t.colors.borderStrong,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <View
            style={{
              width: 11,
              height: 11,
              borderRadius: 6,
              backgroundColor: t.colors.accent,
            }}
          />
        ) : null}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text variant="subheading" color="text">
            {plan.title}
          </Text>
          {plan.badge ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: t.radius.full,
                backgroundColor: t.colors.accent,
              }}
            >
              <Text variant="mono" tint={t.colors.textOnAccent}>
                {plan.badge.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>

        {plan.perMonthString ? (
          <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            {plan.perMonthString}
            {plan.savingsPct ? ` · save ${plan.savingsPct}%` : ""}
          </Text>
        ) : null}
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text variant="bodyStrong" color="text">
          {plan.priceString}
        </Text>
        <Text variant="caption" color="textMuted">
          / {plan.period}
        </Text>
      </View>
    </Pressable>
  );
}

function MemberView({
  celebrate,
  onDone,
}: {
  celebrate: boolean;
  onDone: () => void;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const manage = () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/account/subscriptions"
        : "https://play.google.com/store/account/subscriptions";
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.colors.bg,
        paddingTop: insets.top + t.space[6],
        paddingHorizontal: t.gutter,
        paddingBottom: insets.bottom + t.space[6],
        alignItems: "center",
        justifyContent: "center",
        gap: t.space[5],
      }}
    >
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: t.colors.accentMuted,
          borderWidth: 1.5,
          borderColor: t.colors.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={celebrate ? "check" : "award"}
          size={34}
          colorKey="accentText"
        />
      </View>

      <View style={{ alignItems: "center", gap: t.space[2] }}>
        <Text variant="display" align="center">
          {celebrate ? "You’re all set" : "You’re a member"}
        </Text>
        <Text variant="body" color="textSecondary" align="center">
          {celebrate
            ? "Welcome to Throughline Premium. Your read for today is ready in Insights."
            : "Throughline Premium is active on this account. Thank you for supporting the work."}
        </Text>
      </View>

      <View
        style={{ alignSelf: "stretch", gap: t.space[3], marginTop: t.space[4] }}
      >
        <Button label="Done" size="lg" fullWidth onPress={onDone} />
        <Button
          label="Manage subscription"
          variant="ghost"
          fullWidth
          onPress={manage}
        />
      </View>
    </View>
  );
}

export default function Paywall() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    plans,
    selectedPlanId,
    status,
    isPremium,
    error,
    init,
    reloadPlans,
    selectPlan,
    purchaseSelected,
    restore,
  } = useSubscription();

  const [justPurchased, setJustPurchased] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const selected = plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  const loading = status === "loading";
  const purchasing = status === "purchasing";
  const restoring = status === "restoring";

  const onPurchase = async () => {
    const ok = await purchaseSelected();
    if (ok) {
      haptics.success();
      setJustPurchased(true);
    }
  };

  const onRestore = async () => {
    const ok = await restore();
    if (ok) {
      haptics.success();
      setJustPurchased(true);
    } else {
      Alert.alert(
        "Nothing to restore",
        "We couldn’t find a previous purchase on this account.",
      );
    }
  };

  if (justPurchased || isPremium) {
    return <MemberView celebrate={justPurchased} onDone={close} />;
  }

  const ctaLabel = selected?.trialDays
    ? `Start ${selected.trialDays}-day free trial`
    : "Subscribe";

  const trialNote = selected
    ? selected.trialDays
      ? `${selected.trialDays} days free, then ${selected.priceString} / ${selected.period}. Cancel anytime.`
      : `${selected.priceString} / ${selected.period}. Cancel anytime.`
    : "";

  return (
    <View
      style={{ flex: 1, backgroundColor: t.colors.bg, paddingTop: insets.top }}
    >
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: t.gutter,
          paddingVertical: t.space[2],
        }}
      >
        <Pressable onPress={close} hitSlop={10}>
          <Icon name="chevron-left" size={26} colorKey="text" />
        </Pressable>

        <Pressable onPress={onRestore} hitSlop={10} disabled={restoring}>
          <Text
            variant="label"
            color={restoring ? "textMuted" : "textSecondary"}
          >
            {restoring ? "Restoring…" : "Restore"}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: t.gutter,
          paddingBottom: t.space[6],
          gap: t.space[6],
        }}
      >
        {/* hero */}
        <View
          style={{
            alignItems: "center",
            gap: t.space[4],
            marginTop: t.space[2],
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: t.colors.accentMuted,
              borderWidth: 1.5,
              borderColor: t.colors.accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="award" size={30} colorKey="accentText" />
          </View>
          <View style={{ gap: t.space[2], alignItems: "center" }}>
            <Text variant="overline" color="accentText">
              Throughline Premium
            </Text>
            <Text variant="display" align="center">
              A read every day, not once a month
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              The writing is yours free. Premium reads each day back to you —
              starting with your very first entry, so it’s there the moment you
              subscribe.
            </Text>
          </View>
        </View>

        {/* features */}
        <View style={{ gap: t.space[4] }}>
          {FEATURES.map((f) => (
            <View
              key={f.title}
              style={{ flexDirection: "row", gap: t.space[3] }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: t.radius.md,
                  backgroundColor: t.colors.accentMuted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={f.icon} size={18} colorKey="accentText" />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text variant="bodyStrong" color="text">
                  {f.title}
                </Text>
                <Text variant="callout" color="textSecondary">
                  {f.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* plans */}
        <View style={{ gap: t.space[3] }}>
          {loading ? (
            <Text variant="callout" color="textMuted" align="center">
              Loading plans…
            </Text>
          ) : plans.length > 0 ? (
            plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                selected={selected?.id === p.id}
                onPress={() => selectPlan(p.id)}
              />
            ))
          ) : (
            <View
              style={{
                gap: t.space[3],
                alignItems: "center",
                paddingVertical: t.space[2],
              }}
            >
              <Text variant="callout" color="textMuted" align="center">
                Plans aren’t available right now.
              </Text>
              <Button
                label="Try again"
                variant="secondary"
                size="sm"
                onPress={reloadPlans}
              />
            </View>
          )}
          {error ? (
            <Text variant="caption" color="danger" align="center">
              {error}
            </Text>
          ) : null}
        </View>

        {/* sticky footer */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: t.colors.border,

            gap: t.space[3],
          }}
        >
          <Button
            label={ctaLabel}
            size="lg"
            fullWidth
            loading={purchasing}
            disabled={loading || !selected}
            onPress={onPurchase}
          />
          {trialNote ? (
            <Text variant="caption" color="textMuted" align="center">
              {trialNote}
            </Text>
          ) : null}

          {/* App Store-required disclosure */}
          <Text
            variant="caption"
            color="textMuted"
            align="center"
            style={{ lineHeight: 16 }}
          >
            Payment is charged to your store account at confirmation.
            Subscriptions auto-renew unless cancelled at least 24 hours before
            the period ends.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: t.space[4],
            }}
          >
            <Pressable
              onPress={() => Linking.openURL(TERMS_URL).catch(() => {})}
              hitSlop={8}
            >
              <Text variant="caption" color="textSecondary">
                Terms
              </Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(PRIVACY_URL).catch(() => {})}
              hitSlop={8}
            >
              <Text variant="caption" color="textSecondary">
                Privacy
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
