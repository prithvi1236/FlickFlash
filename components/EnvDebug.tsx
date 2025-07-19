import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Constants from 'expo-constants';

export function EnvDebug() {
  const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Environment Variables Debug:</Text>
      <Text style={styles.text}>Supabase URL: {supabaseUrl ? '✅ Found' : '❌ Missing'}</Text>
      <Text style={styles.text}>Supabase Key: {supabaseKey ? '✅ Found' : '❌ Missing'}</Text>
      <Text style={styles.text}>Status: {supabaseUrl && supabaseKey ? '✅ Ready' : '❌ Not Ready'}</Text>
      <Text style={styles.text}>Constants.expoConfig?.extra: {JSON.stringify(Constants.expoConfig?.extra, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
}); 