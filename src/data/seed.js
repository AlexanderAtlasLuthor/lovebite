// Distribuye un score promedio en las 5 categorías con pequeña variación.
const distributeScore = (avg, variations = [0, 0, 0, 0, 0]) => {
  const base = Math.round(avg);
  const ratings = variations.map((v) => Math.max(1, Math.min(10, base + v)));
  const currentAvg = ratings.reduce((a, b) => a + b, 0) / 5;
  const diff = avg - currentAvg;
  if (Math.abs(diff) > 0.05) {
    ratings[2] = Math.max(1, Math.min(10, ratings[2] + diff * 5));
  }
  return {
    cost: Math.round(ratings[0] * 10) / 10,
    ambience: Math.round(ratings[1] * 10) / 10,
    service: Math.round(ratings[2] * 10) / 10,
    food: Math.round(ratings[3] * 10) / 10,
    speed: Math.round(ratings[4] * 10) / 10,
  };
};

export const SEED = [
  // 10s
  { id: 1, name: 'Saitos Wellington', location: 'Wellington', date: '2025-01-15', notes: 'Miguel vomitó :)', ratings: distributeScore(10) },
  { id: 2, name: 'Texas Roadhouse', location: '', date: '2025-02-10', notes: 'Jamar Pierre was so nice — he is from Barbados and Haiti. Free shrimp and good grilled shrimp.', ratings: distributeScore(10) },
  { id: 3, name: 'Ole Ole', location: '', date: '2025-02-22', notes: 'BEST MEAT, RIBS AND CALAMARI', ratings: distributeScore(10) },
  { id: 4, name: 'La Iberia', location: 'Portugués', date: '2025-03-05', notes: 'Comida portuguesa increíble.', ratings: distributeScore(10) },
  { id: 5, name: 'Baskin Robbins', location: '', date: '2025-03-12', notes: 'Helado perfecto.', ratings: distributeScore(10) },

  // 9s
  { id: 6, name: 'La Cabrera', location: '', date: '2025-04-01', notes: '', ratings: distributeScore(9.5, [0, 0, 0, 1, 0]) },
  { id: 7, name: 'Tapelia', location: '', date: '2025-04-15', notes: 'Hosts are nice. Free bday cake. Server not good.', ratings: distributeScore(9, [0, 1, -1, 1, 0]) },
  { id: 8, name: 'Pig Beach BBQ', location: '', date: '2025-05-02', notes: 'Caro, pero buena comida.', ratings: distributeScore(9, [-2, 1, 1, 1, 1]) },
  { id: 9, name: 'Tacos al Carbón', location: '', date: '2025-05-18', notes: '', ratings: distributeScore(9, [1, 0, 0, 0, 0]) },

  // 8s
  { id: 10, name: 'Sushi Yama', location: '', date: '2025-06-01', notes: 'Por hacer llorar a Mari 8.9', ratings: distributeScore(8.9, [0, 0, 0, 1, 0]) },
  { id: 11, name: 'Burgerfi', location: '', date: '2025-06-10', notes: 'Rating: 8.9 – 7.7', ratings: distributeScore(8.3) },
  { id: 12, name: 'Magnolia', location: '', date: '2025-06-20', notes: '', ratings: distributeScore(8.7) },
  { id: 13, name: 'Clematis Pizza', location: '', date: '2025-07-01', notes: '', ratings: distributeScore(8.7, [0, 0, 0, 1, 0]) },
  { id: 14, name: 'Chilis', location: '', date: '2025-07-12', notes: '', ratings: distributeScore(8.7, [1, 0, 0, 0, 0]) },
  { id: 15, name: 'Hausmash', location: '', date: '2025-07-20', notes: 'Buen precio. Buena carne. Buenas papas. Mucho queso — esto es lo malo.', ratings: distributeScore(8.5, [1, 0, 0, 1, 0]) },
  { id: 16, name: "Larry's Giant Subs", location: '', date: '2025-08-01', notes: '', ratings: distributeScore(8.2, [1, 0, 0, 0, 0]) },
  { id: 17, name: 'Huddle House', location: '', date: '2025-08-10', notes: '', ratings: distributeScore(8) },
  { id: 18, name: 'Wingstop', location: '', date: '2025-08-15', notes: '', ratings: distributeScore(8, [1, -1, 0, 0, 0]) },

  // 7s
  { id: 19, name: 'Lemongrass', location: 'Wellington', date: '2025-09-01', notes: '', ratings: distributeScore(7.2) },
  { id: 20, name: 'Blaze Pizza', location: '', date: '2025-09-10', notes: '', ratings: distributeScore(7.5, [1, 0, 0, 0, 0]) },
  { id: 21, name: 'Kabuki', location: '', date: '2025-09-18', notes: 'Rating: 7 – 6.6. Volver para el bar.', ratings: distributeScore(6.8, [0, 1, 0, 0, 0]) },
  { id: 22, name: 'Veracruz', location: '', date: '2025-10-01', notes: '', ratings: distributeScore(7) },

  // 6s
  { id: 23, name: 'Friday', location: '', date: '2025-10-15', notes: '', ratings: distributeScore(6.6) },
  { id: 24, name: "Wendy's", location: '', date: '2025-11-01', notes: '', ratings: distributeScore(6.1, [1, -1, 0, 0, 1]) },

  // Bajos
  { id: 25, name: 'China Uno', location: '', date: '2025-11-10', notes: '', ratings: distributeScore(4) },
  { id: 26, name: 'Eataly', location: '', date: '2025-11-20', notes: 'Expensive. Food is really bad. A lot of people.', ratings: distributeScore(3.5, [-1, 1, 0, -1, 0]) },
  { id: 27, name: 'Gordos', location: 'Greenacres', date: '2025-12-01', notes: 'Servicio mal. Caro. Comida mala y recalentada. Miguel vomitó.', ratings: distributeScore(3, [-1, 0, -1, -1, 0]) },
].map((r) => ({ method: 'casual', ...r }));
