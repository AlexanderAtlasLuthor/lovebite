import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../theme';

export function PrimaryButton({ onPress, disabled, children, icon: Icon, iconProps }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primary,
        pressed && !disabled && styles.primaryPressed,
        disabled && styles.disabled,
      ]}
    >
      {Icon && <Icon size={18} color={colors.white} strokeWidth={2.4} {...iconProps} />}
      <Text style={styles.primaryText}>{children}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ onPress, children, icon: Icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed]}
    >
      {Icon && <Icon size={16} color={colors.ash} />}
      <Text style={styles.secondaryText}>{children}</Text>
    </Pressable>
  );
}

export function GhostButton({ onPress, children, icon: Icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, pressed && styles.ghostPressed]}
    >
      {Icon && <Icon size={16} color={colors.burgundy} strokeWidth={2.2} />}
      <Text style={styles.ghostText}>{children}</Text>
    </Pressable>
  );
}

export function DeleteButton({ onPress, children, icon: Icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.delete, pressed && styles.deletePressed]}
    >
      {Icon && <Icon size={14} color={colors.ash} />}
      <Text style={styles.deleteText}>{children}</Text>
    </Pressable>
  );
}

const baseBtn = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  paddingHorizontal: 22,
  paddingVertical: 14,
  borderRadius: 999,
};

const styles = StyleSheet.create({
  primary: {
    ...baseBtn,
    backgroundColor: colors.cherry,
    shadowColor: colors.cherry,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryPressed: { backgroundColor: colors.cherryDark, transform: [{ scale: 0.98 }] },
  primaryText: {
    color: colors.white,
    fontFamily: fonts.bodySemi,
    fontSize: 15,
  },
  disabled: { opacity: 0.5 },
  secondary: {
    ...baseBtn,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
  },
  secondaryPressed: { borderColor: colors.ash },
  secondaryText: {
    color: colors.ash,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },
  ghost: {
    ...baseBtn,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  ghostPressed: { backgroundColor: colors.white, borderColor: colors.cherry },
  ghostText: {
    color: colors.burgundy,
    fontFamily: fonts.bodySemi,
    fontSize: 14,
  },
  delete: {
    ...baseBtn,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  deletePressed: { borderColor: colors.cherry },
  deleteText: {
    color: colors.ash,
    fontFamily: fonts.body,
    fontSize: 13,
  },
});
