import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type Phase1InteractiveScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Phase1Interactive'>;
};

export default function Phase1InteractiveScreen({ navigation }: Phase1InteractiveScreenProps) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState('1');
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const testGetUsers = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = Date.now();

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponse({ status: res.status, data: data.slice(0, 3) }); // Show first 3 users
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testGetUser = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = Date.now();

    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      const data = await res.json();
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponse({ status: res.status, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testPostUser = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    const startTime = Date.now();

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
        }),
      });
      const data = await res.json();
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      setResponse({ status: res.status, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#3b82f6', '#06b6d4']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back to Phase 1</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>REST API Demo</Text>
        <Text style={styles.headerSubtitle}>Interactive endpoint testing</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Try Live API Calls</Text>

          {/* GET All Users */}
          <View style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <View style={[styles.methodBadge, styles.getMethod]}>
                <Text style={styles.methodText}>GET</Text>
              </View>
              <Text style={styles.endpointPath}>/users</Text>
            </View>
            <Text style={styles.endpointDescription}>Fetch a list of all users</Text>
            <TouchableOpacity
              style={[styles.testButton, styles.getButton]}
              onPress={testGetUsers}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                {loading ? 'Testing...' : '▶ Try API'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* GET Single User */}
          <View style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <View style={[styles.methodBadge, styles.getMethod]}>
                <Text style={styles.methodText}>GET</Text>
              </View>
              <Text style={styles.endpointPath}>/users/:id</Text>
            </View>
            <Text style={styles.endpointDescription}>Get a specific user by ID</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              placeholder="User ID"
              keyboardType="numeric"
              placeholderTextColor="#64748b"
            />
            <TouchableOpacity
              style={[styles.testButton, styles.getButton]}
              onPress={testGetUser}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                {loading ? 'Testing...' : '▶ Try API'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* POST User */}
          <View style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <View style={[styles.methodBadge, styles.postMethod]}>
                <Text style={styles.methodText}>POST</Text>
              </View>
              <Text style={styles.endpointPath}>/users</Text>
            </View>
            <Text style={styles.endpointDescription}>Create a new user</Text>
            <TouchableOpacity
              style={[styles.testButton, styles.postButton]}
              onPress={testPostUser}
              disabled={loading}
            >
              <Text style={styles.testButtonText}>
                {loading ? 'Testing...' : '▶ Try API'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {loading && (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Making API call...</Text>
            </View>
          )}

          {/* Response */}
          {response && (
            <View style={styles.responseCard}>
              <View style={styles.responseHeader}>
                <Text style={styles.responseStatus}>
                  ✓ Response: {response.status} OK
                </Text>
                {responseTime !== null && (
                  <Text style={styles.responseTime}>⚡ {responseTime}ms</Text>
                )}
              </View>
              <ScrollView style={styles.responseContent} nestedScrollEnabled>
                <Text style={styles.responseText}>
                  {JSON.stringify(response.data, null, 2)}
                </Text>
              </ScrollView>
            </View>
          )}

          {/* Error */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>✗ Error: {error}</Text>
            </View>
          )}

          {/* Key Features */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>✨ Key Features</Text>
            <Text style={styles.infoItem}>• Stateless client-server communication</Text>
            <Text style={styles.infoItem}>• Standard HTTP methods</Text>
            <Text style={styles.infoItem}>• Cacheable responses</Text>
            <Text style={styles.infoItem}>• Resource-based URLs</Text>
          </View>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  endpointCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  endpointHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  methodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  getMethod: {
    backgroundColor: '#22c55e',
  },
  postMethod: {
    backgroundColor: '#3b82f6',
  },
  methodText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  endpointPath: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  endpointDescription: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 12,
  },
  testButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  getButton: {
    backgroundColor: '#22c55e',
  },
  postButton: {
    backgroundColor: '#3b82f6',
  },
  testButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 12,
  },
  responseCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  responseStatus: {
    color: '#22c55e',
    fontSize: 14,
    fontWeight: 'bold',
  },
  responseTime: {
    color: '#94a3b8',
    fontSize: 12,
  },
  responseContent: {
    maxHeight: 300,
  },
  responseText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  errorCard: {
    backgroundColor: '#7f1d1d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  infoTitle: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoItem: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 6,
  },
});

