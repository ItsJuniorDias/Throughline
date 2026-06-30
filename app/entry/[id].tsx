/**
 * Entry detail — the full entry. Date, mood, the prompt it answered (if any),
 * the complete prose, and tags. A delete action lives in the header.
 */

import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournal, getEntryById } from '../../src/data/store';
import { promptById } from '../../src/constants/prompts';
import { shortDate, clockTime } from '../../src/lib/date';
import { moodMeta } from '../../src/lib/mood';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Text } from '../../src/components/ui/Text';
import { Chip } from '../../src/components/ui/Chip';
import { Icon } from '../../src/components/ui/Divider';
import { haptics } from '../../src/lib/haptics';

export default function EntryDetailScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entries = useJournal((s) => s.entries);
  const deleteEntry = useJournal((s) => s.deleteEntry);

  const entry = getEntryById(entries, id);
  const prompt = entry ? promptById(entry.promptId) : undefined;
  const mood = entry ? moodMeta(entry.mood) : null;

  const confirmDelete = () =>
    Alert.alert('Delete entry?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
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
            This entry is no longer here.
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
                {mood!.label}
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
                In response to
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
