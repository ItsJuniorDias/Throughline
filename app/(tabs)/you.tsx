/**
 * You — profile + settings. A small summary of your practice, the premium
 * upsell, and the settings list. The privacy row isn't an afterthought: for the
 * most intimate data there is, "encrypted, never used for training" is a real
 * premium argument, so it gets surfaced here.
 */

import React, { useMemo, useState } from 'react';
import { Alert, Pressable, Switch, View } from 'react-native';
import { useJournal, computeStreak } from '../../src/data/store';
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
  const entries = useJournal((s) => s.entries);
  const clearAll = useJournal((s) => s.clearAll);
  const [reminders, setReminders] = useState(true);

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
      <Pressable>
        <Card accentRail elevation="sm" style={{ gap: t.space[3] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="award" size={18} colorKey="accentText" />
            <Text variant="subheading" color="accentText">
              Throughline Premium
            </Text>
          </View>
          <Text variant="body" color="textSecondary">
            Deep monthly reports, richer weekly insights, and pattern analytics across your whole
            history.
          </Text>
          <Button label="See what’s inside" variant="secondary" size="sm" onPress={() => {}} />
        </Card>
      </Pressable>

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
            detail="Download everything as JSON"
            onPress={() => Alert.alert('Export', 'Hook this up to your export flow.')}
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
