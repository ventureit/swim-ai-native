import React from 'react';
import { StatusBar } from 'react-native';
import CameraScreen from './src/screens/CameraScreen';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <CameraScreen />
    </>
  );
}
