/**
 * Timeline — the throughline made literal: every entry threaded top to bottom on
 * the gold seam. A theme filter narrows the thread to one tag. (For a large
 * dataset you'd swap the map for a FlatList; kept simple here so the seam reads
 * as one continuous line.)
 */

import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useJournal, themeFrequency } from "../../src/data/store";
import { useTheme } from "../../src/theme/ThemeProvider";
import { ScreenScrollView } from "../../src/components/ui/ScreenScrollView";
import { Text } from "../../src/components/ui/Text";
import { Button } from "../../src/components/ui/Button";
import { Chip } from "../../src/components/ui/Chip";
import { Icon } from "../../src/components/ui/Divider";
import { EntryCard, SectionHeader } from "../../src/components/journal";

export default function TimelineScreen() {
  const t = useTheme();
  const router = useRouter();
  const entries = useJournal((s) => s.entries);
  const [filter, setFilter] = useState<string | null>(null);

  const topTags = useMemo(() => themeFrequency(entries).slice(0, 8), [entries]);
  const shown = useMemo(
    () => (filter ? entries.filter((e) => e.tags.includes(filter)) : entries),
    [entries, filter],
  );

  return (
    <ScreenScrollView contentStyle={{ gap: t.space[5] }}>
      <View style={{ marginTop: t.space[2] }}>
        <SectionHeader eyebrow={`${entries.length} entries`} title="Timeline" />
      </View>

      {/* theme filter */}
      {topTags.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: t.space[5] }}
          style={{ marginHorizontal: -t.gutter, paddingHorizontal: t.gutter }}
        >
          <Chip
            label="All"
            selected={filter === null}
            onPress={() => setFilter(null)}
          />
          {topTags.map((tag) => (
            <Chip
              key={tag.tag}
              label={`${tag.tag} · ${tag.count}`}
              selected={filter === tag.tag}
              onPress={() => setFilter(filter === tag.tag ? null : tag.tag)}
            />
          ))}
        </ScrollView>
      ) : null}

      {/* the thread */}
      {shown.length > 0 ? (
        <View>
          {shown.map((entry, i) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              isFirst={i === 0}
              isLast={i === shown.length - 1}
              onPress={() => router.push(`/entry/${entry.id}`)}
            />
          ))}
        </View>
      ) : (
        <View
          style={{
            alignItems: "center",
            gap: t.space[4],
            paddingVertical: t.space[11],
          }}
        >
          <Icon name="feather" size={28} colorKey="textMuted" />

          <Text variant="serifBody" color="textSecondary" align="center">
            {filter
              ? `No entries tagged “${filter}”.`
              : "Your timeline starts with one entry."}
          </Text>

          {!filter ? (
            <Button
              label="Write the first one"
              onPress={() => router.push("/entry/new")}
              fullWidth
            />
          ) : (
            <Button
              label="Clear filter"
              variant="ghost"
              onPress={() => setFilter(null)}
              fullWidth
            />
          )}
        </View>
      )}
    </ScreenScrollView>
  );
}
