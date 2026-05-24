import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MapPin, Calendar, Sparkles } from 'lucide-react-native';
import { colors, fonts } from '../theme';
import { getScore, getCategories, scoreColor, scoreLabel } from '../lib/scoring';
import { formatDate } from '../lib/geometry';

export default function ReviewCard({ review, onPress }) {
  const score = getScore(review);
  const cats = getCategories(review.method);
  const isPro = review.method === 'professional';
  const tint = scoreColor(score);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(review)}
    >
      <View style={styles.scoreSide}>
        <Text style={[styles.scoreNum, { color: tint }]}>{score.toFixed(1)}</Text>
        <Text style={styles.scoreLabel}>{scoreLabel(score)}</Text>
        {isPro && (
          <View style={styles.proBadge}>
            <Sparkles size={9} color={colors.burgundy} />
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {review.name}
        </Text>
        <View style={styles.meta}>
          {!!review.location && (
            <View style={styles.metaItem}>
              <MapPin size={11} color={colors.ash} />
              <Text style={styles.metaText}>{review.location}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Calendar size={11} color={colors.ash} />
            <Text style={styles.metaText}>{formatDate(review.date)}</Text>
          </View>
        </View>
        {!!review.notes && (
          <Text style={styles.notes} numberOfLines={2}>
            {review.notes}
          </Text>
        )}
        <View style={styles.miniCats}>
          {cats.map((c) => (
            <View key={c.key} style={styles.miniCat}>
              <Text style={styles.miniCatEmoji}>{c.emoji}</Text>
              <Text style={styles.miniCatVal}>{review.ratings[c.key]}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardPressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
  scoreSide: {
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.creamDeep,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  scoreNum: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 40,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.ash,
    marginTop: 4,
    letterSpacing: 0.8,
    fontFamily: fonts.bodySemi,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  proBadge: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.roseSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  proBadgeText: {
    fontSize: 9,
    fontFamily: fonts.bodySemi,
    color: colors.burgundy,
    letterSpacing: 0.8,
  },
  body: {
    flex: 1,
    padding: 14,
  },
  name: {
    fontFamily: fonts.displayBold,
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.ash,
    fontFamily: fonts.body,
  },
  notes: {
    fontSize: 13,
    color: colors.ink,
    opacity: 0.75,
    lineHeight: 18,
    marginTop: 4,
    fontFamily: fonts.body,
  },
  miniCats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  miniCat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  miniCatEmoji: { fontSize: 11 },
  miniCatVal: {
    fontSize: 12,
    color: colors.ink,
    fontFamily: fonts.bodySemi,
  },
});
