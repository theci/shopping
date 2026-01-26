/**
 * 마이페이지 화면
 */

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@/shared/components/ui';
import { useAuthStore } from '@/lib/auth';

export default function MyPageScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const customer = useAuthStore((state) => state.customer);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loginPrompt}>
          <Ionicons name="person-circle-outline" size={80} color="#d1d5db" />
          <Text style={styles.loginTitle}>로그인이 필요합니다</Text>
          <Text style={styles.loginText}>
            로그인하고 다양한 서비스를 이용하세요.
          </Text>
          <Button
            title="로그인"
            onPress={() => router.push('/auth/login')}
            style={{ marginTop: 20, width: 200 }}
          />
          <Button
            title="회원가입"
            variant="outline"
            onPress={() => router.push('/auth/register')}
            style={{ marginTop: 12, width: 200 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        {/* 프로필 영역 */}
        <Card style={styles.profileCard}>
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer?.name?.[0] || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{customer?.name || '사용자'}</Text>
              <Text style={styles.email}>{customer?.email}</Text>
            </View>
          </View>
        </Card>

        {/* 주문 메뉴 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>주문</Text>
          <MenuItem
            icon="receipt-outline"
            title="주문 내역"
            onPress={() => router.push('/order')}
          />
        </View>

        {/* 내 정보 메뉴 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>내 정보</Text>
          <MenuItem
            icon="person-outline"
            title="프로필 수정"
            onPress={() => {}}
          />
          <MenuItem
            icon="location-outline"
            title="배송지 관리"
            onPress={() => {}}
          />
        </View>

        {/* 기타 메뉴 */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>기타</Text>
          <MenuItem
            icon="notifications-outline"
            title="알림 설정"
            onPress={() => {}}
          />
          <MenuItem
            icon="help-circle-outline"
            title="고객센터"
            onPress={() => {}}
          />
          <MenuItem icon="document-text-outline" title="이용약관" onPress={() => {}} />
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        {/* 앱 버전 */}
        <Text style={styles.version}>버전 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#6b7280" />
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  profileCard: {
    margin: 16,
    marginBottom: 0,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
  },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 32,
  },
});
