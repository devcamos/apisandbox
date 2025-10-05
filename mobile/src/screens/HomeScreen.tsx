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

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const phases = [
    {
      number: 1,
      title: 'Integration Mindset',
      description: 'Understand the "why" behind integrations',
      colors: ['#3b82f6', '#06b6d4'],
      icon: '🧠',
      screen: 'Phase1' as keyof RootStackParamList,
    },
    {
      number: 2,
      title: 'Third-Party Integrations',
      description: 'Safely connect and maintain external APIs',
      colors: ['#a855f7', '#ec4899'],
      icon: '🔌',
      screen: 'Phase2' as keyof RootStackParamList,
    },
    {
      number: 3,
      title: 'Inter-Service Communication',
      description: 'Master service-to-service patterns',
      colors: ['#f97316', '#ef4444'],
      icon: '🕸️',
      screen: 'Phase3' as keyof RootStackParamList,
    },
    {
      number: 4,
      title: 'Principal-Level Architecture',
      description: 'Think like an integration architect',
      colors: ['#22c55e', '#10b981'],
      icon: '🧭',
      screen: 'Phase4' as keyof RootStackParamList,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>API Integration Training</Text>
        <Text style={styles.headerSubtitle}>
          Master modern integration patterns
        </Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Training Phases</Text>

          {phases.map((phase) => (
            <TouchableOpacity
              key={phase.number}
              onPress={() => navigation.navigate(phase.screen)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[...phase.colors, phase.colors[0]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.phaseCard}
              >
                <View style={styles.phaseHeader}>
                  <Text style={styles.phaseIcon}>{phase.icon}</Text>
                  <View style={styles.phaseInfo}>
                    <Text style={styles.phaseLabel}>Phase {phase.number}</Text>
                    <Text style={styles.phaseTitle}>{phase.title}</Text>
                  </View>
                </View>
                <Text style={styles.phaseDescription}>{phase.description}</Text>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </LinearGradient>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cbd5e1',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  phaseCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '600',
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  phaseDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
  },
  arrowContainer: {
    alignItems: 'flex-end',
  },
  arrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

