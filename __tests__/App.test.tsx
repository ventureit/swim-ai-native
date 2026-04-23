/**
 * @format
 */

jest.mock('react-native-vision-camera', () => ({
  Camera: 'Camera',
  useCameraDevice: () => ({ id: 'mock', position: 'back', formats: [] }),
  useCameraPermission: () => ({ hasPermission: true, requestPermission: async () => true }),
  useFrameProcessor: () => ({ frameProcessor: () => {}, type: 'readonly' }),
  VisionCameraProxy: {
    initFrameProcessorPlugin: () => ({ call: () => {} }),
  },
}));

jest.mock('react-native-worklets-core', () => ({
  useSharedValue: (v: unknown) => ({ value: v }),
  Worklets: { createRunOnJS: (fn: (...a: unknown[]) => void) => fn },
}));

jest.mock('react-native-mediapipe', () => {
  class MockBaseViewCoordinator {
    mockViewSize: { width: number; height: number };
    constructor(
      viewSize: { width: number; height: number },
      _mirrored: boolean,
      _sensor: string,
      _output: string,
      _mode: string,
    ) {
      this.mockViewSize = viewSize;
    }
    getFrameDims(info: { inputImageWidth: number; inputImageHeight: number }) {
      return { width: info.inputImageWidth, height: info.inputImageHeight };
    }
    convertPoint(_frame: { width: number; height: number }, p: { x: number; y: number }) {
      return { x: p.x * this.mockViewSize.width, y: p.y * this.mockViewSize.height };
    }
  }
  return {
    BaseViewCoordinator: MockBaseViewCoordinator,
    Delegate: { CPU: 0, GPU: 1 },
    RunningMode: { IMAGE: 0, VIDEO: 1, LIVE_STREAM: 2 },
  };
});

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
