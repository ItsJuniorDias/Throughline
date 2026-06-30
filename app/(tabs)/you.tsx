/**
 * You — profile + settings. A small summary of your practice, the premium
 * upsell, and the settings list. The privacy row isn't an afterthought: for the
 * most intimate data there is, "encrypted, never used for training" is a real
 * premium argument, so it gets surfaced here.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Linking, Platform, Pressable, Share, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useJournal, computeStreak } from '../../src/data/store';
import { usePremium, useSubscription } from '../../src/data/subscription';
import { shortDate } from '../../src/lib/date';
import { useTheme } from '../../src/theme/ThemeProvider';
import { ScreenScrollView } from '../../src/components/ui/ScreenScrollView';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Surface';
import { Divider, Icon, type IconName } from '../../src/components/ui/Divider';
import { Button } from '../../src/components/ui/Button';
import { SectionHeader } from '../../src/components/journal';

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

export default function YouScreen() {
  const t = useTheme();
  const router = useRouter();
  const entries = useJournal((s) => s.entries);
  const clearAll = useJournal((s) => s.clearAll);
  const isPremium = usePremium();
  const restore = useSubscription((s) => s.restore);
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
      ok ? 'Purchases restored' : 'Nothing to restore',
      ok
        ? 'Throughline Premium is active on this account.'
        : 'We couldn’t find a previous purchase on this account.',
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
      Alert.alert('Nothing to export', 'Write an entry first and it’ll be here to export.');
      return;
    }
    const payload = JSON.stringify(
      { app: 'Throughline', exportedAt: new Date().toISOString(), entries },
      null,
      2,
    );
    try {
      await Share.share({ title: 'Throughline export', message: payload });
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const streak = useMemo(() => computeStreak(entries), [entries]);
  const since = entries.length > 0 ? entries[entries.length - 1].createdAt : null;

  const confirmClear = () =>
    Alert.alert(
      'Clear all entries?',
      'This permanently deletes every entry on this device. This can’t be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete everything', style: 'destructive', onPress: () => clearAll() },
      ],
    );

  return (
    <ScreenScrollView contentStyle={{ gap: t.space[6] }}>
      <View style={{ marginTop: t.space[2] }}>
        <SectionHeader eyebrow="Your practice" title="You" />
      </View>

      {/* summary */}
      <Card elevation="sm" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1, gap: 2 }}>
          <Text variant="monoLarge">{entries.length}</Text>
          <Text variant="caption" color="textMuted">
            entries
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: t.colors.border }} />
        <View style={{ alignItems: 'center', flex: 1, gap: 2 }}>
          <Text variant="monoLarge" color="accentText">
            {streak}
          </Text>
          <Text variant="caption" color="textMuted">
            day streak
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: t.colors.border }} />
        <View style={{ alignItems: 'center', flex: 1, gap: 2 }}>
          <Text variant="bodyStrong" style={{ marginTop: 6 }}>
            {since ? shortDate(since).split(',')[0] : '—'}
          </Text>
          <Text variant="caption" color="textMuted">
            since
          </Text>
        </View>
      </Card>

      {/* premium */}
      <Card accentRail elevation="sm" style={{ gap: t.space[3] }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="award" size={18} colorKey="accentText" />
          <Text variant="subheading" color="accentText" style={{ flex: 1 }}>
            Throughline Premium
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
                ACTIVE
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="body" color="textSecondary">
          {isPremium
            ? 'Your daily reads, mood × theme correlations, all-time analytics, and export are unlocked. Thank you for supporting the work.'
            : 'A read for each day from your very first entry, mood × theme correlations, all-time analytics, and export.'}
        </Text>
        {isPremium ? (
          <Button
            label="Manage subscription"
            variant="ghost"
            size="sm"
            onPress={manageSubscription}
          />
        ) : (
          <Button
            label="See what’s inside"
            variant="secondary"
            size="sm"
            onPress={() => router.push('/paywall')}
          />
        )}
      </Card>

      {/* settings */}
      <Card padded={t.space[2]} elevation="sm">
        <View style={{ paddingHorizontal: t.space[3] }}>
          <Row icon="moon" label="Appearance" detail="Follows your system setting" />
          <Divider />
          <Row
            icon="bell"
            label="Daily reminder"
            detail="A nudge to write each evening"
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
            label="Privacy & data"
            detail="Encrypted on device · never used for training"
            onPress={() =>
              Alert.alert(
                'Privacy & data',
                'Your entries stay on your device and are encrypted at rest. When insights are generated, content is processed by providers configured not to train on your data.',
              )
            }
          />
          <Divider />
          <Row
            icon="download"
            label="Export entries"
            detail={
              isPremium
                ? 'Download everything as JSON'
                : 'Download everything as JSON · Premium'
            }
            onPress={onExport}
          />
          <Divider />
          <Row
            icon="refresh-ccw"
            label="Restore purchases"
            detail="Already subscribed? Restore on this device"
            onPress={onRestore}
          />
        </View>
      </Card>

      {/* danger */}
      <Card padded={t.space[2]} elevation="sm">
        <View style={{ paddingHorizontal: t.space[3] }}>
          <Row icon="trash-2" label="Clear all entries" danger onPress={confirmClear} />
        </View>
      </Card>

      <Text variant="caption" color="textMuted" align="center">
        Throughline · v0.1.0
      </Text>
    </ScreenScrollView>
  );
}
