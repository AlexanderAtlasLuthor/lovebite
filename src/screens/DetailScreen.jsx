import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { MapPin, Calendar, Trash2, ArrowLeft, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useReviews } from '../state/ReviewsContext';
import CategoryBar from '../components/CategoryBar';
import ProStars from '../components/ProStars';
import { DeleteButton } from '../components/Buttons';
import {
  getCategories,
  getScore,
  proStarRating,
  scoreColor,
  scoreLabel,
} from '../lib/scoring';
import { formatDate } from '../lib/geometry';
import { colors, fonts } from '../theme';

export default function DetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { reviews, removeReview } = useReviews();
  const insets = useSafeAreaInsets();
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Esta reseña ya no existe.</Text>
      </View>
    );
  }

  const score = getScore(review);
  const cats = getCategories(review.method);
  const isPro = review.method === 'professional';
  const stars = isPro ? proStarRating(score) : null;
  const tint = scoreColor(score);

  const confirmDelete = () => {
    Alert.alert(
      '¿Eliminar reseña?',
      `Se borrará "${review.name}" para siempre.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            removeReview(review.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
      }}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <ArrowLeft size={16} color={colors.ash} />
        <Text style={styles.backText}>Volver</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={[styles.scoreCircle, { borderColor: tint }]}>
          <Text style={[styles.scoreNum, { color: tint }]}>{score.toFixed(1)}</Text>
          <Text style={styles.scoreOut}>/ 10</Text>
          <View style={styles.scoreTag}>
            <Text style={styles.scoreTagText}>
              {isPro ? stars.label : scoreLabel(score)}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          {isPro && (
            <View style={styles.proBanner}>
              <Sparkles size={12} color={colors.burgundy} />
              <Text style={styles.proBannerText}>Reseña profesional</Text>
              <ProStars count={stars.stars} size={14} />
            </View>
          )}
          <Text style={styles.name}>{review.name}</Text>
          <View style={styles.meta}>
            {!!review.location && (
              <View style={styles.metaItem}>
                <MapPin size={14} color={colors.ash} />
                <Text style={styles.metaText}>{review.location}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Calendar size={14} color={colors.ash} />
              <Text style={styles.metaText}>
                {formatDate(review.date, { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
          {!!review.notes && (
            <View style={styles.quoteWrap}>
              <Text style={styles.quote}>{review.notes}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.catsCard}>
        <Text style={styles.sectionTitle}>
          {isPro ? 'Desglose ponderado' : 'Desglose por categoría'}
        </Text>
        {cats.map((c) => (
          <CategoryBar
            key={c.key}
            category={c}
            value={review.ratings[c.key]}
            isPro={isPro}
          />
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <DeleteButton onPress={confirmDelete} icon={Trash2}>
          Eliminar reseña
        </DeleteButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  missingText: { fontFamily: fonts.body, color: colors.ash },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backText: { fontFamily: fonts.bodyMedium, color: colors.ash, fontSize: 14 },
  hero: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'flex-start',
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.burgundy,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  scoreNum: {
    fontFamily: fonts.display,
    fontSize: 50,
    lineHeight: 52,
  },
  scoreOut: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.ash,
    marginTop: -2,
  },
  scoreTag: {
    position: 'absolute',
    bottom: -10,
    backgroundColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  scoreTagText: {
    color: colors.white,
    fontSize: 10,
    letterSpacing: 0.8,
    fontFamily: fonts.bodySemi,
    textTransform: 'uppercase',
  },
  proBanner: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.roseSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
  },
  proBannerText: {
    fontSize: 11,
    color: colors.burgundy,
    fontFamily: fonts.bodySemi,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.burgundy,
    lineHeight: 34,
    marginBottom: 8,
  },
  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontFamily: fonts.body, color: colors.ash, fontSize: 13 },
  quoteWrap: {
    marginTop: 16,
    paddingLeft: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.cherry,
  },
  quote: {
    fontFamily: fonts.displayRegular,
    fontSize: 16,
    color: colors.ink,
    lineHeight: 24,
  },
  catsCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.burgundy,
    marginBottom: 16,
  },
});
