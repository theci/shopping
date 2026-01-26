/**
 * ProductCard 컴포넌트
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { formatPrice } from '@/shared/utils/format';
import type { Product } from '../api/productApi';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.status === 'OUT_OF_STOCK';
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountRate = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity style={styles.container} activeOpacity={0.7}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl || 'https://via.placeholder.com/200' }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          {isOutOfStock && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>품절</Text>
            </View>
          )}
          {hasDiscount && !isOutOfStock && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountRate}%</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          {product.category && (
            <Text style={styles.category} numberOfLines={1}>
              {product.category.name}
            </Text>
          )}
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                {formatPrice(product.originalPrice!)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    aspectRatio: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  soldOutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldOutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  category: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
});
