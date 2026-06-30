/**
 * Entry detail — the full entry. Date, mood, the prompt it answered (if any),
 * the complete prose, and tags. A delete action lives in the header.
 */

import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournal, getEntryById } from '../../src/data/store';
import { useInsights } from '../../src/data/insights';
import { promptById } from '../../src/constants/prompts';
import { shortDate, clockTime } from '../../src/lib/date';
import { moodMeta } from '../../src/lib/mood';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useT } from '../../src/i18n';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { Icon } from '../../src/components/ui/Divider';
import { haptics } from '../../src/lib/haptics';

export default function EntryDetailScreen() {
  const t = useTheme();
  const tr = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entries = useJournal((s) => s.entries);
  const deleteEntry = useJournal((s) => s.deleteEntry);

  const entry = getEntryById(entries, id);
  const prompt = entry ? promptById(entry.promptId) : undefined;
  const mood = entry ? moodMeta(entry.mood) : null;

  const insightStatus = useInsights((s) => (entry ? s.entryStatus[entry.id] : undefined));
  const insightError = useInsights((s) => (entry ? s.entryError[entry.id] : undefined));
  const generateEntry = useInsights((s) => s.generateEntry);
  const reflection = entry?.summary?.reflection;
  const gist = entry?.summary?.gist;

  // generate this note's insight on open if it doesn't have one yet
  useEffect(() => {
    if (entry && !entry.summary?.reflection) generateEntry(entry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.id]);

  const confirmDelete = () =>
    Alert.alert(tr('entry.deleteTitle'), tr('entry.deleteBody'), [
      { text: tr('common.cancel'), style: 'cancel' },
      {
        text: tr('common.delete'),
        style: 'destructive',
        onPress: () => {
          haptics.warning();
          if (entry) deleteEntry(entry.id);
          router.back();
        },
      },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, paddingTop: insets.top }}>
      {/* header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: t.gutter,
          paddingVertical: t.space[2],
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Icon name="chevron-left" size={26} colorKey="text" />
        </Pressable>
        {entry ? (
          <Pressable onPress={confirmDelete} hitSlop={10}>
            <Icon name="trash-2" size={20} colorKey="danger" />
          </Pressable>
        ) : null}
      </View>

      {!entry ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: t.space[3] }}>
          <Text variant="serifBody" color="textSecondary">
            {tr('entry.gone')}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: t.gutter,
            paddingBottom: insets.bottom + t.space[10],
            gap: t.space[5],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* date + mood */}
          <View style={{ gap: t.space[3], marginTop: t.space[2] }}>
            <Text variant="mono" color="textSecondary">
              {shortDate(entry.createdAt).toUpperCase()} · {clockTime(entry.createdAt)}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: mood!.color }}
              />
              <Text variant="title" tint={mood!.color}>
                {tr(`mood.${mood!.key}`)}
              </Text>
            </View>
          </View>

          {/* prompt context */}
          {prompt ? (
            <View
              style={{
                borderLeftWidth: 3,
                borderLeftColor: t.colors.accent,
                paddingLeft: t.space[4],
                gap: 4,
              }}
            >
              <Text variant="overline" color="accentText">
                {tr('entry.inResponseTo')}
              </Text>
              <Text variant="serifQuote" color="textSecondary">
                {prompt.text}
              </Text>
            </View>
          ) : null}

          {/* prose */}
          <Text variant="serifBody" color="text">
            {entry.text}
          </Text>

          {/* per-entry insight (generated on save) */}
          <View
            style={{
              borderRadius: t.radius.xl,
              borderWidth: 1,
              borderColor: t.colors.border,
              backgroundColor: t.colors.surface,
              padding: t.space[5],
              gap: t.space[3],
              ...t.shadow('sm'),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text variant="overline" color="accentText">
                {tr('entry.insight')}
              </Text>
              {reflection && insightStatus !== 'loading' ? (
                <Pressable onPress={() => entry && generateEntry(entry, true)} hitSlop={8}>
                  <Icon name="refresh-cw" size={15} colorKey="textMuted" />
                </Pressable>
              ) : null}
            </View>

            {gist ? (
              <Text variant="mono" color="textMuted">
                {gist}
              </Text>
            ) : null}

            {insightStatus === 'loading' && !reflection ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: t.space[3] }}>
                <ActivityIndicator color={t.colors.accent} />
                <Text variant="body" color="textMuted">
                  {tr('entry.reading')}
                </Text>
              </View>
            ) : reflection ? (
              <Text variant="serifBody" color="text">
                {reflection}
              </Text>
            ) : insightStatus === 'error' ? (
              <View style={{ gap: t.space[2] }}>
                <Text variant="body" color="textSecondary">
                  {tr('entry.insightError')}
                </Text>
                {insightError ? (
                  <Text variant="caption" color="textMuted">
                    {insightError}
                  </Text>
                ) : null}
                <Button
                  label={tr('common.tryAgain')}
                  variant="secondary"
                  size="sm"
                  onPress={() => entry && generateEntry(entry, true)}
                />
              </View>
            ) : null}

            <Text variant="caption" color="textMuted">
              {tr('entry.reflectionNote')}
            </Text>
          </View>

          {/* tags */}
          {entry.tags.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: t.space[2] }}>
              {entry.tags.map((tag) => (
                <Chip key={tag} label={tag} />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}
