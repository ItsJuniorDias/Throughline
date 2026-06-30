/**
 * SectionHeader — an editorial section header: a tracked sans eyebrow over a
 * serif title, with an optional trailing action. The eyebrow encodes a real
 * label (the section's role), not decoration.
 */

import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/Text';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  trailing?: React.ReactNode;
}

export function SectionHeader({ eyebrow, title, trailing }: SectionHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        {eyebrow ? (
          <Text variant="overline" color="accentText">
            {eyebrow}
          </Text>
        ) : null}
        <Text variant="heading">{title}</Text>
      </View>
      {trailing}
    </View>
  );
}
