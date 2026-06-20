/**
 * Root application component
 *
 * Entry point for the React Native app.
 * Sets up navigation, theme, and global providers.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/utils/constants';

export default function App() {
  const { getCurrentUser } = useAuthStore();

  useEffect(() => {
    // Initialize: check if user is already logged in
    getCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* TODO: Set up Expo Router navigation */}
      {/* TODO: Render navigation stack based on auth state */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.SURFACE_LIGHT,
  },
});
