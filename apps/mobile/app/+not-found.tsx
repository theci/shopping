/**
 * 404 Not Found 화면
 */

import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Button } from '@/shared/components/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '페이지를 찾을 수 없음' }} />
      <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>페이지를 찾을 수 없습니다</Text>
        <Link href="/(tabs)" asChild>
          <Button title="홈으로 돌아가기" style={styles.button} />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 24,
  },
  button: {
    minWidth: 200,
  },
});
