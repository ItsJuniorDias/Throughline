/**
 * You — profile + settings. A small summary of your practice, the premium
 * upsell, the language switcher, and the settings list. The privacy row isn't an
 * afterthought: for the most intimate data there is, "encrypted, never used for
 * training" is a real premium argument, so it gets surfaced here.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Linking, Platform, Pressable, Share, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJournal, computeStreak } from '../../src/data/store';
import {
  usePremium,
  useSubscription,
  ALLOW_PREMIUM_OVERRIDE,
  type PremiumOverride,
} from '../../src/data/subscription';
import { shortDate } from '../../src/lib/date';
import {
  useTranslation,
  LANGUAGES,
  LANGUAGE_ORDER,
  type LangCode,
} from '../../src/i18n';
import { haptics } from '../../src/lib/haptics';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ScreenScrollView } from '../../src/components/ui/ScreenScrollView';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Surface';
import { Divider, Icon, type IconName } from '../../src/components/ui/Divider';
import { Button } from '../../src/components/ui/Button';
import { SectionHeader } from '../../src/components/journal';

const APP_VERSION = '0.1.0';

function Row({
  icon,
  label,
  detail,
  onPress,
  trailing,
  danger,
}: {
  icon: IconName;
  label: string;
  detail?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  danger?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => ({
        opacity: pressed && onPress ? 0.7 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.space[3],
        paddingVertical: t.space[3],
      })}
    >
      <Icon name={icon} size={19} colorKey={danger ? 'danger' : 'textSecondary'} />
      <View style={{ flex: 1 }}>
        <Text variant="body" color={danger ? 'danger' : 'text'}>
          {label}
        </Text>
        {detail ? (
          <Text variant="caption" color="textMuted">
            {detail}
          </Text>
        ) : null}
      </View>
      {trailing ?? (onPress ? <Icon name="chevron-right" size={18} colorKey="textMuted" /> : null)}
    </Pressable>
  );
}

/**
 * LanguageCard — the app-language switcher. Lists every supported language by its
 * own name (autonym) with the English name beneath, and a check on the active
 * one. Tapping sets the language instantly; the choice persists and the whole
 * tree re-renders via the i18n store.
 */
function LanguageCard() {
  const t = useTheme();
  const { tr, lang, setLang } = useTranslation();

  return (
    <Card padded={t.space[2]} elevation="sm">
      <View style={{ paddingHorizontal: t.space[3] }}>
        {/* header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: t.space[3],
            paddingVertical: t.space[3],
          }}
        >
          <Icon name="globe" size={19} colorKey="textSecondary" />
          <View style={{ flex: 1 }}>
            <Text variant="body" color="text">
              {tr('language.title')}
            </Text>
            <Text variant="caption" color="textMuted">
              {tr('language.detail')}
            </Text>
          </View>
        </View>
        <Divider />

        {/* options */}
        {LANGUAGE_ORDER.map((code: LangCode, i: number) => {
          const meta = LANGUAGES[code];
          const active = lang === code;
          return (
            <View key={code}>
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => {
                  if (active) return;
                  haptics.select();
                  setLang(code);
                }}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: t.space[3],
                  paddingVertical: t.space[3],
                })}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="body" color={active ? 'accentText' : 'text'}>
                    {meta.label}
                  </Text>
                  <Text variant="caption" color="textMuted">
                    {meta.english}
                  </Text>
                </View>
                {active ? <Icon name="check" size={18} colorKey="accentText" /> : null}
              </Pressable>
              {i < LANGUAGE_ORDER.length - 1 ? <Divider /> : null}
            </View>
          );
        })}
      </View>
    </Card>
  );
}

export default function YouScreen() {
  const t = useTheme();
  const { tr } = useTranslation();
  const router = useRouter();
  const entries = useJournal((s) => s.entries);
  const clearAll = useJournal((s) => s.clearAll);
  const isPremium = usePremium();
  const restore = useSubscription((s) => s.restore);
  const premiumOverride = useSubscription((s) => s.premiumOverride);
  const setPremiumOverride = useSubscription((s) => s.setPremiumOverride);
  const rcPremium = useSubscription((s) => s.isPremium); // raw RevenueCat/cache value
  const [reminders, setReminders] = useState(true);

  const manageSubscription = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/account/subscriptions'
        : 'https://play.google.com/store/account/subscriptions';
    Linking.openURL(url).catch(() => {});
  };

  const onRestore = async () => {
    const ok = await restore();
    Alert.alert(
      ok ? tr('settings.restoredTitle') : tr('settings.nothingRestoreTitle'),
      ok ? tr('settings.restoredBody') : tr('settings.nothingRestoreBody'),
    );
  };

  // Export is a Premium feature: build a JSON snapshot of every entry and hand
  // it to the native share sheet. Free users are sent to the paywall instead.
  const onExport = async () => {
    if (!isPremium) {
      router.push('/paywall');
      return;
    }
    if (entries.length === 0) {
      Alert.alert(tr('settings.nothingExportTitle'), tr('settings.nothingExportBody'));
      return;
    }
    const payload = JSON.stringify(
      { app: 'Throughline', exportedAt: new Date().toISOString(), entries },
      null,
      2,
    );
    try {
      await Share.share({ title: tr('settings.exportShareTitle'), message: payload });
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const since = entries.length > 0 ? entries[entries.length - 1].createdAt : null;

  const confirmClear = () =>
    Alert.alert(tr('settings.clearTitle'), tr('settings.clearBody'), [
      { text: tr('common.cancel'), style: 'cancel' },
      { text: tr('settings.clearConfirm'), style: 'destructive', onPress: () => clearAll() },
    ]);

  const overrideOptions = [
    { key: 'auto', labelKey: 'you.overrideAuto', value: null },
    { key: 'premium', labelKey: 'you.overridePremium', value: true },
    { key: 'free', labelKey: 'you.overrideFree', value: false },
  ] as { key: string; labelKey: string; value: PremiumOverride }[];

  return (
    <ScreenScrollView contentStyle={{ gap: t.space[6] }}>
      <View style={{ marginTop: t.space[2] }}>
        <SectionHeader eyebrow={tr('you.eyebrow')} title={tr('you.title')} />
      </View>

      {/* summary */}
      <Card elevation="sm" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1, gap: 2 }}>
          <Text variant="monoLarge">{entries.length}</Text>
          <Text variant="caption" color="textMuted">
            {tr('you.entries')}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: t.colors.border }} />
        <View style={{ alignItems: 'center', flex: 1, gap: 2 }}>
          <Text variant="monoLarge" color="accentText">
            {streak}
          </Text>
          <Text variant="caption" color="textMuted">
            {tr('you.dayStreak')}
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: t.colors.border }} />
        <View style={{ alignItems: 'center', flex: 1, gap: 2 }}>
          <Text variant="bodyStrong" style={{ marginTop: 6 }}>
            {since ? shortDate(since).split(',')[0] : '—'}
          </Text>
          <Text variant="caption" color="textMuted">
            {tr('you.since')}
          </Text>
        </View>
      </Card>

      {/* premium */}
      <Card accentRail elevation="sm" style={{ gap: t.space[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="award" size={18} colorKey="accentText" />
          <Text variant="subheading" color="accentText" style={{ flex: 1 }}>
            {tr('you.premiumTitle')}
          </Text>
          {isPremium ? (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: t.radius.full,
                backgroundColor: t.colors.accent,
              }}
            >
              <Text variant="mono" tint={t.colors.textOnAccent}>
                {tr('you.active')}
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="body" color="textSecondary">
          {isPremium ? tr('you.premiumBodyActive') : tr('you.premiumBodyInactive')}
        </Text>
        {isPremium ? (
          <Button
            label={tr('you.manage')}
            variant="ghost"
            size="sm"
            onPress={manageSubscription}
          />
        ) : (
          <Button
            label={tr('you.seeInside')}
            variant="secondary"
            size="sm"
            onPress={() => router.push('/paywall')}
          />
        )}
      </Card>

      {/* premium override — dev only, never honored in production builds */}
      {ALLOW_PREMIUM_OVERRIDE ? (
        <Card elevation="sm" style={{ gap: t.space[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="sliders" size={18} colorKey="textSecondary" />
            <Text variant="subheading" style={{ flex: 1 }}>
              {tr('you.overrideTitle')}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: t.radius.full,
                backgroundColor: t.colors.surfaceMuted,
                borderWidth: 1,
                borderColor: t.colors.border,
              }}
            >
              <Text variant="mono" color="textMuted">
                {tr('you.overrideDev')}
              </Text>
            </View>
          </View>
          <Text variant="caption" color="textMuted">
            {tr('you.overrideNote', {
              status: rcPremium ? tr('you.overrideActive') : tr('you.overrideInactive'),
            })}
          </Text>
          <View style={{ flexDirection: 'row', gap: t.space[2] }}>
            {overrideOptions.map((opt) => {
              const active = premiumOverride === opt.value;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setPremiumOverride(opt.value)}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: t.space[3],
                    borderRadius: t.radius.md,
                    borderWidth: 1.5,
                    borderColor: active ? t.colors.accent : t.colors.border,
                    backgroundColor: active ? t.colors.accentMuted : t.colors.surface,
                  }}
                >
                  <Text variant="label" color={active ? 'accentText' : 'textSecondary'}>
                    {tr(opt.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ) : null}

      {/* language */}
      <LanguageCard />

      {/* settings */}
      <Card padded={t.space[2]} elevation="sm">
        <View style={{ paddingHorizontal: t.space[3] }}>
          <Row
            icon="moon"
            label={tr('settings.appearance')}
            detail={tr('settings.appearanceDetail')}
          />
          <Divider />
          <Row
            icon="bell"
            label={tr('settings.reminder')}
            detail={tr('settings.reminderDetail')}
            trailing={
              <Switch
                value={reminders}
                onValueChange={setReminders}
                trackColor={{ true: t.colors.accent, false: t.colors.borderStrong }}
                thumbColor={t.colors.elevated}
              />
            }
          />
          <Divider />
          <Row
            icon="lock"
            label={tr('settings.privacy')}
            detail={tr('settings.privacyDetail')}
            onPress={() =>
              Alert.alert(tr('settings.privacyTitle'), tr('settings.privacyBody'))
            }
          />
          <Divider />
          <Row
            icon="download"
            label={tr('settings.export')}
            detail={
              isPremium ? tr('settings.exportDetail') : tr('settings.exportDetailPremium')
            }
            onPress={onExport}
          />
          <Divider />
          <Row
            icon="refresh-ccw"
            label={tr('settings.restore')}
            detail={tr('settings.restoreDetail')}
            onPress={onRestore}
          />
        </View>
      </Card>

      {/* danger */}
      <Card padded={t.space[2]} elevation="sm">
        <View style={{ paddingHorizontal: t.space[3] }}>
          <Row icon="trash-2" label={tr('settings.clear')} danger onPress={confirmClear} />
        </View>
      </Card>

      <Text variant="caption" color="textMuted" align="center">
        {tr('common.footer', { version: APP_VERSION })}
      </Text>
    </ScreenScrollView>
  );
}
