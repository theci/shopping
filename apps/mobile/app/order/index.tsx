/**
 * 주문 내역 화면
 */

import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { EmptyState, Button, Spinner } from '@/shared/components/ui';
import { useAuthStore } from '@/lib/auth';
import { useOrders } from '@/features/order/hooks/useOrders';
import { OrderCard } from '@/features/order/components/OrderCard';

export default function OrderListScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data, isLoading, refetch, isRefetching } = useOrders({ size: 20 });

  // 비로그인
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon="receipt-outline"
          title="로그인이 필요합니다"
          description="주문 내역을 확인하려면 로그인해주세요."
          action={
            <Button
              title="로그인하기"
              onPress={() => router.push('/auth/login')}
            />
          }
        />
      </SafeAreaView>
    );
  }

  // 로딩
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const orders = data?.content || [];

  // 주문 없음
  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon="receipt-outline"
          title="주문 내역이 없습니다"
          description="첫 주문을 해보세요!"
          action={
            <Button
              title="쇼핑하러 가기"
              onPress={() => router.push('/(tabs)')}
            />
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderCard order={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <Text style={styles.totalCount}>
            총 {data?.totalElements || 0}건의 주문
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  totalCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
});
