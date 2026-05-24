export const CATEGORIES = [
  { key: 'cost', label: 'Costo', emoji: '💰', desc: 'Relación calidad-precio' },
  { key: 'ambience', label: 'Ambiente', emoji: '✨', desc: 'Qué tan bonito es' },
  { key: 'service', label: 'Servicio', emoji: '🤍', desc: 'Atención del personal' },
  { key: 'food', label: 'Comida', emoji: '🍝', desc: 'Sabor y calidad' },
  { key: 'speed', label: 'Rapidez', emoji: '⚡', desc: 'Tiempo de espera' },
];

// Rúbrica profesional ponderada (inspirada en Michelin / NYT / Zagat)
export const PRO_CATEGORIES = [
  { key: 'food', label: 'Cocina', emoji: '🍽️', desc: 'Ingredientes, técnica, armonía y creatividad', weight: 0.40 },
  { key: 'service', label: 'Servicio', emoji: '🛎️', desc: 'Atención, conocimiento, ritmo de la mesa', weight: 0.20 },
  { key: 'ambience', label: 'Ambiente', emoji: '🕯️', desc: 'Atmósfera, decoración, confort acústico', weight: 0.15 },
  { key: 'value', label: 'Valor', emoji: '💎', desc: 'Relación calidad-precio percibida', weight: 0.15 },
  { key: 'consistency', label: 'Consistencia', emoji: '🎯', desc: 'Ejecución pareja a lo largo de la visita', weight: 0.10 },
];

export const SEGMENT_COLORS = ['#C81E3A', '#E27D8C', '#8E0E26', '#B8862E', '#5C0A1F'];
