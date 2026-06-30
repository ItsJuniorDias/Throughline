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
import { usePremium, useSubscription } from "../src/data/subscription";
import { useTheme } from "../src/theme/ThemeProvider";
import { haptics } from "../src/lib/haptics";
import { Text } from "../src/components/ui/Text";
import { Button } from "../src/components/ui/Button";
import { Icon, type IconName } from "../src/components/ui/Divider";
import type { Plan } from "../src/lib/purchases";
import { useT } from "../src/i18n";

const TERMS_URL = "https://throughline.app/terms";
const PRIVACY_URL = "https://throughline.app/privacy";

const FEATURES: { icon: IconName; titleKey: string; detailKey: string }[] = [
  { icon: "sunrise", titleKey: "paywall.feature1Title", detailKey: "paywall.feature1Detail" },
  { icon: "git-merge", titleKey: "paywall.feature2Title", detailKey: "paywall.feature2Detail" },
  { icon: "trending-up", titleKey: "paywall.feature3Title", detailKey: "paywall.feature3Detail" },
  { icon: "download", titleKey: "paywall.feature4Title", detailKey: "paywall.feature4Detail" },
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
  const tr = useT();
  const title = plan.titleKey ? tr(plan.titleKey) : plan.title;
  const period = plan.periodKey ? tr(plan.periodKey) : plan.period;
  const badge = plan.badgeKey ? tr(plan.badgeKey) : plan.badge;
  const perMonth = plan.perMonthPrice
    ? tr("paywall.perMonth", { price: plan.perMonthPrice })
    : plan.perMonthString;

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
            {title}
          </Text>
          {badge ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: t.radius.full,
                backgroundColor: t.colors.accent,
              }}
            >
              <Text variant="mono" tint={t.colors.textOnAccent}>
                {badge.toUpperCase()}
              </Text>
            </View>
          ) : null}
        </View>

        {perMonth ? (
          <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
            {perMonth}
            {plan.savingsPct ? ` · ${tr("paywall.save", { pct: plan.savingsPct })}` : ""}
          </Text>
        ) : null}
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text variant="bodyStrong" color="text">
          {plan.priceString}
        </Text>
        <Text variant="caption" color="textMuted">
          {`/ ${period}`}
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
  const tr = useT();
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
          {celebrate ? tr("paywall.memberAllSetTitle") : tr("paywall.memberTitle")}
        </Text>
        <Text variant="body" color="textSecondary" align="center">
          {celebrate ? tr("paywall.memberAllSetBody") : tr("paywall.memberBody")}
        </Text>
      </View>

      <View
        style={{ alignSelf: "stretch", gap: t.space[3], marginTop: t.space[4] }}
      >
        <Button label={tr("common.done")} size="lg" fullWidth onPress={onDone} />
        <Button
          label={tr("you.manage")}
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
  const tr = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    plans,
    selectedPlanId,
    status,
    error,
    init,
    reloadPlans,
    selectPlan,
    purchaseSelected,
    restore,
  } = useSubscription();
  const isPremium = usePremium(); // effective (honors the local override)

  const [justPurchased, setJustPurchased] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  const close = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  const selected = plans.find((p) => p.id === selectedPlanId) ?? plans[0];
  const selectedPeriod = selected?.periodKey ? tr(selected.periodKey) : selected?.period ?? "";
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
        tr("settings.nothingRestoreTitle"),
        tr("settings.nothingRestoreBody"),
      );
    }
  };

  if (justPurchased || isPremium) {
    return <MemberView celebrate={justPurchased} onDone={close} />;
  }

  const ctaLabel = selected?.trialDays
    ? tr("paywall.startTrial", { days: selected.trialDays })
    : tr("paywall.subscribe");

  const trialNote = selected
    ? selected.trialDays
      ? tr("paywall.trialNote", {
          days: selected.trialDays,
          price: selected.priceString,
          period: selectedPeriod,
        })
      : tr("paywall.noTrialNote", { price: selected.priceString, period: selectedPeriod })
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
            {restoring ? tr("paywall.restoring") : tr("paywall.restore")}
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
              {tr("paywall.eyebrow")}
            </Text>
            <Text variant="display" align="center">
              {tr("paywall.heroTitle")}
            </Text>
            <Text variant="body" color="textSecondary" align="center">
              {tr("paywall.heroBody")}
            </Text>
          </View>
        </View>

        {/* features */}
        <View style={{ gap: t.space[4] }}>
          {FEATURES.map((f) => (
            <View
              key={f.titleKey}
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
                  {tr(f.titleKey)}
                </Text>
                <Text variant="callout" color="textSecondary">
                  {tr(f.detailKey)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* plans */}
        <View style={{ gap: t.space[3] }}>
          {loading ? (
            <Text variant="callout" color="textMuted" align="center">
              {tr("paywall.loadingPlans")}
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
                {tr("paywall.noPlans")}
              </Text>
              <Button
                label={tr("common.tryAgain")}
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
            {tr("paywall.disclosure")}
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
                {tr("paywall.terms")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => Linking.openURL(PRIVACY_URL).catch(() => {})}
              hitSlop={8}
            >
              <Text variant="caption" color="textSecondary">
                {tr("paywall.privacy")}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
