/**
 * ProductListSkeleton 컴포넌트
 */

import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/shared/components/ui';

interface ProductListSkeletonProps {
  count?: number;
}

export function ProductListSkeleton({ count = 4 }: ProductListSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton width="100%" height={150} borderRadius={8} />
          <View style={styles.info}>
            <Skeleton width="40%" height={12} />
            <Skeleton width="80%" height={16} style={{ marginTop: 8 }} />
            <Skeleton width="60%" height={18} style={{ marginTop: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  info: {
    padding: 12,
  },
});
