import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type Phase1ScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Phase1'>;
};

export default function Phase1Screen({ navigation }: Phase1ScreenProps) {
  const apiCategories = [
    {
      title: 'REST',
      description: 'Resource-oriented architecture using HTTP methods',
      icon: '🌐',
      color: '#3b82f6',
    },
    {
      title: 'GraphQL',
      description: 'Query language for APIs with flexible data fetching',
      icon: '🔍',
      color: '#a855f7',
    },
    {
      title: 'gRPC',
      description: 'High-performance RPC framework using Protocol Buffers',
      icon: '⚡',
      color: '#f97316',
    },
    {
      title: 'WebSocket',
      description: 'Full-duplex communication for real-time applications',
      icon: '🔄',
      color: '#22c55e',
    },
    {
      title: 'Event-Driven',
      description: 'Asynchronous messaging using event streams',
      icon: '📨',
      color: '#eab308',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3b82f6', '#06b6d4']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.phaseLabel}>Phase 1</Text>
        <Text style={styles.headerTitle}>Integration Mindset</Text>
        <Text style={styles.headerSubtitle}>
          Understand the "why" behind integrations
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Pareto Principle */}
          <View style={styles.paretoCard}>
            <View style={styles.paretoHeader}>
              <Text style={styles.paretoIcon}>📊</Text>
              <View>
                <Text style={styles.paretoTitle}>
                  Pareto Principle: The 20% That Matters
                </Text>
                <Text style={styles.paretoSubtitle}>
                  Focus on these core concepts to understand 80% of integration scenarios
                </Text>
              </View>
            </View>
            <View style={styles.paretoContent}>
              <Text style={styles.paretoSectionTitle}>🎯 Master These First</Text>
              <Text style={styles.paretoItem}>
                <Text style={styles.paretoNumber}>1.</Text> REST for CRUD - 90% of APIs use REST
              </Text>
              <Text style={styles.paretoItem}>
                <Text style={styles.paretoNumber}>2.</Text> HTTP Status Codes - Know 200, 201, 400, 404, 500
              </Text>
              <Text style={styles.paretoItem}>
                <Text style={styles.paretoNumber}>3.</Text> JSON Format - De facto standard
              </Text>
            </View>
          </View>

          {/* API Categories */}
          <Text style={styles.sectionTitle}>API Categories</Text>

          {apiCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => {
                if (category.title === 'REST') {
                  navigation.navigate('Phase1Interactive');
                }
              }}
            >
              <View style={[styles.iconBadge, { backgroundColor: category.color }]}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
              {category.title === 'REST' && (
                <View style={styles.demoButton}>
                  <Text style={styles.demoButtonText}>Try Demo →</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  phaseLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  paretoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#eab308',
  },
  paretoHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  paretoIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  paretoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  paretoSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  paretoContent: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
  },
  paretoSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#eab308',
    marginBottom: 8,
  },
  paretoItem: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  paretoNumber: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#94a3b8',
  },
  demoButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

