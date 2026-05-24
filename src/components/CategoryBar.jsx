import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';
import { scoreColor } from '../lib/scoring';

export default function CategoryBar({ category, value, isPro }) {
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
        <Text style={[styles.value, { color: tint }]}>
          {value}
          <Text style={styles.outOf}>/10</Text>
        </Text>
      </View>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${value * 10}%`, backgroundColor: tint }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  emoji: { fontSize: 20 },
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
    fontSize: 22,
    minWidth: 50,
    textAlign: 'right',
  },
  outOf: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.ash,
  },
  bar: {
    height: 6,
    backgroundColor: colors.creamDeep,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
