/**
 * OrderCard 컴포넌트
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { formatPrice, formatDate } from '@/shared/utils/format';
import { Badge } from '@/shared/components/ui';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../api/orderApi';
import type { Order } from '../api/orderApi';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const firstItem = order.items[0];
  const remainingCount = order.items.length - 1;

  return (
    <Link href={`/order/${order.id}`} asChild>
      <TouchableOpacity style={styles.container} activeOpacity={0.7}>
        <View style={styles.header}>
          <Text style={styles.orderNumber}>주문번호 {order.orderNumber}</Text>
          <Badge
            label={ORDER_STATUS_LABELS[order.status]}
            color={ORDER_STATUS_COLORS[order.status]}
          />
        </View>

        <View style={styles.content}>
          <Image
            source={{ uri: firstItem?.productImageUrl || 'https://via.placeholder.com/60' }}
            style={styles.image}
            contentFit="cover"
          />

          <View style={styles.info}>
            <Text style={styles.productName} numberOfLines={1}>
              {firstItem?.productName}
              {remainingCount > 0 && ` 외 ${remainingCount}건`}
            </Text>
            <Text style={styles.totalAmount}>{formatPrice(order.totalAmount)}</Text>
            <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 13,
    color: '#6b7280',
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
});
