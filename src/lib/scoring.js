import { CATEGORIES, PRO_CATEGORIES } from '../data/categories';
import { colors } from '../theme';

export const avg = (r) => {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

export const proWeightedAvg = (ratings) =>
  PRO_CATEGORIES.reduce((sum, c) => sum + (ratings[c.key] ?? 0) * c.weight, 0);

export const getScore = (review) =>
  review?.method === 'professional' ? proWeightedAvg(review.ratings) : avg(review.ratings);

export const getCategories = (method) =>
  method === 'professional' ? PRO_CATEGORIES : CATEGORIES;

export const scoreColor = (s) => {
  if (s >= 9) return colors.gold;
  if (s >= 7.5) return colors.cherry;
  if (s >= 6) return colors.roseDeep;
  return colors.ash;
};

export const scoreLabel = (s) => {
  if (s >= 9.5) return 'Inolvidable';
  if (s >= 8.5) return 'Excepcional';
  if (s >= 7.5) return 'Excelente';
  if (s >= 6.5) return 'Muy bueno';
  if (s >= 5) return 'Decente';
  return 'Pasable';
};

// 0–4 estrellas estilo Pete Wells / NYT
export const proStarRating = (s) => {
  if (s >= 9.5) return { stars: 4, label: 'Extraordinario' };
  if (s >= 8) return { stars: 3, label: 'Excelente' };
  if (s >= 6.5) return { stars: 2, label: 'Muy bueno' };
  if (s >= 5) return { stars: 1, label: 'Satisfactorio' };
  return { stars: 0, label: 'Pobre' };
};

export const defaultRatings = (method) =>
  getCategories(method).reduce((acc, c) => ({ ...acc, [c.key]: 5 }), {});
