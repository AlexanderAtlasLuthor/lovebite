import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award } from 'lucide-react-native';
import { colors, fonts } from '../theme';
import { getScore } from '../lib/scoring';

export default function StatsRow({ reviews }) {
  if (!reviews.length) return null;
  const total = reviews.length;
  const avgScore = reviews.reduce((s, r) => s + getScore(r), 0) / total;
  const best = reviews.reduce((b, r) => (getScore(r) > getScore(b) ? r : b));

  return (
    <View style={styles.container}>
      <Stat num={String(total)} label="Restaurantes" />
      <View style={styles.divider} />
      <Stat num={avgScore.toFixed(1)} label="Promedio" />
      <View style={styles.divider} />
      <Stat
        num={best.name}
        compact
        label={
          <>
            <Award size={10} color={colors.ash} /> Favorito ({getScore(best).toFixed(1)})
          </>
        }
      />
    </View>
  );
}

function Stat({ num, label, compact }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.num, compact && styles.numCompact]} numberOfLines={1}>
        {num}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
  },
  stat: { flex: 1, alignItems: 'flex-start' },
  num: {
    fontFamily: fonts.displayBold,
    fontSize: 26,
    color: colors.cherry,
    lineHeight: 28,
  },
  numCompact: {
    fontSize: 15,
    fontFamily: fonts.displayBold,
    color: colors.burgundy,
  },
  label: {
    fontSize: 10,
    color: colors.ash,
    letterSpacing: 0.8,
    marginTop: 4,
    fontFamily: fonts.bodySemi,
    textTransform: 'uppercase',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.line,
  },
});
