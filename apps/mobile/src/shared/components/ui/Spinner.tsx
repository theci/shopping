/**
 * Spinner 컴포넌트
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  style?: ViewStyle;
}

const sizeMap = {
  sm: 'small' as const,
  md: 'small' as const,
  lg: 'large' as const,
};

export function Spinner({ size = 'md', color = '#7c3aed', style }: SpinnerProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={sizeMap[size]} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
