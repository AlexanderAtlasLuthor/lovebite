import React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';
import { colors } from '../theme';

export default function ProStars({ count, size = 16, gap = 2 }) {
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {[0, 1, 2, 3].map((i) => (
        <Star
          key={i}
          size={size}
          color={i < count ? colors.cherry : colors.line}
          fill={i < count ? colors.cherry : 'transparent'}
          strokeWidth={1.8}
        />
      ))}
    </View>
  );
}
