import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Plus, Search, X, Trash2, Star, MapPin, Calendar, ChevronDown, Award, Dices, RotateCw, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { key: 'cost', label: 'Costo', emoji: '💰', desc: 'Relación calidad-precio' },
  { key: 'ambience', label: 'Ambiente', emoji: '✨', desc: 'Qué tan bonito es' },
  { key: 'service', label: 'Servicio', emoji: '🤍', desc: 'Atención del personal' },
  { key: 'food', label: 'Comida', emoji: '🍝', desc: 'Sabor y calidad' },
  { key: 'speed', label: 'Rapidez', emoji: '⚡', desc: 'Tiempo de espera' },
];

// Método profesional inspirado en Michelin / NYT / Zagat.
// Cada categoría tiene un peso — el puntaje final es un promedio ponderado.
const PRO_CATEGORIES = [
  { key: 'food', label: 'Cocina', emoji: '🍽️', desc: 'Ingredientes, técnica, armonía y creatividad', weight: 0.40 },
  { key: 'service', label: 'Servicio', emoji: '🛎️', desc: 'Atención, conocimiento, ritmo de la mesa', weight: 0.20 },
  { key: 'ambience', label: 'Ambiente', emoji: '🕯️', desc: 'Atmósfera, decoración, confort acústico', weight: 0.15 },
  { key: 'value', label: 'Valor', emoji: '💎', desc: 'Relación calidad-precio percibida', weight: 0.15 },
  { key: 'consistency', label: 'Consistencia', emoji: '🎯', desc: 'Ejecución pareja a lo largo de la visita', weight: 0.10 },
];

const SEGMENT_COLORS = ['#C81E3A', '#E27D8C', '#8E0E26', '#B8862E', '#5C0A1F'];

// Distribuye un score promedio en las 5 categorías con una pequeña variación natural
const distributeScore = (avg, variations = [0, 0, 0, 0, 0]) => {
  const base = Math.round(avg);
  const ratings = variations.map(v => Math.max(1, Math.min(10, base + v)));
  // Ajusta para que el promedio coincida exactamente
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

const SEED = [
  // ===== 10s — los mejores =====
  { id: 1, name: 'Saitos Wellington', location: 'Wellington', date: '2025-01-15', notes: 'Miguel vomitó :)', ratings: distributeScore(10, [0, 0, 0, 0, 0]) },
  { id: 2, name: 'Texas Roadhouse', location: '', date: '2025-02-10', notes: 'Jamar Pierre was so nice — he is from Barbados and Haiti. Free shrimp and good grilled shrimp.', ratings: distributeScore(10, [0, 0, 0, 0, 0]) },
  { id: 3, name: 'Ole Ole', location: '', date: '2025-02-22', notes: 'BEST MEAT, RIBS AND CALAMARI', ratings: distributeScore(10, [0, 0, 0, 0, 0]) },
  { id: 4, name: 'La Iberia', location: 'Portugués', date: '2025-03-05', notes: 'Comida portuguesa increíble.', ratings: distributeScore(10, [0, 0, 0, 0, 0]) },
  { id: 5, name: 'Baskin Robbins', location: '', date: '2025-03-12', notes: 'Helado perfecto.', ratings: distributeScore(10, [0, 0, 0, 0, 0]) },

  // ===== 9s =====
  { id: 6, name: 'La Cabrera', location: '', date: '2025-04-01', notes: '', ratings: distributeScore(9.5, [0, 0, 0, 1, 0]) },
  { id: 7, name: 'Tapelia', location: '', date: '2025-04-15', notes: 'Hosts are nice. Free bday cake. Server not good.', ratings: distributeScore(9, [0, 1, -1, 1, 0]) },
  { id: 8, name: 'Pig Beach BBQ', location: '', date: '2025-05-02', notes: 'Caro, pero buena comida.', ratings: distributeScore(9, [-2, 1, 1, 1, 1]) },
  { id: 9, name: 'Tacos al Carbón', location: '', date: '2025-05-18', notes: '', ratings: distributeScore(9, [1, 0, 0, 0, 0]) },

  // ===== 8s =====
  { id: 10, name: 'Sushi Yama', location: '', date: '2025-06-01', notes: 'Por hacer llorar a Mari 8.9', ratings: distributeScore(8.9, [0, 0, 0, 1, 0]) },
  { id: 11, name: 'Burgerfi', location: '', date: '2025-06-10', notes: 'Rating: 8.9 – 7.7', ratings: distributeScore(8.3, [0, 0, 0, 0, 0]) },
  { id: 12, name: 'Magnolia', location: '', date: '2025-06-20', notes: '', ratings: distributeScore(8.7, [0, 0, 0, 0, 0]) },
  { id: 13, name: 'Clematis Pizza', location: '', date: '2025-07-01', notes: '', ratings: distributeScore(8.7, [0, 0, 0, 1, 0]) },
  { id: 14, name: 'Chilis', location: '', date: '2025-07-12', notes: '', ratings: distributeScore(8.7, [1, 0, 0, 0, 0]) },
  { id: 15, name: 'Hausmash', location: '', date: '2025-07-20', notes: 'Buen precio. Buena carne. Buenas papas. Mucho queso — esto es lo malo.', ratings: distributeScore(8.5, [1, 0, 0, 1, 0]) },
  { id: 16, name: "Larry's Giant Subs", location: '', date: '2025-08-01', notes: '', ratings: distributeScore(8.2, [1, 0, 0, 0, 0]) },
  { id: 17, name: 'Huddle House', location: '', date: '2025-08-10', notes: '', ratings: distributeScore(8, [0, 0, 0, 0, 0]) },
  { id: 18, name: 'Wingstop', location: '', date: '2025-08-15', notes: '', ratings: distributeScore(8, [1, -1, 0, 0, 0]) },

  // ===== 7s =====
  { id: 19, name: 'Lemongrass', location: 'Wellington', date: '2025-09-01', notes: '', ratings: distributeScore(7.2, [0, 0, 0, 0, 0]) },
  { id: 20, name: 'Blaze Pizza', location: '', date: '2025-09-10', notes: '', ratings: distributeScore(7.5, [1, 0, 0, 0, 0]) },
  { id: 21, name: 'Kabuki', location: '', date: '2025-09-18', notes: 'Rating: 7 – 6.6. Volver para el bar.', ratings: distributeScore(6.8, [0, 1, 0, 0, 0]) },
  { id: 22, name: 'Veracruz', location: '', date: '2025-10-01', notes: '', ratings: distributeScore(7, [0, 0, 0, 0, 0]) },

  // ===== 6s =====
  { id: 23, name: 'Friday', location: '', date: '2025-10-15', notes: '', ratings: distributeScore(6.6, [0, 0, 0, 0, 0]) },
  { id: 24, name: "Wendy's", location: '', date: '2025-11-01', notes: '', ratings: distributeScore(6.1, [1, -1, 0, 0, 1]) },

  // ===== Bajos =====
  { id: 25, name: 'China Uno', location: '', date: '2025-11-10', notes: '', ratings: distributeScore(4, [0, 0, 0, 0, 0]) },
  { id: 26, name: 'Eataly', location: '', date: '2025-11-20', notes: 'Expensive. Food is really bad. A lot of people.', ratings: distributeScore(3.5, [-1, 1, 0, -1, 0]) },
  { id: 27, name: 'Gordos', location: 'Greenacres', date: '2025-12-01', notes: 'Servicio mal. Caro. Comida mala y recalentada. Miguel vomitó.', ratings: distributeScore(3, [-1, 0, -1, -1, 0]) },
];

const avg = (r) => {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};

const proWeightedAvg = (ratings) =>
  PRO_CATEGORIES.reduce((sum, c) => sum + (ratings[c.key] ?? 0) * c.weight, 0);

const getScore = (review) =>
  review?.method === 'professional' ? proWeightedAvg(review.ratings) : avg(review.ratings);

const getCategories = (method) => (method === 'professional' ? PRO_CATEGORIES : CATEGORIES);

const scoreColor = (s) => {
  if (s >= 9) return 'var(--gold)';
  if (s >= 7.5) return 'var(--cherry)';
  if (s >= 6) return 'var(--rose-deep)';
  return 'var(--ash)';
};

const scoreLabel = (s) => {
  if (s >= 9.5) return 'Inolvidable';
  if (s >= 8.5) return 'Excepcional';
  if (s >= 7.5) return 'Excelente';
  if (s >= 6.5) return 'Muy bueno';
  if (s >= 5) return 'Decente';
  return 'Pasable';
};

// Escala estilo NYT/Pete Wells para el modo profesional: 0–4 estrellas.
const proStarRating = (s) => {
  if (s >= 9.5) return { stars: 4, label: 'Extraordinario' };
  if (s >= 8) return { stars: 3, label: 'Excelente' };
  if (s >= 6.5) return { stars: 2, label: 'Muy bueno' };
  if (s >= 5) return { stars: 1, label: 'Satisfactorio' };
  return { stars: 0, label: 'Pobre' };
};

export default function LoveBite() {
  const [reviews, setReviews] = useState(SEED);
  const [view, setView] = useState('list'); // list | detail | new | wheel
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filtered = reviews
    .filter((r) =>
      `${r.name} ${r.location} ${r.notes}`.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return getScore(b) - getScore(a);
      return new Date(b.date) - new Date(a.date);
    });

  const stats = {
    total: reviews.length,
    avgScore: reviews.length ? reviews.reduce((s, r) => s + getScore(r), 0) / reviews.length : 0,
    best: reviews.length ? reviews.reduce((b, r) => (getScore(r) > getScore(b) ? r : b)) : null,
  };

  return (
    <div className="lovebite-app">
      <style>{styles}</style>

      <div className="grain" />

      <header className="hero">
        <div className="hero-inner">
          <div className="brand">
            <div className="brand-mark">
              <svg viewBox="0 0 40 40" width="36" height="36">
                <path
                  d="M20 34 C 8 25, 4 16, 10 10 C 14 6, 18 8, 20 12 C 22 8, 26 6, 30 10 C 36 16, 32 25, 20 34 Z"
                  fill="var(--cherry)"
                />
                <path
                  d="M16 18 Q 18 16, 20 18 Q 22 16, 24 18 L 24 21 Q 20 24, 16 21 Z"
                  fill="var(--cream)"
                  opacity="0.9"
                />
              </svg>
            </div>
            <div>
              <h1 className="brand-name">Love Bite</h1>
              <p className="brand-tag">Nuestro diario gastronómico</p>
            </div>
          </div>

          {view === 'list' && (
            <div className="hero-actions">
              <button className="btn-ghost" onClick={() => setView('wheel')} title="Girar la ruleta">
                <Dices size={18} strokeWidth={2.2} />
                Ruleta
              </button>
              <button className="btn-primary" onClick={() => setView('new')}>
                <Plus size={18} strokeWidth={2.5} />
                Nueva reseña
              </button>
            </div>
          )}
        </div>

        {view === 'list' && reviews.length > 0 && (
          <div className="stats-row">
            <div className="stat">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Restaurantes</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num">{stats.avgScore.toFixed(1)}</div>
              <div className="stat-label">Promedio general</div>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <div className="stat-num" style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
                {stats.best?.name}
              </div>
              <div className="stat-label">
                <Award size={11} style={{ display: 'inline', marginRight: 4 }} />
                Favorito ({getScore(stats.best).toFixed(1)})
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="main">
        {view === 'list' && (
          <ListView
            reviews={filtered}
            query={query}
            setQuery={setQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelect={(r) => {
              setSelected(r);
              setView('detail');
            }}
          />
        )}

        {view === 'detail' && selected && (
          <DetailView
            review={selected}
            onBack={() => setView('list')}
            onDelete={() => {
              setReviews(reviews.filter((r) => r.id !== selected.id));
              setView('list');
            }}
          />
        )}

        {view === 'new' && (
          <NewReviewForm
            onCancel={() => setView('list')}
            onSave={(r) => {
              setReviews([{ ...r, id: Date.now() }, ...reviews]);
              setView('list');
            }}
          />
        )}

        {view === 'wheel' && (
          <WheelView
            reviews={reviews}
            onBack={() => setView('list')}
            onSelect={(r) => {
              setSelected(r);
              setView('detail');
            }}
          />
        )}
      </main>

      <footer className="footer">
        <span>♥</span> Hecho con cariño en cada bocado
      </footer>
    </div>
  );
}

function ListView({ reviews, query, setQuery, sortBy, setSortBy, onSelect }) {
  return (
    <>
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar un lugar, ciudad, recuerdo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="sort-toggle">
          <button
            className={sortBy === 'recent' ? 'active' : ''}
            onClick={() => setSortBy('recent')}
          >
            Recientes
          </button>
          <button
            className={sortBy === 'rating' ? 'active' : ''}
            onClick={() => setSortBy('rating')}
          >
            Mejor puntuados
          </button>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty">
          <Heart size={40} strokeWidth={1.2} />
          <h3>Aún no hay mordidas</h3>
          <p>Agrega su primera reseña juntos</p>
        </div>
      ) : (
        <div className="cards">
          {reviews.map((r, i) => {
            const score = getScore(r);
            const cats = getCategories(r.method);
            const isPro = r.method === 'professional';
            return (
              <article
                key={r.id}
                className="card"
                onClick={() => onSelect(r)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="card-score" style={{ color: scoreColor(score) }}>
                  <div className="card-score-num">{score.toFixed(1)}</div>
                  <div className="card-score-label">{scoreLabel(score)}</div>
                  {isPro && (
                    <div className="card-pro-badge" title="Reseña profesional">
                      <Sparkles size={10} /> Pro
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="card-name">{r.name}</h3>
                  <div className="card-meta">
                    <span><MapPin size={12} /> {r.location}</span>
                    <span><Calendar size={12} /> {new Date(r.date).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  {r.notes && <p className="card-notes">{r.notes}</p>}
                  <div className="card-mini-cats">
                    {cats.map((c) => (
                      <div key={c.key} className="mini-cat" title={c.label}>
                        <span>{c.emoji}</span>
                        <span className="mini-cat-val">{r.ratings[c.key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function DetailView({ review, onBack, onDelete }) {
  const score = getScore(review);
  const cats = getCategories(review.method);
  const isPro = review.method === 'professional';
  const stars = isPro ? proStarRating(score) : null;
  return (
    <div className="detail">
      <button className="back-btn" onClick={onBack}>← Volver</button>

      <div className="detail-hero">
        <div className="detail-score-circle" style={{ borderColor: scoreColor(score) }}>
          <div className="detail-score-num" style={{ color: scoreColor(score) }}>
            {score.toFixed(1)}
          </div>
          <div className="detail-score-out">/ 10</div>
          <div className="detail-score-tag">{isPro ? stars.label : scoreLabel(score)}</div>
        </div>

        <div className="detail-info">
          {isPro && (
            <div className="pro-banner">
              <Sparkles size={14} />
              <span>Reseña profesional · método ponderado</span>
              <div className="pro-stars">
                {[0, 1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < stars.stars ? 'var(--cherry)' : 'transparent'}
                    color={i < stars.stars ? 'var(--cherry)' : 'var(--line)'}
                  />
                ))}
              </div>
            </div>
          )}
          <h2 className="detail-name">{review.name}</h2>
          <div className="detail-meta">
            <span><MapPin size={14} /> {review.location}</span>
            <span><Calendar size={14} /> {new Date(review.date).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          {review.notes && (
            <blockquote className="detail-notes">
              <span className="quote-mark">"</span>
              {review.notes}
            </blockquote>
          )}
        </div>
      </div>

      <div className="detail-cats">
        <h3 className="section-title">
          {isPro ? 'Desglose ponderado' : 'Desglose por categoría'}
        </h3>
        {cats.map((c) => {
          const v = review.ratings[c.key];
          return (
            <div key={c.key} className="cat-row">
              <div className="cat-row-head">
                <span className="cat-row-emoji">{c.emoji}</span>
                <div className="cat-row-text">
                  <div className="cat-row-label">
                    {c.label}
                    {isPro && (
                      <span className="cat-weight">· {Math.round(c.weight * 100)}%</span>
                    )}
                  </div>
                  <div className="cat-row-desc">{c.desc}</div>
                </div>
                <div className="cat-row-val" style={{ color: scoreColor(v) }}>
                  {v}<span>/10</span>
                </div>
              </div>
              <div className="cat-bar">
                <div
                  className="cat-bar-fill"
                  style={{ width: `${v * 10}%`, background: scoreColor(v) }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="btn-delete" onClick={onDelete}>
        <Trash2 size={14} /> Eliminar reseña
      </button>
    </div>
  );
}

const defaultRatings = (method) =>
  getCategories(method).reduce((acc, c) => ({ ...acc, [c.key]: 5 }), {});

function NewReviewForm({ onCancel, onSave }) {
  const [method, setMethod] = useState('casual');
  const [form, setForm] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    ratings: defaultRatings('casual'),
  });

  const cats = getCategories(method);
  const current = method === 'professional' ? proWeightedAvg(form.ratings) : avg(form.ratings);
  const stars = proStarRating(current);

  const switchMethod = (next) => {
    if (next === method) return;
    setMethod(next);
    setForm((f) => ({ ...f, ratings: defaultRatings(next) }));
  };

  const save = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, method });
  };

  return (
    <div className="form">
      <div className="form-header">
        <h2>Nueva reseña</h2>
        <button className="icon-btn" onClick={onCancel}><X size={20} /></button>
      </div>

      <div className="method-toggle" role="tablist" aria-label="Método de reseña">
        <button
          role="tab"
          aria-selected={method === 'casual'}
          className={method === 'casual' ? 'active' : ''}
          onClick={() => switchMethod('casual')}
        >
          <Heart size={14} /> Nuestro método
        </button>
        <button
          role="tab"
          aria-selected={method === 'professional'}
          className={method === 'professional' ? 'active' : ''}
          onClick={() => switchMethod('professional')}
        >
          <Sparkles size={14} /> Crítico profesional
        </button>
      </div>

      <p className="method-hint">
        {method === 'casual'
          ? '5 categorías sencillas con el mismo peso — para reseñar como pareja.'
          : 'Rúbrica ponderada al estilo Michelin / NYT. La cocina pesa más, luego servicio, ambiente, valor y consistencia.'}
      </p>

      <div className="form-preview">
        <div className="form-preview-label">
          {method === 'professional' ? 'Puntaje ponderado' : 'Puntuación actual'}
        </div>
        <div className="form-preview-score" style={{ color: scoreColor(current) }}>
          {current.toFixed(1)}
        </div>
        <div className="form-preview-tag">
          {method === 'professional' ? stars.label : scoreLabel(current)}
        </div>
        {method === 'professional' && (
          <div className="pro-stars centered" aria-label={`${stars.stars} de 4 estrellas`}>
            {[0, 1, 2, 3].map((i) => (
              <Star
                key={i}
                size={18}
                fill={i < stars.stars ? 'var(--cherry)' : 'transparent'}
                color={i < stars.stars ? 'var(--cherry)' : 'var(--line)'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="form-grid">
        <div className="field">
          <label>Nombre del lugar</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ej: Trattoria Lumière"
          />
        </div>
        <div className="field">
          <label>Ubicación</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Ciudad, país"
          />
        </div>
        <div className="field">
          <label>Fecha</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label>Notas y recuerdos</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder={method === 'professional'
            ? 'Platos pedidos, técnica, errores, momentos memorables…'
            : '¿Qué hizo este lugar especial? ¿Qué pidieron?'}
          rows={3}
        />
      </div>

      <h3 className="section-title" style={{ marginTop: '2rem' }}>
        {method === 'professional' ? 'Califiquen del 1 al 10 (ponderado)' : 'Califiquen del 1 al 10'}
      </h3>

      {cats.map((c) => (
        <div key={c.key} className="slider-row">
          <div className="slider-head">
            <span className="slider-emoji">{c.emoji}</span>
            <div className="slider-text">
              <div className="slider-label">
                {c.label}
                {method === 'professional' && (
                  <span className="cat-weight">· {Math.round(c.weight * 100)}%</span>
                )}
              </div>
              <div className="slider-desc">{c.desc}</div>
            </div>
            <div className="slider-val" style={{ color: scoreColor(form.ratings[c.key]) }}>
              {form.ratings[c.key]}
            </div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={form.ratings[c.key]}
            onChange={(e) =>
              setForm({
                ...form,
                ratings: { ...form.ratings, [c.key]: Number(e.target.value) },
              })
            }
            style={{ accentColor: scoreColor(form.ratings[c.key]) }}
          />
        </div>
      ))}

      <div className="form-actions">
        <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" onClick={save} disabled={!form.name.trim()}>
          <Heart size={16} fill="currentColor" /> Guardar reseña
        </button>
      </div>
    </div>
  );
}

// =====================================================
// Spinning wheel — solo lugares con puntaje 7+
// =====================================================

const polarToCartesian = (radius, angleDeg) => {
  const a = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(a), y: radius * Math.sin(a) };
};

function WheelView({ reviews, onBack, onSelect }) {
  const eligible = useMemo(
    () =>
      reviews
        .filter((r) => getScore(r) >= 7)
        .sort((a, b) => getScore(b) - getScore(a)),
    [reviews]
  );

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  const spin = () => {
    if (spinning || eligible.length === 0) return;
    setWinner(null);
    setSpinning(true);

    const n = eligible.length;
    const segAngle = 360 / n;
    const winnerIdx = Math.floor(Math.random() * n);

    // El puntero está en el tope (cartesianamente, ángulo -90).
    // El centro del segmento i está originalmente en (i * segAngle + segAngle/2) - 90.
    // Queremos que tras la rotación quede en -90, así que la rotación debe ser
    // -(i*segAngle + segAngle/2), módulo 360, más vueltas completas para drama.
    const targetMod = ((-(winnerIdx * segAngle + segAngle / 2)) % 360 + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const delta = ((targetMod - currentMod) + 360) % 360;
    const newRotation = rotation + 360 * 6 + delta;
    setRotation(newRotation);

    setTimeout(() => {
      setWinner(eligible[winnerIdx]);
      setSpinning(false);
    }, 4600);
  };

  const segAngle = eligible.length ? 360 / eligible.length : 0;
  const fontSize = Math.max(7, Math.min(13, 170 / Math.max(eligible.length, 6)));
  const maxChars =
    eligible.length > 18 ? 9 : eligible.length > 12 ? 13 : eligible.length > 8 ? 17 : 22;

  return (
    <div className="wheel-page">
      <button className="back-btn" onClick={onBack}>← Volver</button>

      <div className="wheel-intro">
        <h2 className="wheel-title">¿Dónde comemos hoy?</h2>
        <p className="wheel-sub">
          Solo los lugares que ya nos enamoraron — puntaje 7.0 o más.
        </p>
        <div className="wheel-count">
          <Dices size={14} /> {eligible.length} restaurantes en juego
        </div>
      </div>

      {eligible.length === 0 ? (
        <div className="empty">
          <Heart size={40} strokeWidth={1.2} />
          <h3>Aún no hay candidatos</h3>
          <p>Necesitan al menos una reseña con puntaje 7 o más.</p>
        </div>
      ) : (
        <>
          <div className="wheel-stage">
            <div className="wheel-pointer" aria-hidden="true" />
            <svg viewBox="-200 -200 400 400" className="wheel-svg">
              <g
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: 'center',
                  transition: spinning
                    ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.21, 1)'
                    : 'none',
                }}
              >
                {eligible.map((r, i) => {
                  const start = i * segAngle - 90;
                  const end = start + segAngle;
                  const p1 = polarToCartesian(180, start);
                  const p2 = polarToCartesian(180, end);
                  const largeArc = segAngle > 180 ? 1 : 0;
                  const d = `M 0 0 L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A 180 180 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;

                  const mid = start + segAngle / 2;
                  const txt = polarToCartesian(112, mid);
                  const isFlipped = mid > 90 || mid < -90;
                  const textRotation = isFlipped ? mid + 180 : mid;
                  const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
                  const label =
                    r.name.length > maxChars
                      ? r.name.slice(0, maxChars - 1) + '…'
                      : r.name;
                  const isWinner = winner && winner.id === r.id && !spinning;

                  return (
                    <g key={r.id}>
                      <path
                        d={d}
                        fill={color}
                        stroke="#FAF5EE"
                        strokeWidth="1.5"
                        opacity={winner && !spinning && !isWinner ? 0.35 : 1}
                      />
                      <text
                        x={txt.x}
                        y={txt.y}
                        transform={`rotate(${textRotation} ${txt.x} ${txt.y})`}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={fontSize}
                        fontFamily="Inter Tight, sans-serif"
                        fontWeight="700"
                        fill="white"
                        style={{ pointerEvents: 'none' }}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}
                <circle r="26" fill="#FAF5EE" stroke="#C81E3A" strokeWidth="3" />
                <text
                  y="2"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="26"
                  fill="#C81E3A"
                >
                  ♥
                </text>
              </g>
            </svg>
          </div>

          <button
            className="btn-primary wheel-spin-btn"
            onClick={spin}
            disabled={spinning}
          >
            <RotateCw size={18} className={spinning ? 'spinning-icon' : ''} />
            {spinning ? 'Girando…' : winner ? 'Girar de nuevo' : 'Girar la ruleta'}
          </button>

          {winner && !spinning && (
            <div className="wheel-result">
              <div className="wheel-result-label">Esta vez vamos a…</div>
              <div className="wheel-result-name">{winner.name}</div>
              <div
                className="wheel-result-score"
                style={{ color: scoreColor(getScore(winner)) }}
              >
                {getScore(winner).toFixed(1)}
                <span> · {scoreLabel(getScore(winner))}</span>
              </div>
              {winner.location && (
                <div className="wheel-result-meta">
                  <MapPin size={12} /> {winner.location}
                </div>
              )}
              <button
                className="btn-secondary"
                onClick={() => onSelect(winner)}
                style={{ marginTop: '1rem' }}
              >
                Ver reseña completa
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,700;9..144,900&family=Inter+Tight:wght@400;500;600&display=swap');

.lovebite-app {
  --cream: #FAF5EE;
  --cream-deep: #F2E8D8;
  --cherry: #C81E3A;
  --cherry-dark: #8E0E26;
  --burgundy: #5C0A1F;
  --rose-deep: #E27D8C;
  --rose-soft: #F4C9CF;
  --gold: #B8862E;
  --ink: #2A1416;
  --ash: #8A6F73;
  --line: rgba(92, 10, 31, 0.12);

  --font-display: 'Fraunces', serif;
  --font-body: 'Inter Tight', sans-serif;

  min-height: 100vh;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
  position: relative;
  overflow-x: hidden;
}

.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.hero {
  position: relative;
  padding: 2.5rem 2rem 0;
  max-width: 980px;
  margin: 0 auto;
  z-index: 2;
}

.hero::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -150px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--rose-soft) 0%, transparent 70%);
  opacity: 0.5;
  z-index: -1;
}

.hero-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 2px 8px rgba(200, 30, 58, 0.3));
}

.brand-name {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.02em;
  color: var(--burgundy);
  margin: 0;
  line-height: 1;
}

.brand-tag {
  font-size: 0.78rem;
  color: var(--ash);
  margin: 0.15rem 0 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 500;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--line);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  flex-wrap: wrap;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--line);
}

.stat-num {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--cherry);
  line-height: 1;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--ash);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 0.3rem;
  font-weight: 500;
}

.main {
  max-width: 980px;
  margin: 2.5rem auto 0;
  padding: 0 2rem 3rem;
  position: relative;
  z-index: 2;
}

.toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: white;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.7rem 1.1rem;
  color: var(--ash);
  transition: all 0.2s;
}

.search-box:focus-within {
  border-color: var(--cherry);
  box-shadow: 0 0 0 3px rgba(200, 30, 58, 0.1);
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--ink);
}

.sort-toggle {
  display: flex;
  background: white;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px;
}

.sort-toggle button {
  border: none;
  background: transparent;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.82rem;
  color: var(--ash);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.sort-toggle button.active {
  background: var(--cherry);
  color: white;
}

.cards {
  display: grid;
  gap: 1rem;
}

.card {
  display: flex;
  background: white;
  border: 1px solid var(--line);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  opacity: 0;
  animation: rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px -15px rgba(92, 10, 31, 0.2);
  border-color: var(--rose-deep);
}

.card-score {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1.25rem;
  background: linear-gradient(135deg, var(--cream-deep) 0%, var(--cream) 100%);
  border-right: 1px solid var(--line);
  min-width: 110px;
}

.card-score-num {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
  font-style: italic;
}

.card-score-label {
  font-size: 0.7rem;
  color: var(--ash);
  margin-top: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
  text-align: center;
}

.card-body {
  flex: 1;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-name {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--ink);
  margin: 0;
  line-height: 1.1;
}

.card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: var(--ash);
  flex-wrap: wrap;
}

.card-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.card-notes {
  color: var(--ink);
  opacity: 0.75;
  font-size: 0.88rem;
  margin: 0.3rem 0 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-mini-cats {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.mini-cat {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: var(--ash);
  background: var(--cream);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.mini-cat-val {
  font-weight: 700;
  color: var(--ink);
}

.empty {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--ash);
}

.empty h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-style: italic;
  margin: 1rem 0 0.3rem;
  color: var(--burgundy);
}

.empty p {
  margin: 0;
  font-size: 0.9rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--cherry);
  color: white;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px -2px rgba(200, 30, 58, 0.4);
}

.btn-primary:hover:not(:disabled) {
  background: var(--cherry-dark);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px -2px rgba(200, 30, 58, 0.5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: var(--ash);
  border: 1px solid var(--line);
  padding: 0.75rem 1.4rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  border-color: var(--ash);
  color: var(--ink);
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: var(--ash);
  border: 1px solid var(--line);
  padding: 0.55rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.2s;
  font-family: var(--font-body);
}

.btn-delete:hover {
  color: var(--cherry);
  border-color: var(--cherry);
}

.back-btn {
  background: transparent;
  border: none;
  color: var(--ash);
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  font-family: var(--font-body);
  padding: 0;
  font-weight: 500;
}

.back-btn:hover {
  color: var(--cherry);
}

.detail {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.detail-hero {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.detail-score-circle {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 3px solid var(--cherry);
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 10px 30px -10px rgba(200, 30, 58, 0.3);
  position: relative;
}

.detail-score-num {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 900;
  font-style: italic;
  line-height: 1;
}

.detail-score-out {
  font-size: 0.85rem;
  color: var(--ash);
  margin-top: -0.2rem;
}

.detail-score-tag {
  position: absolute;
  bottom: -12px;
  background: var(--ink);
  color: white;
  font-size: 0.7rem;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 600;
}

.detail-info {
  flex: 1;
  min-width: 250px;
}

.detail-name {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 900;
  font-style: italic;
  color: var(--burgundy);
  margin: 0 0 0.75rem;
  line-height: 1.05;
}

.detail-meta {
  display: flex;
  gap: 1.25rem;
  color: var(--ash);
  font-size: 0.9rem;
  flex-wrap: wrap;
}

.detail-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-notes {
  margin: 1.5rem 0 0;
  padding: 0;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.15rem;
  color: var(--ink);
  line-height: 1.5;
  position: relative;
  padding-left: 1.5rem;
  border-left: 3px solid var(--cherry);
}

.quote-mark {
  display: none;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--burgundy);
  margin: 0 0 1.5rem;
  letter-spacing: 0;
}

.detail-cats {
  background: white;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 2rem;
}

.cat-row {
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
}

.cat-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cat-row:first-child {
  padding-top: 0;
}

.cat-row-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.6rem;
}

.cat-row-emoji {
  font-size: 1.3rem;
}

.cat-row-text {
  flex: 1;
}

.cat-row-label {
  font-weight: 600;
  color: var(--ink);
  font-size: 0.95rem;
}

.cat-row-desc {
  font-size: 0.78rem;
  color: var(--ash);
  margin-top: 0.1rem;
}

.cat-row-val {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
  font-style: italic;
}

.cat-row-val span {
  font-size: 0.7em;
  color: var(--ash);
  font-style: normal;
  font-weight: 500;
}

.cat-bar {
  height: 6px;
  background: var(--cream-deep);
  border-radius: 999px;
  overflow: hidden;
}

.cat-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.form {
  background: white;
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 2.5rem;
  animation: fadeIn 0.4s ease;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-header h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  font-style: italic;
  color: var(--burgundy);
  margin: 0;
}

.icon-btn {
  background: var(--cream);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ash);
  transition: all 0.2s;
}

.icon-btn:hover {
  background: var(--rose-soft);
  color: var(--cherry);
}

.form-preview {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--cream) 0%, var(--cream-deep) 100%);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.form-preview-label {
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ash);
  font-weight: 600;
}

.form-preview-score {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 900;
  font-style: italic;
  line-height: 1.1;
  margin: 0.25rem 0;
  transition: color 0.3s;
}

.form-preview-tag {
  font-size: 0.85rem;
  color: var(--ink);
  font-weight: 500;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-grid .field:first-child {
  grid-column: 1 / -1;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--burgundy);
  margin-bottom: 0.4rem;
  letter-spacing: 0.03em;
}

.field input, .field textarea {
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--ink);
  background: var(--cream);
  transition: all 0.2s;
  resize: vertical;
}

.field input:focus, .field textarea:focus {
  outline: none;
  border-color: var(--cherry);
  background: white;
  box-shadow: 0 0 0 3px rgba(200, 30, 58, 0.1);
}

.slider-row {
  padding: 1rem 0;
  border-bottom: 1px solid var(--line);
}

.slider-row:last-of-type {
  border-bottom: none;
}

.slider-head {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.75rem;
}

.slider-emoji {
  font-size: 1.4rem;
}

.slider-text {
  flex: 1;
}

.slider-label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--ink);
}

.slider-desc {
  font-size: 0.78rem;
  color: var(--ash);
  margin-top: 0.1rem;
}

.slider-val {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 900;
  font-style: italic;
  min-width: 2.5rem;
  text-align: right;
  transition: color 0.2s;
}

.slider-row input[type="range"] {
  width: 100%;
  height: 6px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.footer {
  text-align: center;
  padding: 2rem 1rem 3rem;
  color: var(--ash);
  font-size: 0.82rem;
  font-style: italic;
  font-family: var(--font-display);
  position: relative;
  z-index: 2;
}

.footer span {
  color: var(--cherry);
}

/* ===== Hero actions, ghost button ===== */
.hero-actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.7);
  color: var(--burgundy);
  border: 1px solid var(--line);
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(6px);
}

.btn-ghost:hover {
  background: white;
  border-color: var(--cherry);
  color: var(--cherry);
  transform: translateY(-1px);
}

/* ===== Pro mode visuals ===== */
.card-pro-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--burgundy);
  background: var(--rose-soft);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  margin-top: 0.5rem;
}

.pro-banner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--burgundy);
  background: var(--rose-soft);
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  margin-bottom: 0.9rem;
}

.pro-stars {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  margin-left: 0.4rem;
}

.pro-stars.centered {
  display: flex;
  justify-content: center;
  margin: 0.5rem 0 0;
}

.cat-weight {
  font-size: 0.72rem;
  color: var(--ash);
  font-weight: 500;
  margin-left: 0.4rem;
  letter-spacing: 0.02em;
}

/* ===== Method toggle inside the form ===== */
.method-toggle {
  display: flex;
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 0.5rem;
  gap: 4px;
}

.method-toggle button {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: none;
  background: transparent;
  padding: 0.65rem 1rem;
  border-radius: 999px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--ash);
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.method-toggle button.active {
  background: var(--cherry);
  color: white;
  box-shadow: 0 4px 12px -3px rgba(200, 30, 58, 0.4);
}

.method-hint {
  font-size: 0.82rem;
  color: var(--ash);
  margin: 0 0 1.5rem;
  line-height: 1.45;
  font-style: italic;
}

/* ===== Spinning wheel ===== */
.wheel-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.4s ease;
}

.wheel-page .back-btn {
  align-self: flex-start;
}

.wheel-intro {
  text-align: center;
  margin-bottom: 2rem;
}

.wheel-title {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 900;
  font-style: italic;
  color: var(--burgundy);
  margin: 0 0 0.4rem;
  line-height: 1.05;
}

.wheel-sub {
  color: var(--ash);
  font-size: 0.95rem;
  margin: 0 0 0.85rem;
}

.wheel-count {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--burgundy);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--rose-soft);
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
}

.wheel-stage {
  position: relative;
  width: min(420px, 90vw);
  height: min(420px, 90vw);
  margin-bottom: 2rem;
  filter: drop-shadow(0 25px 40px -15px rgba(92, 10, 31, 0.35));
}

.wheel-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.wheel-pointer {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 14px solid transparent;
  border-right: 14px solid transparent;
  border-top: 24px solid var(--ink);
  z-index: 3;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
}

.wheel-spin-btn {
  font-size: 1rem;
  padding: 0.9rem 1.8rem;
}

.wheel-spin-btn:disabled {
  cursor: progress;
}

.spinning-icon {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.wheel-result {
  margin-top: 2rem;
  text-align: center;
  padding: 1.75rem 2rem;
  background: white;
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 20px 40px -20px rgba(92, 10, 31, 0.25);
  animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  max-width: 360px;
}

.wheel-result-label {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ash);
  font-weight: 600;
}

.wheel-result-name {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 900;
  font-style: italic;
  color: var(--burgundy);
  margin: 0.5rem 0 0.4rem;
  line-height: 1.1;
}

.wheel-result-score {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  font-style: italic;
}

.wheel-result-score span {
  font-size: 0.82rem;
  color: var(--ash);
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.wheel-result-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  color: var(--ash);
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .hero { padding: 1.5rem 1.25rem 0; }
  .main { padding: 0 1.25rem 2rem; }
  .form { padding: 1.5rem; }
  .brand-name { font-size: 1.6rem; }
  .detail-name { font-size: 1.8rem; }
  .detail-score-circle { width: 130px; height: 130px; }
  .detail-score-num { font-size: 2.8rem; }
  .form-grid { grid-template-columns: 1fr; }
  .card { flex-direction: row; }
  .card-score { min-width: 90px; padding: 1rem 0.75rem; }
  .card-score-num { font-size: 2.2rem; }
  .stats-row { padding: 1rem; }
  .stat-num { font-size: 1.4rem; }
  .wheel-title { font-size: 1.8rem; }
  .method-toggle button { font-size: 0.78rem; padding: 0.55rem 0.6rem; }
}
`;
