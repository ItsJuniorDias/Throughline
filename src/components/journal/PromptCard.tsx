/**
 * PromptCard — surfaces the day's reflection prompt in the serif voice. Tapping
 * it opens the composer with the prompt attached. The gold accent rail marks it
 * as the day's invitation to write.
 */

import React from "react";
import { Pressable, View } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { haptics } from "../../lib/haptics";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Divider";
import { useT } from "../../i18n";

export interface PromptCardProps {
  prompt: string;
  onPress?: () => void;
}

export function PromptCard({ prompt, onPress }: PromptCardProps) {
  const t = useTheme();
  const tr = useT();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        haptics.tap();
        onPress?.();
      }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.92 : 1,
        borderRadius: t.radius.xl,
        backgroundColor: t.colors.surface,
        borderWidth: 1,
        borderColor: t.colors.border,
        overflow: "hidden",
        ...t.shadow("sm"),
      })}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: t.colors.accent,
        }}
      />
      <View style={{ padding: t.space[5], gap: 14 }}>
        <Text variant="overline" color="accentText">
          {tr("prompt.eyebrow")}
        </Text>

        <Text variant="serifQuote" color="text">
          {prompt}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text variant="label" color="accentText">
            {tr("prompt.cta")}
          </Text>
          <Icon name="arrow-right" size={16} colorKey="accentText" />
        </View>
      </View>
    </Pressable>
  );
}
