import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../theme';

export default function BrandHeader({ right }) {
  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <Svg viewBox="0 0 40 40" width={36} height={36}>
          <Path
            d="M20 34 C 8 25, 4 16, 10 10 C 14 6, 18 8, 20 12 C 22 8, 26 6, 30 10 C 36 16, 32 25, 20 34 Z"
            fill={colors.cherry}
          />
          <Path
            d="M16 18 Q 18 16, 20 18 Q 22 16, 24 18 L 24 21 Q 20 24, 16 21 Z"
            fill={colors.cream}
            opacity={0.9}
          />
        </Svg>
        <View>
          <Text style={styles.name}>Love Bite</Text>
          <Text style={styles.tag}>Nuestro diario gastronómico</Text>
        </View>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.burgundy,
    lineHeight: 30,
  },
  tag: {
    fontSize: 11,
    color: colors.ash,
    letterSpacing: 0.8,
    marginTop: 2,
    fontFamily: fonts.bodyMedium,
    textTransform: 'uppercase',
  },
});
