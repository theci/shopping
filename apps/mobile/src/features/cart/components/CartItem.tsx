/**
 * CartItem 컴포넌트
 */

import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '@/shared/utils/format';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import type { CartItem as CartItemType } from '../api/cartApi';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const isOutOfStock = item.status === 'OUT_OF_STOCK';
  const isDisabled = isUpdating || isRemoving;

  const handleIncrease = () => {
    if (item.quantity >= item.stockQuantity) {
      Alert.alert('알림', '재고가 부족합니다.');
      return;
    }
    updateQuantity({ itemId: item.id, data: { quantity: item.quantity + 1 } });
  };

  const handleDecrease = () => {
    if (item.quantity <= 1) {
      handleRemove();
      return;
    }
    updateQuantity({ itemId: item.id, data: { quantity: item.quantity - 1 } });
  };

  const handleRemove = () => {
    Alert.alert(
      '상품 삭제',
      '장바구니에서 이 상품을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', style: 'destructive', onPress: () => removeItem(item.id) },
      ]
    );
  };

  return (
    <View style={[styles.container, isOutOfStock && styles.outOfStock]}>
      <Image
        source={{ uri: item.productImageUrl || 'https://via.placeholder.com/80' }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {item.productName}
          </Text>
          <TouchableOpacity
            onPress={handleRemove}
            disabled={isDisabled}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {isOutOfStock && (
          <Text style={styles.outOfStockText}>품절된 상품입니다</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(item.price * item.quantity)}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleDecrease}
              disabled={isDisabled || isOutOfStock}
            >
              <Ionicons name="remove" size={16} color={isDisabled ? '#d1d5db' : '#6b7280'} />
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={handleIncrease}
              disabled={isDisabled || isOutOfStock || item.quantity >= item.stockQuantity}
            >
              <Ionicons
                name="add"
                size={16}
                color={isDisabled || item.quantity >= item.stockQuantity ? '#d1d5db' : '#6b7280'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  outOfStock: {
    opacity: 0.6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginRight: 8,
  },
  outOfStockText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 32,
    textAlign: 'center',
  },
});
