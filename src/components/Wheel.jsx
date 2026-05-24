import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';
import { SEGMENT_COLORS } from '../data/categories';
import { polarToCartesian } from '../lib/geometry';

const SPIN_MS = 4500;
const FULL_ROTATIONS = 6;
const NUMBERED_LABEL_THRESHOLD = 10;
const WHEEL_RADIUS = 180;

const Wheel = forwardRef(function Wheel({ items, winner, onSpinEnd }, ref) {
  const { width } = useWindowDimensions();
  const size = Math.min(Math.max(width - 32, 280), 430);
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);
  const [spinning, setSpinning] = useState(false);

  const n = items.length;
  const segAngle = n ? 360 / n : 0;
  const showNamesOnWheel = n <= NUMBERED_LABEL_THRESHOLD;
  const nameFontSize = Math.max(11, Math.min(16, 125 / Math.max(n, 5)));
  const markerRadius = n > 18 ? 13 : n > 12 ? 15 : 18;
  const markerFontSize = n > 18 ? 13 : n > 12 ? 15 : 17;
  const maxChars = n > 18 ? 9 : n > 12 ? 13 : n > 8 ? 17 : 22;

  const segments = useMemo(() => {
    if (!n) return [];
    return items.map((item, i) => {
      const start = i * segAngle - 90;
      const end = start + segAngle;
      const p1 = polarToCartesian(WHEEL_RADIUS, start);
      const p2 = polarToCartesian(WHEEL_RADIUS, end);
      const largeArc = segAngle > 180 ? 1 : 0;
      const d = `M 0 0 L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
      const mid = start + segAngle / 2;
      const txt = polarToCartesian(112, mid);
      const marker = polarToCartesian(n > 18 ? 130 : 124, mid);
      const flipped = mid > 90 || mid < -90;
      const textRotation = flipped ? mid + 180 : mid;
      const label =
        item.name.length > maxChars ? item.name.slice(0, maxChars - 1) + '…' : item.name;
      return {
        id: item.id,
        d,
        label,
        number: i + 1,
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
        textX: txt.x,
        textY: txt.y,
        markerX: marker.x,
        markerY: marker.y,
        textRotation,
      };
    });
  }, [items, n, segAngle, maxChars]);

  useImperativeHandle(ref, () => ({
    spin: () => {
      if (spinning || !n) return;
      setSpinning(true);
      const winnerIdx = Math.floor(Math.random() * n);

      // El puntero está arriba (-90°). Centro del segmento i (sin rotar):
      // (i*segAngle + segAngle/2) - 90. Queremos que el centro caiga en -90,
      // así que la rotación efectiva mod 360 debe ser -(i*segAngle + segAngle/2).
      const targetMod = ((-(winnerIdx * segAngle + segAngle / 2)) % 360 + 360) % 360;
      const currentMod = ((currentRotation.current % 360) + 360) % 360;
      const delta = ((targetMod - currentMod) + 360) % 360;
      const newRotation = currentRotation.current + 360 * FULL_ROTATIONS + delta;
      currentRotation.current = newRotation;

      Animated.timing(rotation, {
        toValue: newRotation,
        duration: SPIN_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setSpinning(false);
        onSpinEnd?.(items[winnerIdx]);
      });
    },
    isSpinning: () => spinning,
  }));

  const rotateStr = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.stage, { width: size + 18, height: size + 22 }]}>
      <View
        style={[
          styles.shadowDisc,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        pointerEvents="none"
      />
      <View style={styles.pointerWrap} pointerEvents="none">
        <View style={styles.pointer} />
        <View style={styles.pointerDot} />
      </View>
      <Animated.View
        style={[
          styles.rotor,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate: rotateStr }],
          },
        ]}
      >
        <Svg viewBox="-200 -200 400 400" width="100%" height="100%">
          <G>
            {segments.map((s) => {
              const dim = winner && !spinning && winner.id !== s.id;
              return (
                <G key={s.id} opacity={dim ? 0.35 : 1}>
                  <Path d={s.d} fill={s.color} stroke={colors.cream} strokeWidth={2} />
                  {showNamesOnWheel ? (
                    <SvgText
                      x={s.textX}
                      y={s.textY}
                      fontSize={nameFontSize}
                      fontWeight="800"
                      fill={colors.white}
                      stroke="rgba(42, 20, 22, 0.28)"
                      strokeWidth={0.8}
                      textAnchor="middle"
                      transform={`rotate(${s.textRotation} ${s.textX} ${s.textY})`}
                    >
                      {s.label}
                    </SvgText>
                  ) : (
                    <G>
                      <Circle
                        cx={s.markerX}
                        cy={s.markerY}
                        r={markerRadius}
                        fill={colors.cream}
                        stroke={colors.white}
                        strokeWidth={2}
                      />
                      <SvgText
                        x={s.markerX}
                        y={s.markerY + markerFontSize * 0.34}
                        fontSize={markerFontSize}
                        fontWeight="900"
                        fill={colors.burgundy}
                        textAnchor="middle"
                      >
                        {s.number}
                      </SvgText>
                    </G>
                  )}
                </G>
              );
            })}
            <Circle r={184} fill="none" stroke={colors.white} strokeWidth={7} />
            <Circle r={160} fill="none" stroke="rgba(255, 255, 255, 0.32)" strokeWidth={1.5} />
            <Circle r={42} fill={colors.cream} stroke={colors.white} strokeWidth={5} />
            <Circle r={30} fill={colors.cherry} />
            <SvgText y={-3} fontSize={10} fontWeight="900" fill={colors.white} textAnchor="middle">
              LOVE
            </SvgText>
            <SvgText y={12} fontSize={10} fontWeight="900" fill={colors.white} textAnchor="middle">
              BITE
            </SvgText>
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  stage: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  shadowDisc: {
    position: 'absolute',
    backgroundColor: colors.white,
    shadowColor: colors.burgundy,
    shadowOpacity: 0.26,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
  },
  rotor: {
    overflow: 'hidden',
    backgroundColor: colors.cream,
    borderWidth: 4,
    borderColor: colors.white,
  },
  pointerWrap: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderTopWidth: 31,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.ink,
  },
  pointerDot: {
    position: 'absolute',
    top: 8,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.cream,
  },
});

export default Wheel;
