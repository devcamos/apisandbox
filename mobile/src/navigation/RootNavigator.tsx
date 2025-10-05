import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import HomeScreen from '../screens/HomeScreen';
import Phase1Screen from '../screens/Phase1Screen';
import Phase1InteractiveScreen from '../screens/Phase1InteractiveScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Phase1" component={Phase1Screen} />
        <Stack.Screen name="Phase1Interactive" component={Phase1InteractiveScreen} />
        <Stack.Screen name="Phase2">
          {(props) => (
            <PlaceholderScreen
              {...props}
              title="Third-Party Integrations"
              subtitle="Safely connect and maintain external APIs"
              colors={['#a855f7', '#ec4899']}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Phase3">
          {(props) => (
            <PlaceholderScreen
              {...props}
              title="Inter-Service Communication"
              subtitle="Master service-to-service patterns"
              colors={['#f97316', '#ef4444']}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Phase4">
          {(props) => (
            <PlaceholderScreen
              {...props}
              title="Principal-Level Architecture"
              subtitle="Think like an integration architect"
              colors={['#22c55e', '#10b981']}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

