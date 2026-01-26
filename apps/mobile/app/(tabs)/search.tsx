/**
 * 검색 화면
 */

import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useProducts } from '@/features/product/hooks/useProducts';
import { ProductCard } from '@/features/product/components/ProductCard';
import { ProductListSkeleton } from '@/features/product/components/ProductListSkeleton';
import { EmptyState } from '@/shared/components/ui';

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(['운동화', '후드티', '청바지', '가방']);

  const { data, isLoading, isFetching } = useProducts({
    page: 0,
    size: 20,
    keyword: searchQuery || undefined,
  });

  const products = data?.content || [];
  const isSearching = searchQuery.length > 0;

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (trimmed) {
      setSearchQuery(trimmed);
      // 최근 검색어에 추가
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s !== trimmed);
        return [trimmed, ...filtered].slice(0, 10);
      });
    }
  };

  const handleClearSearch = () => {
    setKeyword('');
    setSearchQuery('');
  };

  const handleSelectRecent = (search: string) => {
    setKeyword(search);
    setSearchQuery(search);
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* 검색 입력 */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="상품을 검색해보세요"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        // 검색 결과
        <View style={styles.searchResults}>
          {isLoading ? (
            <ProductListSkeleton count={6} />
          ) : products.length === 0 ? (
            <EmptyState
              icon="search-outline"
              title="검색 결과가 없습니다"
              description={`"${searchQuery}"에 대한 검색 결과가 없습니다.`}
            />
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.productWrapper}>
                  <ProductCard product={item} />
                </View>
              )}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.list}
              ListHeaderComponent={
                <Text style={styles.resultCount}>
                  검색 결과 {data?.totalElements || 0}개
                </Text>
              }
            />
          )}
          {isFetching && !isLoading && (
            <View style={styles.fetchingIndicator}>
              <ActivityIndicator size="small" color="#7c3aed" />
            </View>
          )}
        </View>
      ) : (
        // 검색 전 화면
        <ScrollView style={styles.content}>
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>최근 검색어</Text>
                <TouchableOpacity onPress={handleClearRecentSearches}>
                  <Text style={styles.clearButton}>전체 삭제</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.tagContainer}>
                {recentSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleSelectRecent(search)}
                  >
                    <Text style={styles.tagText}>{search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* 인기 검색어 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>인기 검색어</Text>
            <View style={styles.popularList}>
              {['스니커즈', '맨투맨', '코트', '니트', '패딩'].map(
                (item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularItem}
                    onPress={() => handleSelectRecent(item)}
                  >
                    <Text style={styles.popularRank}>{index + 1}</Text>
                    <Text style={styles.popularText}>{item}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  clearButton: {
    fontSize: 13,
    color: '#6b7280',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  popularList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  popularRank: {
    width: 24,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  popularText: {
    fontSize: 15,
    color: '#1f2937',
  },
  searchResults: {
    flex: 1,
  },
  resultCount: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  row: {
    gap: 12,
  },
  productWrapper: {
    flex: 1,
    maxWidth: '50%',
    marginBottom: 12,
  },
  fetchingIndicator: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
  },
});
