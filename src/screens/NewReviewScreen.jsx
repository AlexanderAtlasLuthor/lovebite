import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { X, Heart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MethodToggle from '../components/MethodToggle';
import ProStars from '../components/ProStars';
import RatingSlider from '../components/RatingSlider';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { useReviews } from '../state/ReviewsContext';
import {
  avg,
  defaultRatings,
  getCategories,
  proStarRating,
  proWeightedAvg,
  scoreColor,
  scoreLabel,
} from '../lib/scoring';
import { colors, fonts } from '../theme';

const today = () => new Date().toISOString().split('T')[0];

export default function NewReviewScreen({ navigation }) {
  const { addReview } = useReviews();
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState('casual');
  const [form, setForm] = useState({
    name: '',
    location: '',
    date: today(),
    notes: '',
    ratings: defaultRatings('casual'),
  });

  const cats = getCategories(method);
  const current =
    method === 'professional' ? proWeightedAvg(form.ratings) : avg(form.ratings);
  const stars = proStarRating(current);
  const tint = scoreColor(current);

  const switchMethod = (next) => {
    if (next === method) return;
    setMethod(next);
    setForm((f) => ({ ...f, ratings: defaultRatings(next) }));
  };

  const setRating = (key, value) =>
    setForm((f) => ({ ...f, ratings: { ...f.ratings, [key]: Math.round(value) } }));

  const save = () => {
    if (!form.name.trim()) return;
    addReview({ ...form, method });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.cream }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Nueva reseña</Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <X size={20} color={colors.ash} />
          </Pressable>
        </View>

        <MethodToggle value={method} onChange={switchMethod} />
        <Text style={styles.hint}>
          {method === 'casual'
            ? '5 categorías sencillas con el mismo peso — para reseñar como pareja.'
            : 'Rúbrica ponderada al estilo Michelin / NYT. La cocina pesa más, luego servicio, ambiente, valor y consistencia.'}
        </Text>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>
            {method === 'professional' ? 'Puntaje ponderado' : 'Puntuación actual'}
          </Text>
          <Text style={[styles.previewScore, { color: tint }]}>{current.toFixed(1)}</Text>
          <Text style={styles.previewTag}>
            {method === 'professional' ? stars.label : scoreLabel(current)}
          </Text>
          {method === 'professional' && (
            <View style={{ marginTop: 8 }}>
              <ProStars count={stars.stars} size={18} />
            </View>
          )}
        </View>

        <Field label="Nombre del lugar">
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
            placeholder="Ej: Trattoria Lumière"
            placeholderTextColor={colors.ash}
            style={styles.input}
          />
        </Field>
        <Field label="Ubicación">
          <TextInput
            value={form.location}
            onChangeText={(v) => setForm((f) => ({ ...f, location: v }))}
            placeholder="Ciudad, país"
            placeholderTextColor={colors.ash}
            style={styles.input}
          />
        </Field>
        <Field label="Fecha (YYYY-MM-DD)">
          <TextInput
            value={form.date}
            onChangeText={(v) => setForm((f) => ({ ...f, date: v }))}
            placeholder="2025-01-15"
            placeholderTextColor={colors.ash}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>
        <Field label="Notas y recuerdos">
          <TextInput
            value={form.notes}
            onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
            placeholder={
              method === 'professional'
                ? 'Platos pedidos, técnica, errores, momentos memorables…'
                : '¿Qué hizo este lugar especial? ¿Qué pidieron?'
            }
            placeholderTextColor={colors.ash}
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textarea]}
          />
        </Field>

        <Text style={styles.sectionTitle}>
          {method === 'professional' ? 'Califiquen del 1 al 10 (ponderado)' : 'Califiquen del 1 al 10'}
        </Text>

        {cats.map((c) => (
          <RatingSlider
            key={c.key}
            category={c}
            value={form.ratings[c.key]}
            onChange={(v) => setRating(c.key, v)}
            isPro={method === 'professional'}
          />
        ))}

        <View style={styles.actions}>
          <SecondaryButton onPress={() => navigation.goBack()}>Cancelar</SecondaryButton>
          <PrimaryButton onPress={save} disabled={!form.name.trim()} icon={Heart}>
            Guardar reseña
          </PrimaryButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.burgundy,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontFamily: fonts.body,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.ash,
    marginTop: 10,
    marginBottom: 16,
    lineHeight: 18,
  },
  preview: {
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.creamDeep,
    borderRadius: 16,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.ash,
    fontFamily: fonts.bodySemi,
    textTransform: 'uppercase',
  },
  previewScore: {
    fontFamily: fonts.display,
    fontSize: 48,
    lineHeight: 54,
    marginTop: 4,
  },
  previewTag: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
  field: { marginBottom: 12 },
  fieldLabel: {
    fontFamily: fonts.bodySemi,
    fontSize: 12,
    color: colors.burgundy,
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.white,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontFamily: fonts.displayBold,
    fontSize: 16,
    color: colors.burgundy,
    marginTop: 24,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
