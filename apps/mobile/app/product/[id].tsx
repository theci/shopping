/**
 * 상품 상세 화면
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Spinner, Badge } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useProduct } from '@/features/product/hooks/useProducts';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useAuthStore } from '@/lib/auth/authStore';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const [quantity, setQuantity] = useState(1);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: product, isLoading, error } = useProduct(productId);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      Alert.alert('로그인 필요', '장바구니에 담으려면 로그인이 필요합니다.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    addToCart(
      { productId, quantity },
      {
        onSuccess: () => {
          Alert.alert('알림', '장바구니에 담았습니다.', [
            { text: '계속 쇼핑', style: 'cancel' },
            { text: '장바구니 보기', onPress: () => router.push('/(tabs)/cart') },
          ]);
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      Alert.alert('로그인 필요', '구매하려면 로그인이 필요합니다.', [
        { text: '취소', style: 'cancel' },
        { text: '로그인', onPress: () => router.push('/auth/login') },
      ]);
      return;
    }

    addToCart(
      { productId, quantity },
      {
        onSuccess: () => {
          router.push('/checkout');
        },
      }
    );
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: '상품 상세' }} />
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // 에러 또는 상품 없음
  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: '상품 상세' }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#d1d5db" />
          <Text style={styles.errorTitle}>상품을 찾을 수 없습니다</Text>
          <Button
            title="홈으로 돌아가기"
            onPress={() => router.replace('/(tabs)')}
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const isOutOfStock = product.status === 'OUT_OF_STOCK';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountRate = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <>
      <Stack.Screen options={{ title: product.name }} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView>
          {/* 상품 이미지 */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.imageUrl || 'https://via.placeholder.com/400' }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
            {isOutOfStock && (
              <View style={styles.soldOutOverlay}>
                <Text style={styles.soldOutText}>품절</Text>
              </View>
            )}
          </View>

          {/* 상품 정보 */}
          <View style={styles.info}>
            {/* 카테고리 & 상태 */}
            <View style={styles.tags}>
              {product.category && (
                <Badge label={product.category.name} variant="secondary" />
              )}
              {isOutOfStock && <Badge label="품절" variant="danger" />}
            </View>

            {/* 상품명 */}
            <Text style={styles.name}>{product.name}</Text>

            {/* 가격 */}
            <View style={styles.priceContainer}>
              {hasDiscount && (
                <Text style={styles.discount}>{discountRate}%</Text>
              )}
              <Text style={styles.price}>{formatPrice(product.price)}</Text>
            </View>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice!)}
              </Text>
            )}

            <View style={styles.divider} />

            {/* 상품 설명 */}
            <Text style={styles.descriptionTitle}>상품 설명</Text>
            <Text style={styles.description}>
              {product.description || '상품 설명이 없습니다.'}
            </Text>

            {/* 재고 정보 */}
            {!isOutOfStock && (
              <View style={styles.stockInfo}>
                <Ionicons name="cube-outline" size={16} color="#6b7280" />
                <Text style={styles.stockText}>
                  재고: {product.stockQuantity}개
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 하단 고정 버튼 */}
        <View style={styles.bottomBar}>
          {/* 수량 선택 */}
          <View style={styles.quantityContainer}>
            <Button
              title="-"
              variant="outline"
              size="sm"
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || isOutOfStock}
              style={styles.quantityButton}
            />
            <Text style={styles.quantity}>{quantity}</Text>
            <Button
              title="+"
              variant="outline"
              size="sm"
              onPress={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
              disabled={quantity >= product.stockQuantity || isOutOfStock}
              style={styles.quantityButton}
            />
          </View>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <Button
              title="장바구니"
              variant="outline"
              onPress={handleAddToCart}
              loading={isAddingToCart}
              disabled={isOutOfStock}
              style={styles.cartButton}
            />
            <Button
              title={isOutOfStock ? '품절' : '바로 구매'}
              onPress={handleBuyNow}
              disabled={isOutOfStock}
              style={styles.buyButton}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: width,
    height: width,
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    padding: 20,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  originalPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 24,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  stockText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
  },
  quantity: {
    fontSize: 18,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cartButton: {
    flex: 1,
  },
  buyButton: {
    flex: 2,
  },
});
