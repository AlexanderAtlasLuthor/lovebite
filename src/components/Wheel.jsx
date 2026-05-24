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

const Wheel = forwardRef(function Wheel({ items, winner, onSpinEnd }, ref) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - 40, 380);
  const rotation = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);
  const [spinning, setSpinning] = useState(false);

  const n = items.length;
  const segAngle = n ? 360 / n : 0;
  const fontSize = Math.max(7, Math.min(13, 170 / Math.max(n, 6)));
  const maxChars = n > 18 ? 9 : n > 12 ? 13 : n > 8 ? 17 : 22;

  const segments = useMemo(() => {
    if (!n) return [];
    return items.map((item, i) => {
      const start = i * segAngle - 90;
      const end = start + segAngle;
      const p1 = polarToCartesian(180, start);
      const p2 = polarToCartesian(180, end);
      const largeArc = segAngle > 180 ? 1 : 0;
      const d = `M 0 0 L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A 180 180 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
      const mid = start + segAngle / 2;
      const txt = polarToCartesian(112, mid);
      const flipped = mid > 90 || mid < -90;
      const textRotation = flipped ? mid + 180 : mid;
      const label =
        item.name.length > maxChars ? item.name.slice(0, maxChars - 1) + '…' : item.name;
      return {
        id: item.id,
        d,
        label,
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
        textX: txt.x,
        textY: txt.y,
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
    <View style={[styles.stage, { width: size, height: size }]}>
      <View style={styles.pointer} pointerEvents="none" />
      <Animated.View
        style={[
          styles.svgWrap,
          { width: size, height: size, transform: [{ rotate: rotateStr }] },
        ]}
      >
        <Svg viewBox="-200 -200 400 400" width="100%" height="100%">
          <G>
            {segments.map((s) => {
              const dim = winner && !spinning && winner.id !== s.id;
              return (
                <G key={s.id} opacity={dim ? 0.35 : 1}>
                  <Path d={s.d} fill={s.color} stroke={colors.cream} strokeWidth={1.5} />
                  <SvgText
                    x={s.textX}
                    y={s.textY}
                    fontSize={fontSize}
                    fontWeight="700"
                    fill={colors.white}
                    textAnchor="middle"
                    transform={`rotate(${s.textRotation} ${s.textX} ${s.textY})`}
                  >
                    {s.label}
                  </SvgText>
                </G>
              );
            })}
            <Circle r={26} fill={colors.cream} stroke={colors.cherry} strokeWidth={3} />
            <SvgText y={9} fontSize={26} fill={colors.cherry} textAnchor="middle">
              {'♥'}
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
  },
  svgWrap: {
    shadowColor: colors.burgundy,
    shadowOpacity: 0.35,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 18 },
    elevation: 6,
  },
  pointer: {
    position: 'absolute',
    top: -2,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.ink,
    zIndex: 3,
  },
});

export default Wheel;
