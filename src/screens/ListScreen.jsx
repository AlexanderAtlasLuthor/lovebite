import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Plus, Search, Heart, Dices } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '../components/BrandHeader';
import StatsRow from '../components/StatsRow';
import ReviewCard from '../components/ReviewCard';
import { PrimaryButton, GhostButton } from '../components/Buttons';
import { useReviews } from '../state/ReviewsContext';
import { getScore } from '../lib/scoring';
import { colors, fonts } from '../theme';

export default function ListScreen({ navigation }) {
  const { reviews } = useReviews();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews
      .filter((r) =>
        `${r.name} ${r.location} ${r.notes}`.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        if (sortBy === 'rating') return getScore(b) - getScore(a);
        return new Date(b.date) - new Date(a.date);
      });
  }, [reviews, query, sortBy]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
        paddingHorizontal: 20,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <BrandHeader
        right={
          <View style={styles.headerActions}>
            <GhostButton icon={Dices} onPress={() => navigation.navigate('Wheel')}>
              Ruleta
            </GhostButton>
            <PrimaryButton icon={Plus} onPress={() => navigation.navigate('New')}>
              Nueva
            </PrimaryButton>
          </View>
        }
      />

      {reviews.length > 0 && <StatsRow reviews={reviews} />}

      <View style={styles.toolbar}>
        <View style={styles.search}>
          <Search size={16} color={colors.ash} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar un lugar, ciudad, recuerdo..."
            placeholderTextColor={colors.ash}
            style={styles.searchInput}
          />
        </View>
        <View style={styles.sortToggle}>
          {[
            { key: 'recent', label: 'Recientes' },
            { key: 'rating', label: 'Mejor' },
          ].map((opt) => {
            const active = sortBy === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSortBy(opt.key)}
                style={[styles.sortBtn, active && styles.sortBtnActive]}
              >
                <Text style={[styles.sortText, active && styles.sortTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={40} color={colors.ash} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>Aún no hay mordidas</Text>
          <Text style={styles.emptySub}>Agreguen su primera reseña juntos</Text>
        </View>
      ) : (
        filtered.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            onPress={(rev) => navigation.navigate('Detail', { id: rev.id })}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  toolbar: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  search: {
    flex: 1,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 4,
  },
  sortToggle: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    padding: 4,
  },
  sortBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  sortBtnActive: { backgroundColor: colors.cherry },
  sortText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ash,
  },
  sortTextActive: { color: colors.white, fontFamily: fonts.bodySemi },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.burgundy,
    marginTop: 16,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ash,
  },
});
