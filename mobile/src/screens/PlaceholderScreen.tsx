import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type PlaceholderScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
  title: string;
  subtitle: string;
  colors: string[];
};

export default function PlaceholderScreen({ 
  navigation, 
  title, 
  subtitle, 
  colors 
}: PlaceholderScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={colors} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.comingSoonText}>🚧 Coming Soon</Text>
        <Text style={styles.message}>
          This phase is under construction. Check back soon!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  comingSoonText: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

