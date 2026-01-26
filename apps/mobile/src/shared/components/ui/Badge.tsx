/**
 * Badge 컴포넌트
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: string;
  style?: ViewStyle;
}

export function Badge({
  label,
  children,
  variant = 'default',
  size = 'md',
  color,
  style,
}: BadgeProps) {
  const content = label || children;

  const customBackgroundStyle = color
    ? { backgroundColor: `${color}20` }
    : undefined;

  const customTextStyle = color
    ? { color }
    : undefined;

  return (
    <View
      style={[
        styles.badge,
        styles[variant],
        styles[`${size}Size`],
        customBackgroundStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          customTextStyle,
        ]}
      >
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
  // Sizes
  smSize: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mdSize: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lgSize: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  smText: {
    fontSize: 10,
  },
  mdText: {
    fontSize: 12,
  },
  lgText: {
    fontSize: 14,
  },
  // Variants
  default: {
    backgroundColor: '#f3f4f6',
  },
  defaultText: {
    color: '#374151',
  },
  primary: {
    backgroundColor: '#ede9fe',
  },
  primaryText: {
    color: '#7c3aed',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
  },
  secondaryText: {
    color: '#6b7280',
  },
  success: {
    backgroundColor: '#dcfce7',
  },
  successText: {
    color: '#16a34a',
  },
  warning: {
    backgroundColor: '#fef3c7',
  },
  warningText: {
    color: '#d97706',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  dangerText: {
    color: '#dc2626',
  },
  info: {
    backgroundColor: '#e0f2fe',
  },
  infoText: {
    color: '#0284c7',
  },
});
