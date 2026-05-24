import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, fonts } from '../theme';
import { scoreColor } from '../lib/scoring';

export default function RatingSlider({ category, value, onChange, isPro }) {
  const tint = scoreColor(value);
  return (
    <View style={styles.row}>
      <View style={styles.head}>
        <Text style={styles.emoji}>{category.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>
            {category.label}
            {isPro && (
              <Text style={styles.weight}> · {Math.round(category.weight * 100)}%</Text>
            )}
          </Text>
          <Text style={styles.desc}>{category.desc}</Text>
        </View>
        <Text style={[styles.value, { color: tint }]}>{value}</Text>
      </View>
      <Slider
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={tint}
        maximumTrackTintColor={colors.creamDeep}
        thumbTintColor={Platform.OS === 'android' ? tint : undefined}
        style={{ width: '100%', height: 36 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  emoji: { fontSize: 22 },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 15,
    color: colors.ink,
  },
  weight: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ash,
  },
  desc: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ash,
    marginTop: 1,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 26,
    minWidth: 42,
    textAlign: 'right',
  },
});
