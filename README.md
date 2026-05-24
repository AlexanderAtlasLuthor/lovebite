# Love Bite

> *Nuestro diario gastronómico — un lugar para guardar cada mordida que valió la pena.*

Love Bite es una app móvil hecha para parejas que aman comer y quieren llevar memoria honesta de cada restaurante que visitan juntos. No es una red social, no tiene anuncios, no pide cuentas: es un diario íntimo entre dos personas y sus platos favoritos.

---

## ¿Qué hace?

### 📖 Diario de reseñas

Cada reseña guarda:

- **Nombre del lugar** y ubicación
- **Fecha** de la visita
- **Notas** personales — qué pidieron, qué pasó, momentos memorables
- **Calificación** del 1 al 10 en cinco categorías

Las reseñas se ordenan por más recientes o por mejor puntuadas, y se pueden buscar por nombre, ciudad o palabra clave dentro de las notas.

### 🍷 Dos métodos de calificación

**Nuestro método** (casual)
Las cinco categorías pesan igual — pensado para reseñar como pareja sin complicaciones:

| Categoría | Mide |
|-----------|------|
| 💰 Costo | Relación calidad-precio |
| ✨ Ambiente | Qué tan bonito es |
| 🤍 Servicio | Atención del personal |
| 🍝 Comida | Sabor y calidad |
| ⚡ Rapidez | Tiempo de espera |

**Crítico profesional** (ponderado)
Una rúbrica inspirada en Michelin, Pete Wells (*New York Times*) y Zagat, donde cada categoría tiene un peso distinto:

| Categoría | Peso | Mide |
|-----------|-----:|------|
| 🍽️ Cocina | 40 % | Ingredientes, técnica, armonía, creatividad |
| 🛎️ Servicio | 20 % | Atención, conocimiento, ritmo de la mesa |
| 🕯️ Ambiente | 15 % | Atmósfera, decoración, confort acústico |
| 💎 Valor | 15 % | Relación calidad-precio percibida |
| 🎯 Consistencia | 10 % | Ejecución pareja a lo largo de la visita |

El puntaje final se calcula como promedio ponderado y se traduce a una **calificación de 0 a 4 estrellas estilo NYT**:

- ⭐⭐⭐⭐ Extraordinario (9.5+)
- ⭐⭐⭐ Excelente (8.0+)
- ⭐⭐ Muy bueno (6.5+)
- ⭐ Satisfactorio (5.0+)
- *(sin estrellas)* Pobre

Ambos métodos conviven en la misma lista — las reseñas profesionales llevan un badge **PRO** para distinguirlas.

### 🎰 Ruleta para decidir dónde comer

Cuando no logran ponerse de acuerdo, la **Ruleta** filtra todos los restaurantes con puntaje **7 o más** (los que ya saben que les gustaron), los pone en una rueda animada y la giran. Cinco segundos después, el destino decide.

Los segmentos perdedores se atenúan y aparece una tarjeta con el ganador, su puntaje y un enlace directo a la reseña completa.

### 💾 Persistencia

Todo se guarda localmente en el teléfono con `AsyncStorage`. No hay backend, no hay cuenta, no hay sincronización en la nube — la data nunca sale del dispositivo. Si reinstalan la app, las reseñas se pierden (pendiente: añadir export/import a JSON).

---

## Tecnología

- **Expo SDK 51** + **React Native 0.74** — código nativo real para iOS y Android desde un solo codebase JavaScript.
- **React Navigation** (native-stack) — transiciones nativas: slide para detalles, modal para el formulario, fade para la ruleta.
- **react-native-svg** — la marca de corazón y la rueda animada se dibujan con SVG, escalables a cualquier densidad de pantalla.
- **react-native-community/slider** — sliders nativos de iOS/Android, no simulados.
- **Animated API** con *native driver* — la ruleta gira a 60 fps porque la animación corre en el hilo de UI, no en JavaScript.
- **lucide-react-native** — iconografía consistente y de trazo fino.
- **@expo-google-fonts** — *Fraunces* (display, italic, weight 900) y *Inter Tight* (cuerpo) cargadas desde Google Fonts.
- **AsyncStorage** — persistencia local de las reseñas.

---

## Estética

La paleta gira alrededor del rojo cereza profundo de las películas viejas, con crema, oro y rosa pálido como acentos. La tipografía mezcla la elegancia de *Fraunces* (display, italic) con la limpieza moderna de *Inter Tight* para texto.

| Color | Hex | Uso |
|-------|-----|-----|
| Cherry | `#C81E3A` | Primario — botones, acentos |
| Burgundy | `#5C0A1F` | Títulos display |
| Cream | `#FAF5EE` | Fondo |
| Gold | `#B8862E` | Puntajes 9+ |
| Rose Deep | `#E27D8C` | Puntajes intermedios |
| Ink | `#2A1416` | Texto principal |

---

## Próximos pasos

- [ ] Exportar / importar reseñas a JSON (respaldo)
- [ ] Sincronización opcional entre dos teléfonos (pareja)
- [ ] Fotos por reseña
- [ ] Estadísticas anuales ("Top 5 del año")
- [ ] Etiquetas / cocinas (mexicano, italiano, asado…)
- [ ] Modo oscuro
- [ ] Iconos y splash screen propios

---

*Hecho con cariño en cada bocado.* ♥
