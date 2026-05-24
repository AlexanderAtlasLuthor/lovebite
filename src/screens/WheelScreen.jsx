import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowLeft, Dices, MapPin, RotateCw, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Wheel from '../components/Wheel';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { useReviews } from '../state/ReviewsContext';
import { getScore, scoreColor, scoreLabel } from '../lib/scoring';
import { colors, fonts } from '../theme';

export default function WheelScreen({ navigation }) {
  const { reviews } = useReviews();
  const insets = useSafeAreaInsets();
  const [winner, setWinner] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef(null);

  const eligible = useMemo(
    () => reviews.filter((r) => getScore(r) >= 7).sort((a, b) => getScore(b) - getScore(a)),
    [reviews]
  );

  const spin = () => {
    setWinner(null);
    setSpinning(true);
    wheelRef.current?.spin();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 20,
        alignItems: 'center',
      }}
    >
      <Pressable onPress={() => navigation.goBack()} style={styles.back}>
        <ArrowLeft size={16} color={colors.ash} />
        <Text style={styles.backText}>Volver</Text>
      </Pressable>

      <View style={styles.intro}>
        <Text style={styles.title}>¿Dónde comemos hoy?</Text>
        <Text style={styles.sub}>
          Solo los lugares que ya nos enamoraron — puntaje 7.0 o más.
        </Text>
        <View style={styles.countBadge}>
          <Dices size={14} color={colors.burgundy} />
          <Text style={styles.countText}>
            {eligible.length} restaurantes en juego
          </Text>
        </View>
      </View>

      {eligible.length === 0 ? (
        <View style={styles.empty}>
          <Heart size={40} color={colors.ash} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>Aún no hay candidatos</Text>
          <Text style={styles.emptySub}>
            Necesitan al menos una reseña con puntaje 7 o más.
          </Text>
        </View>
      ) : (
        <>
          <Wheel
            ref={wheelRef}
            items={eligible}
            winner={winner}
            onSpinEnd={(w) => {
              setWinner(w);
              setSpinning(false);
            }}
          />

          <View style={{ marginTop: 24 }}>
            <PrimaryButton icon={RotateCw} onPress={spin} disabled={spinning}>
              {spinning ? 'Girando…' : winner ? 'Girar de nuevo' : 'Girar la ruleta'}
            </PrimaryButton>
          </View>

          {winner && !spinning && (
            <View style={styles.result}>
              <Text style={styles.resultLabel}>Esta vez vamos a…</Text>
              <Text style={styles.resultName}>{winner.name}</Text>
              <Text style={[styles.resultScore, { color: scoreColor(getScore(winner)) }]}>
                {getScore(winner).toFixed(1)}
                <Text style={styles.resultScoreSub}>
                  {`  ·  ${scoreLabel(getScore(winner))}`}
                </Text>
              </Text>
              {!!winner.location && (
                <View style={styles.resultMeta}>
                  <MapPin size={12} color={colors.ash} />
                  <Text style={styles.resultMetaText}>{winner.location}</Text>
                </View>
              )}
              <View style={{ marginTop: 16 }}>
                <SecondaryButton
                  onPress={() => navigation.replace('Detail', { id: winner.id })}
                >
                  Ver reseña completa
                </SecondaryButton>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backText: { fontFamily: fonts.bodyMedium, color: colors.ash, fontSize: 14 },
  intro: { alignItems: 'center', marginBottom: 24 },
  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.burgundy,
    textAlign: 'center',
    lineHeight: 34,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.ash,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  countBadge: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.roseSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countText: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.burgundy,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
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
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  result: {
    marginTop: 28,
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  resultLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.ash,
    fontFamily: fonts.bodySemi,
    textTransform: 'uppercase',
  },
  resultName: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.burgundy,
    marginTop: 6,
    marginBottom: 4,
    textAlign: 'center',
  },
  resultScore: {
    fontFamily: fonts.display,
    fontSize: 22,
  },
  resultScoreSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ash,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  resultMetaText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ash,
  },
});
