import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import SwimsScreen from './src/screens/SwimsScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import DetailScreen from './src/screens/DetailScreen';

export type RootStackParamList = {
  Swims: undefined;
  Review: {
    analysis: {
      frame: any;
      keypoints: {
        shoulder: { x: number; y: number };
        elbow: { x: number; y: number };
        wrist: { x: number; y: number };
      };
      errorType: 'dropped_elbow' | 'late_catch';
    };
  };
  Detail: {
    analysis: {
      frame: any;
      keypoints: {
        shoulder: { x: number; y: number };
        elbow: { x: number; y: number };
        wrist: { x: number; y: number };
      };
      errorType: 'dropped_elbow' | 'late_catch';
    };
  };
};

enableScreens(true);

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Swims" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Swims" component={SwimsScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}