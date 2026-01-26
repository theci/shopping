/**
 * 장바구니 화면
 */

import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button, EmptyState, Spinner } from '@/shared/components/ui';
import { useAuthStore } from '@/lib/auth';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItem } from '@/features/cart/components/CartItem';
import { formatPrice } from '@/shared/utils/format';

export default function CartScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: cart, isLoading, refetch, isRefetching } = useCart();

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="로그인이 필요합니다"
          description="장바구니를 이용하려면 로그인해주세요."
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

  // 로딩 상태
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const cartItems = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;
  const availableItems = cartItems.filter((item) => item.status !== 'OUT_OF_STOCK');

  // 빈 장바구니
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="장바구니가 비어있습니다"
          description="원하는 상품을 장바구니에 담아보세요."
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
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListHeaderComponent={
          <Text style={styles.itemCount}>
            장바구니 상품 {cartItems.length}개
          </Text>
        }
      />

      {/* 하단 결제 정보 */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>총 상품 금액</Text>
          <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
        </View>
        {availableItems.length < cartItems.length && (
          <Text style={styles.warningText}>
            * 품절 상품 {cartItems.length - availableItems.length}개는 주문에서 제외됩니다
          </Text>
        )}
        <Button
          title={`${formatPrice(totalAmount)} 주문하기`}
          onPress={() => router.push('/checkout')}
          fullWidth
          size="lg"
          disabled={availableItems.length === 0}
        />
      </View>
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
  itemCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  summary: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  warningText: {
    fontSize: 12,
    color: '#ef4444',
    marginBottom: 12,
  },
});
