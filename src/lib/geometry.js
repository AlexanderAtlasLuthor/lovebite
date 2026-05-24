export const polarToCartesian = (radius, angleDeg) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(a), y: radius * Math.sin(a) };
};

export const formatDate = (dateStr, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => {
  try {
    return new Date(dateStr).toLocaleDateString('es', opts);
  } catch {
    return dateStr;
  }
};
