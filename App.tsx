import React from 'react';
import { View, Text } from 'react-native';
import CameraScreen from './src/screens/CameraScreen'; // keep your path
import SwimsScreen from './src/screens/SwimsScreen';
import ReviewScreen from './src/screens/ReviewScreen';

export default function App() {
  console.log('CameraScreen:', CameraScreen);

  return (
    <View style={{ flex: 1 }}>
      {/* <CameraScreen /> */}
      {/* <SwimsScreen /> */}
      <ReviewScreen />
    </View>
  );
}