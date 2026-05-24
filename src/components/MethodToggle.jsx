import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Heart, Sparkles } from 'lucide-react-native';
import { colors, fonts } from '../theme';

const OPTIONS = [
  { key: 'casual', label: 'Nuestro método', Icon: Heart },
  { key: 'professional', label: 'Crítico pro', Icon: Sparkles },
];

export default function MethodToggle({ value, onChange }) {
  return (
    <View style={styles.container}>
      {OPTIONS.map(({ key, label, Icon }) => {
        const active = value === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[styles.btn, active && styles.btnActive]}
          >
            <Icon size={14} color={active ? colors.white : colors.ash} />
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  btnActive: {
    backgroundColor: colors.cherry,
    shadowColor: colors.cherry,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontFamily: fonts.bodySemi,
    fontSize: 13,
    color: colors.ash,
  },
  labelActive: { color: colors.white },
});
