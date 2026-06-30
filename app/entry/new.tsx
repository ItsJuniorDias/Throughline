/**
 * Compose — the entry composer, presented as a modal. Mood is required; the
 * prose is the serif voice; tags are quick toggles plus a free-text add. If a
 * prompt was tapped on Today it rides along as context (and is attached to the
 * saved entry). On save we run the crisis guardrail (caring, non-blocking).
 */

import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useJournal } from '../../src/data/store';
import { promptById } from '../../src/constants/prompts';
import { themeFrequency } from '../../src/data/store';
import { containsCrisisLanguage, CRISIS_SUPPORT } from '../../src/lib/safety';
import { haptics } from '../../src/lib/haptics';
import { useTheme } from '../../src/theme/ThemeProvider';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Chip } from '../../src/components/ui/Chip';
import { Icon } from '../../src/components/ui/Divider';
import { MoodPicker } from '../../src/components/journal';
import type { Mood } from '../../src/data/types';

const DEFAULT_TAGS = ['work', 'family', 'friends', 'health', 'focus', 'tired', 'win', 'morning'];

export default function ComposeScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ promptId?: string; mood?: string }>();
  const entries = useJournal((s) => s.entries);
  const addEntry = useJournal((s) => s.addEntry);

  const prompt = promptById(params.promptId);
  const initialMood = params.mood ? (Number(params.mood) as Mood) : null;

  const [mood, setMood] = useState<Mood | null>(initialMood);
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [draftTag, setDraftTag] = useState('');

  const suggested = useMemo(() => {
    const used = themeFrequency(entries)
      .slice(0, 6)
      .map((x) => x.tag);
    const merged = [...new Set([...used, ...DEFAULT_TAGS])].slice(0, 10);
    return merged;
  }, [entries]);

  const canSave = mood != null && text.trim().length > 0;

  const toggleTag = (tag: string) =>
    setTags((cur) => (cur.includes(tag) ? cur.filter((x) => x !== tag) : [...cur, tag]));

  const addDraftTag = () => {
    const tag = draftTag.trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags((cur) => [...cur, tag]);
    setDraftTag('');
  };

  const save = () => {
    if (!canSave || mood == null) return;
    addEntry({ text, mood, tags, promptId: params.promptId });
    haptics.success();
    if (containsCrisisLanguage(text)) {
      Alert.alert(CRISIS_SUPPORT.title, CRISIS_SUPPORT.message, [
        { text: 'Okay', onPress: () => router.back() },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.colors.bg, paddingTop: insets.top }}>
      {/* modal header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: t.gutter,
          paddingBottom: t.space[3],
          paddingTop: t.space[2],
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text variant="label" color="textSecondary">
            Cancel
          </Text>
        </Pressable>
        <Text variant="subheading">New entry</Text>
        <Pressable onPress={save} disabled={!canSave} hitSlop={10}>
          <Text variant="label" color={canSave ? 'accentText' : 'textMuted'}>
            Save
          </Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 48}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: t.gutter,
            paddingBottom: insets.bottom + t.space[8],
            gap: t.space[6],
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
                Responding to
              </Text>
              <Text variant="serifQuote" color="textSecondary">
                {prompt.text}
              </Text>
            </View>
          ) : null}

          {/* mood */}
          <View style={{ gap: t.space[3] }}>
            <Text variant="overline" color="textMuted">
              How did today feel?
            </Text>
            <MoodPicker value={mood} onChange={setMood} />
          </View>

          {/* prose */}
          <View style={{ gap: t.space[2] }}>
            <Text variant="overline" color="textMuted">
              Your entry
            </Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write freely…"
              placeholderTextColor={t.colors.textMuted}
              multiline
              autoFocus
              textAlignVertical="top"
              style={{
                minHeight: 160,
                fontFamily: t.family.serif.regular,
                fontSize: t.fontSize.lg,
                lineHeight: 29,
                color: t.colors.text,
                paddingVertical: t.space[2],
              }}
            />
          </View>

          {/* tags */}
          <View style={{ gap: t.space[3] }}>
            <Text variant="overline" color="textMuted">
              Tags
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[...new Set([...tags, ...suggested])].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  selected={tags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                />
              ))}
            </View>

            {/* custom tag input */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderWidth: 1,
                borderColor: t.colors.border,
                borderRadius: t.radius.md,
                paddingHorizontal: t.space[3],
                backgroundColor: t.colors.surfaceMuted,
              }}
            >
              <Icon name="tag" size={16} colorKey="textMuted" />
              <TextInput
                value={draftTag}
                onChangeText={setDraftTag}
                placeholder="Add a tag"
                placeholderTextColor={t.colors.textMuted}
                onSubmitEditing={addDraftTag}
                returnKeyType="done"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  paddingVertical: t.space[3],
                  fontFamily: t.family.sans.regular,
                  fontSize: t.fontSize.base,
                  color: t.colors.text,
                }}
              />
              {draftTag.trim() ? (
                <Pressable onPress={addDraftTag} hitSlop={8}>
                  <Icon name="plus" size={18} colorKey="accentText" />
                </Pressable>
              ) : null}
            </View>
          </View>

          <Button label="Save entry" size="lg" fullWidth disabled={!canSave} onPress={save} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
