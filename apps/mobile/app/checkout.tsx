/**
 * 주문하기 화면
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Button, Input, Card, Spinner, EmptyState } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { useAuthStore } from '@/lib/auth';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCreateOrder } from '@/features/order/hooks/useOrders';
import type { ShippingAddress } from '@/features/order/api/orderApi';

export default function CheckoutScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const customer = useAuthStore((state) => state.customer);
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { mutate: createOrder, isPending: isOrdering } = useCreateOrder();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: customer?.name || '',
    phoneNumber: customer?.phoneNumber || '',
    zipCode: '',
    address: '',
    addressDetail: '',
  });

  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  // 비로그인
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="로그인이 필요합니다"
          description="주문하려면 로그인해주세요."
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
  if (isCartLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const cartItems = cart?.items?.filter((item) => item.status !== 'OUT_OF_STOCK') || [];
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 장바구니 비어있음
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          icon="cart-outline"
          title="주문할 상품이 없습니다"
          description="장바구니에 상품을 담아주세요."
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

  const validate = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.recipientName.trim()) {
      newErrors.recipientName = '받는 분 이름을 입력해주세요.';
    }
    if (!shippingAddress.phoneNumber.trim()) {
      newErrors.phoneNumber = '연락처를 입력해주세요.';
    } else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(shippingAddress.phoneNumber.replace(/-/g, ''))) {
      newErrors.phoneNumber = '올바른 연락처 형식이 아닙니다.';
    }
    if (!shippingAddress.zipCode.trim()) {
      newErrors.zipCode = '우편번호를 입력해주세요.';
    }
    if (!shippingAddress.address.trim()) {
      newErrors.address = '주소를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = () => {
    if (!validate()) return;

    createOrder({
      shippingAddress,
      paymentMethod: 'CARD',
      cartItemIds: cartItems.map((item) => item.id),
    });
  };

  const updateField = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 주문 상품 */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>주문 상품</Text>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image
                  source={{ uri: item.productImageUrl || 'https://via.placeholder.com/60' }}
                  style={styles.itemImage}
                  contentFit="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.productName}
                  </Text>
                  <Text style={styles.itemDetail}>
                    {formatPrice(item.price)} x {item.quantity}개
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </Card>

          {/* 배송지 정보 */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>배송지 정보</Text>

            <Input
              label="받는 분"
              value={shippingAddress.recipientName}
              onChangeText={(v) => updateField('recipientName', v)}
              error={errors.recipientName}
              placeholder="받는 분 이름"
            />

            <Input
              label="연락처"
              value={shippingAddress.phoneNumber}
              onChangeText={(v) => updateField('phoneNumber', v)}
              error={errors.phoneNumber}
              placeholder="01012345678"
              keyboardType="phone-pad"
            />

            <Input
              label="우편번호"
              value={shippingAddress.zipCode}
              onChangeText={(v) => updateField('zipCode', v)}
              error={errors.zipCode}
              placeholder="우편번호"
              keyboardType="number-pad"
            />

            <Input
              label="주소"
              value={shippingAddress.address}
              onChangeText={(v) => updateField('address', v)}
              error={errors.address}
              placeholder="기본 주소"
            />

            <Input
              label="상세 주소"
              value={shippingAddress.addressDetail}
              onChangeText={(v) => updateField('addressDetail', v)}
              placeholder="상세 주소 (선택)"
            />
          </Card>

          {/* 결제 수단 */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>결제 수단</Text>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentText}>신용/체크카드</Text>
              <Text style={styles.paymentNote}>테스트 결제</Text>
            </View>
          </Card>
        </ScrollView>

        {/* 하단 결제 버튼 */}
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>총 결제 금액</Text>
            <Text style={styles.totalAmount}>{formatPrice(totalAmount)}</Text>
          </View>
          <Button
            title={`${formatPrice(totalAmount)} 결제하기`}
            onPress={handleOrder}
            loading={isOrdering}
            fullWidth
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    color: '#1f2937',
  },
  itemDetail: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 15,
    color: '#1f2937',
  },
  paymentNote: {
    fontSize: 13,
    color: '#6b7280',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
