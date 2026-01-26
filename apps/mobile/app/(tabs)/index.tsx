/**
 * 홈 화면
 */

import { View, Text, StyleSheet, ScrollView, RefreshControl, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/features/product/hooks/useProducts';
import { ProductCard } from '@/features/product/components/ProductCard';
import { ProductListSkeleton } from '@/features/product/components/ProductListSkeleton';
import { EmptyState } from '@/shared/components/ui';

export default function HomeScreen() {
  const {
    data: featuredData,
    isLoading: isFeaturedLoading,
    refetch: refetchFeatured,
    isRefetching: isFeaturedRefetching,
  } = useProducts({
    page: 0,
    size: 4,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const {
    data: newArrivalsData,
    isLoading: isNewArrivalsLoading,
    refetch: refetchNewArrivals,
    isRefetching: isNewArrivalsRefetching,
  } = useProducts({
    page: 0,
    size: 4,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const featuredProducts = featuredData?.content || [];
  const newArrivalsProducts = newArrivalsData?.content || [];
  const isRefreshing = isFeaturedRefetching || isNewArrivalsRefetching;

  const onRefresh = async () => {
    await Promise.all([refetchFeatured(), refetchNewArrivals()]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* 배너 영역 */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>신규 회원 혜택</Text>
              <Text style={styles.bannerSubtitle}>첫 구매 시 10% 할인</Text>
            </View>
            <Ionicons name="gift-outline" size={48} color="#e9d5ff" />
          </View>
        </View>

        {/* 추천 상품 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추천 상품</Text>
            <Link href="/search" style={styles.seeAllLink}>
              <Text style={styles.seeAllText}>전체보기</Text>
            </Link>
          </View>

          {isFeaturedLoading ? (
            <ProductListSkeleton count={4} />
          ) : featuredProducts.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="상품이 없습니다"
              description="곧 새로운 상품이 등록됩니다."
            />
          ) : (
            <View style={styles.productGrid}>
              {featuredProducts.map((product) => (
                <View key={product.id} style={styles.productWrapper}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 신상품 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>신상품</Text>
            <Link href="/search" style={styles.seeAllLink}>
              <Text style={styles.seeAllText}>전체보기</Text>
            </Link>
          </View>

          {isNewArrivalsLoading ? (
            <ProductListSkeleton count={4} />
          ) : newArrivalsProducts.length === 0 ? (
            <EmptyState
              icon="cube-outline"
              title="상품이 없습니다"
              description="곧 새로운 상품이 등록됩니다."
            />
          ) : (
            <View style={styles.productGrid}>
              {newArrivalsProducts.map((product) => (
                <View key={product.id} style={styles.productWrapper}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  banner: {
    backgroundColor: '#7c3aed',
    margin: 16,
    borderRadius: 12,
    padding: 24,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#e9d5ff',
    marginTop: 4,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  seeAllLink: {
    padding: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#7c3aed',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  productWrapper: {
    width: '50%',
    padding: 6,
  },
});
