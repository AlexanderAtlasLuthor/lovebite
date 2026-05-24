# Instrucciones — Love Bite

Guía completa para correr la app en tu teléfono, modificar el código y publicarla a las tiendas.

---

## 1. Requisitos previos

En tu computadora (Mac, Windows o Linux):

- **Node.js 18 o superior** — verifica con `node --version`. Si no lo tienes, instálalo desde [nodejs.org](https://nodejs.org) o con `brew install node` en Mac.
- **Git** — para clonar el proyecto.
- **Una conexión WiFi compartida** entre tu compu y tu teléfono (para el primer arranque).

En tu teléfono:

- **iPhone**: instala **Expo Go** desde el [App Store](https://apps.apple.com/app/expo-go/id982107779).
- **Android**: instala **Expo Go** desde [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent).

No necesitas Xcode, Android Studio ni cuenta de Apple Developer para empezar.

---

## 2. Instalar el proyecto

Abre la terminal y corre:

```bash
git clone https://github.com/AlexanderAtlasLuthor/lovebite.git
cd lovebite
npm install
```

La instalación toma unos 30–60 segundos y descarga ~1100 paquetes.

---

## 3. Correr la app en tu teléfono (recomendado)

Asegúrate de que tu teléfono y tu compu están en la **misma red WiFi**, luego:

```bash
npx expo start
```

Verás algo así en la terminal:

```
› Metro waiting on exp://192.168.1.42:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

- **iPhone**: abre la app **Cámara**, apunta al QR, toca el banner que aparece — abre Expo Go con tu app.
- **Android**: abre **Expo Go**, toca *Scan QR code*, escanea el código.

La primera carga descarga el bundle (~30 s). Las siguientes recargas son instantáneas porque se hot-reload automáticamente cada vez que guardas un archivo.

### Si tu compu y tu teléfono no están en la misma red

Usa modo *tunnel* (más lento pero funciona desde cualquier red):

```bash
npx expo start --tunnel
```

---

## 4. Correr en simulador (opcional)

### iOS (solo Mac, requiere Xcode)

```bash
npx expo start --ios
```

### Android (requiere Android Studio con un emulador configurado)

```bash
npx expo start --android
```

### Web (preview rápido en navegador)

```bash
npx expo start --web
```

El modo web es útil para iterar rápido, pero algunas cosas (sliders, animación de la ruleta, fuentes) se ven mejor en dispositivo real.

---

## 5. Cómo usar la app

### Pantalla principal — Lista de reseñas

- **Buscar**: el campo de búsqueda filtra por nombre del lugar, ciudad o palabras en las notas.
- **Ordenar**: *Recientes* (por fecha de visita) o *Mejor* (por puntaje).
- **Tocar una tarjeta** abre el detalle con desglose por categoría.
- **Ruleta** (botón arriba) abre la rueda para escoger restaurante.
- **Nueva** abre el formulario para añadir una reseña.

### Crear una reseña

1. Toca **Nueva** arriba.
2. Elige el método de calificación:
   - **Nuestro método** — 5 categorías que pesan igual.
   - **Crítico pro** — rúbrica ponderada estilo Michelin/NYT.
3. Llena nombre, ubicación, fecha y notas.
4. Arrastra cada slider del 1 al 10. El puntaje arriba se actualiza en vivo.
5. Toca **Guardar reseña**.

### Usar la ruleta

1. Desde la lista, toca **Ruleta**.
2. La rueda muestra solo los lugares con puntaje **7 o más**.
3. Toca **Girar la ruleta** — la rueda gira ~4.5 segundos.
4. El ganador aparece resaltado y los demás segmentos se atenúan.
5. Toca **Girar de nuevo** si no les convence, o **Ver reseña completa** para abrir el detalle.

### Eliminar una reseña

Dentro del detalle, toca **Eliminar reseña** abajo — pide confirmación antes de borrar.

---

## 6. Estructura del proyecto

```
lovebite/
├── App.jsx                  Punto de entrada — fuentes + providers
├── index.js                 Registro del componente raíz para Expo
├── app.json                 Config de Expo (nombre, icono, bundle ID)
├── babel.config.js          Plugin de reanimated
├── README.md                Qué es la app
├── INSTRUCCIONES.md         Este archivo
└── src/
    ├── theme.js             Colores, fuentes, espaciado
    ├── navigation.jsx       React Navigation native-stack
    ├── data/
    │   ├── categories.js    Categorías casual y profesional
    │   └── seed.js          27 reseñas de ejemplo
    ├── lib/
    │   ├── scoring.js       Cálculos de puntaje, ponderaciones, estrellas
    │   └── geometry.js      Helpers SVG (polar a cartesiano) y fechas
    ├── state/
    │   └── ReviewsContext.jsx  Context + AsyncStorage
    ├── components/
    │   ├── BrandHeader.jsx
    │   ├── StatsRow.jsx
    │   ├── ReviewCard.jsx
    │   ├── MethodToggle.jsx
    │   ├── ProStars.jsx
    │   ├── CategoryBar.jsx
    │   ├── RatingSlider.jsx
    │   ├── Buttons.jsx
    │   └── Wheel.jsx
    └── screens/
        ├── ListScreen.jsx
        ├── DetailScreen.jsx
        ├── NewReviewScreen.jsx
        └── WheelScreen.jsx
```

Cada archivo es pequeño (el más grande tiene 280 líneas) y tiene una responsabilidad clara.

---

## 7. Modificar el código

Mientras `npx expo start` corre, cualquier cambio que guardes se refleja al instante en el teléfono.

### Cambiar los colores

Edita `src/theme.js` — los colores se usan por nombre (`colors.cherry`, `colors.burgundy`, etc.) en toda la app.

### Cambiar las categorías

Edita `src/data/categories.js` — añade, quita o cambia categorías casuales o profesionales. **Cuidado**: si cambias claves (`key`), las reseñas viejas pueden quedar incompletas.

### Cambiar las reseñas semilla

Edita `src/data/seed.js`. **Importante**: estas reseñas solo se muestran la primera vez. Una vez que la app guarda algo en AsyncStorage, ignora la semilla. Para forzar reset, borra la app del teléfono y vuelve a instalarla.

### Cambiar el comportamiento de la ruleta

Edita `src/components/Wheel.jsx`:

- `SPIN_MS` — duración del giro en milisegundos.
- `FULL_ROTATIONS` — cuántas vueltas completas antes de parar (más = más dramático).

Y `src/screens/WheelScreen.jsx` línea ~24 — cambia el umbral `>= 7` si quieren incluir más o menos restaurantes.

---

## 8. Publicar a las tiendas

Cuando estén listos para publicar en App Store / Play Store:

### Preparativos

1. Diseña un icono `assets/icon.png` de 1024×1024 y un splash `assets/splash.png`. Añádelos en `app.json`.
2. Crea cuenta en **Apple Developer Program** ($99 USD/año) y/o **Google Play Console** ($25 USD una vez).

### Build con EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Para iOS:

```bash
eas build --platform ios
```

Para Android:

```bash
eas build --platform android
```

EAS compila la app en la nube de Expo (gratis hasta cierto límite mensual) y te da un `.ipa` (iOS) o `.aab` (Android) listo para subir.

### Subir

```bash
eas submit --platform ios     # Sube a App Store Connect
eas submit --platform android # Sube a Google Play Console
```

Apple suele tardar 1–3 días en revisar; Google horas.

---

## 9. Solución de problemas

**"Network response timed out" al escanear el QR**
Tu teléfono y tu compu no están en la misma red, o un firewall bloquea el puerto 8081. Usa `npx expo start --tunnel`.

**"Unable to resolve module ..." al arrancar**
Detén Metro (Ctrl+C) y corre:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

**La app se ve sin las fuentes bonitas**
Las fuentes se descargan la primera vez que abres la app. Si tarda mucho, es por la red — espera un poco más o relanza.

**El icono del teléfono es el de Expo Go genérico**
Es normal — mientras desarrolles con Expo Go, ese es el icono. Cuando construyas con `eas build`, tendrá tu icono propio (siempre que añadas `assets/icon.png`).

**Quiero borrar todas las reseñas y empezar de cero**
Borra la app del teléfono y vuelve a abrirla desde Expo Go — eso limpia el AsyncStorage.

---

## 10. Comandos útiles

| Comando | Qué hace |
|---------|----------|
| `npx expo start` | Arranca Metro (servidor de desarrollo) con QR |
| `npx expo start --tunnel` | Igual pero usando túnel para redes distintas |
| `npx expo start --clear` | Limpia el caché de Metro antes de arrancar |
| `npx expo start --web` | Preview en navegador |
| `npx expo install <paquete>` | Instala un paquete con la versión compatible con tu SDK |
| `eas build --platform ios` | Compila la app para App Store en la nube |
| `eas submit --platform ios` | Sube el `.ipa` resultante a App Store Connect |

---

*Cualquier duda, abre un issue o pregúntale a Claude.* ♥
