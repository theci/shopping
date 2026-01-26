/**
 * 주문 상세 화면
 */

import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Spinner, Badge, EmptyState } from '@/shared/components/ui';
import { formatPrice, formatDate } from '@/shared/utils/format';
import { useOrder, useCancelOrder } from '@/features/order/hooks/useOrders';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/features/order/api/orderApi';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading, error } = useOrder(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const handleCancel = () => {
    Alert.alert(
      '주문 취소',
      '정말 주문을 취소하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '예, 취소합니다',
          style: 'destructive',
          onPress: () => cancelOrder(orderId),
        },
      ]
    );
  };

  // 로딩
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: '주문 상세' }} />
        <View style={styles.loadingContainer}>
          <Spinner size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // 에러 또는 주문 없음
  if (error || !order) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen options={{ title: '주문 상세' }} />
        <EmptyState
          icon="alert-circle-outline"
          title="주문을 찾을 수 없습니다"
          action={
            <Button
              title="주문 내역으로"
              onPress={() => router.replace('/order')}
            />
          }
        />
      </SafeAreaView>
    );
  }

  const canCancel = order.status === 'PENDING' || order.status === 'PAID';

  return (
    <>
      <Stack.Screen options={{ title: `주문 #${order.orderNumber}` }} />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 주문 상태 */}
          <Card style={styles.section}>
            <View style={styles.statusHeader}>
              <Badge
                label={ORDER_STATUS_LABELS[order.status]}
                color={ORDER_STATUS_COLORS[order.status]}
                size="lg"
              />
              <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
            </View>
            <Text style={styles.orderNumber}>주문번호: {order.orderNumber}</Text>
          </Card>

          {/* 주문 상품 */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>주문 상품</Text>
            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Image
                  source={{ uri: item.productImageUrl || 'https://via.placeholder.com/60' }}
                  style={styles.itemImage}
                  contentFit="cover"
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
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

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>총 결제 금액</Text>
              <Text style={styles.totalAmount}>{formatPrice(order.totalAmount)}</Text>
            </View>
          </Card>

          {/* 배송지 정보 */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>배송지 정보</Text>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={18} color="#6b7280" />
              <Text style={styles.infoText}>{order.shippingAddress.recipientName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={18} color="#6b7280" />
              <Text style={styles.infoText}>{order.shippingAddress.phoneNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color="#6b7280" />
              <Text style={styles.infoText}>
                [{order.shippingAddress.zipCode}] {order.shippingAddress.address}
                {order.shippingAddress.addressDetail && ` ${order.shippingAddress.addressDetail}`}
              </Text>
            </View>
          </Card>

          {/* 주문 타임라인 */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>주문 진행 상황</Text>
            <View style={styles.timeline}>
              <TimelineItem
                label="주문 접수"
                date={order.createdAt}
                isActive={true}
              />
              {order.paidAt && (
                <TimelineItem
                  label="결제 완료"
                  date={order.paidAt}
                  isActive={true}
                />
              )}
              {order.shippedAt && (
                <TimelineItem
                  label="배송 시작"
                  date={order.shippedAt}
                  isActive={true}
                />
              )}
              {order.deliveredAt && (
                <TimelineItem
                  label="배송 완료"
                  date={order.deliveredAt}
                  isActive={true}
                />
              )}
              {order.cancelledAt && (
                <TimelineItem
                  label="주문 취소"
                  date={order.cancelledAt}
                  isActive={true}
                  isError={true}
                />
              )}
            </View>
          </Card>

          {/* 주문 취소 버튼 */}
          {canCancel && (
            <Button
              title="주문 취소"
              variant="danger"
              onPress={handleCancel}
              loading={isCancelling}
              fullWidth
              style={styles.cancelButton}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function TimelineItem({
  label,
  date,
  isActive,
  isError = false,
}: {
  label: string;
  date: string;
  isActive: boolean;
  isError?: boolean;
}) {
  return (
    <View style={styles.timelineItem}>
      <View
        style={[
          styles.timelineDot,
          isActive && styles.timelineDotActive,
          isError && styles.timelineDotError,
        ]}
      />
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineLabel, isError && styles.timelineLabelError]}>
          {label}
        </Text>
        <Text style={styles.timelineDate}>{formatDate(date)}</Text>
      </View>
    </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  orderNumber: {
    fontSize: 14,
    color: '#6b7280',
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
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  itemDetail: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: '#7c3aed',
  },
  timelineDotError: {
    backgroundColor: '#ef4444',
  },
  timelineContent: {
    marginLeft: 12,
  },
  timelineLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  timelineLabelError: {
    color: '#ef4444',
  },
  timelineDate: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  cancelButton: {
    marginTop: 8,
  },
});
