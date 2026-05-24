import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular_Italic,
  Fraunces_700Bold,
  Fraunces_900Black_Italic,
} from '@expo-google-fonts/fraunces';
import {
  InterTight_400Regular,
  InterTight_500Medium,
  InterTight_600SemiBold,
} from '@expo-google-fonts/inter-tight';

import Navigation from './src/navigation';
import { ReviewsProvider } from './src/state/ReviewsContext';
import { colors } from './src/theme';

export default function App() {
  const [loaded] = useFonts({
    Fraunces_400Regular_Italic,
    Fraunces_700Bold,
    Fraunces_900Black_Italic,
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
  });

  if (!loaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.cherry} />
        <Text style={styles.loaderText}>Love Bite</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReviewsProvider>
          <StatusBar style="dark" />
          <Navigation />
        </ReviewsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    gap: 12,
  },
  loaderText: {
    color: colors.burgundy,
    fontSize: 14,
    letterSpacing: 1,
  },
});
