/**
 * Native MediaPipe Pose (Pose Landmarker) via react-native-mediapipe frame processor.
 * No TensorFlow.js / TFLite. Single-person; left arm only for overlay + swim analysis.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSharedValue, Worklets } from 'react-native-worklets-core';
import {
  Camera,
  type Orientation,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  VisionCameraProxy,
} from 'react-native-vision-camera';
import PoseOverlay from '../components/PoseOverlay';
import {
  analyzeSwimFrame,
  INITIAL_SWIM_ANALYSIS_STATE,
  SwimAnalysisState,
} from '../lib/swimAnalysis';
import { BaseViewCoordinator, Delegate, RunningMode } from 'react-native-mediapipe';

const POSE_MODEL = 'pose_landmarker_lite.task';
const LEFT_SHOULDER = 11;
const LEFT_ELBOW = 13;
const LEFT_WRIST = 15;

const PoseDetection = NativeModules.PoseDetection;

const posePlugin = VisionCameraProxy.initFrameProcessorPlugin(
  'poseDetection',
  {} as Record<string, string | number | boolean | undefined>,
);

export type OverlayArmKeypoints = {
  shoulder: { x: number; y: number };
  elbow: { x: number; y: number };
  wrist: { x: number; y: number };
};

type LandmarkDict = { x: number; y: number };

function extractFirstPersonLandmarks(results: unknown): LandmarkDict[] | null {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }
  const block = results[0] as { landmarks?: unknown };
  const lm = block?.landmarks;
  if (lm == null) {
    return null;
  }
  const arr = Array.isArray((lm as unknown[])[0]) ? (lm as unknown[])[0] : lm;
  if (!Array.isArray(arr) || arr.length < 16) {
    return null;
  }
  return arr as LandmarkDict[];
}

export default function CameraScreen() {
  const [armKeypoints, setArmKeypoints] = useState<OverlayArmKeypoints | null>(null);
  const [previewSize, setPreviewSize] = useState({ width: 1, height: 1 });
  const [analysisText, setAnalysisText] = useState('Starting pose…');
  const [pluginError, setPluginError] = useState<string | null>(null);
  const [poseReady, setPoseReady] = useState(false);

  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const swimStateRef = useRef<SwimAnalysisState>(INITIAL_SWIM_ANALYSIS_STATE);
  const detectorHandleRef = useRef<number | null>(null);

  const detectorHandleSV = useSharedValue(-1);
  const outputOrientationSV = useSharedValue<Orientation>('portrait');
  const frameOrientationSV = useSharedValue<Orientation>('portrait');

  const statusText = !hasPermission
    ? 'Requesting camera permission…'
    : !device
      ? 'Loading camera…'
      : null;

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch(() => {});
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    if (posePlugin == null) {
      setPluginError('poseDetection frame processor plugin not linked (VisionCamera + MediaPipe).');
    }
  }, []);

  const applyLandmarks = useCallback(
    (body: Record<string, unknown>) => {
      const handle = body.handle as number;
      if (detectorHandleRef.current == null || handle !== detectorHandleRef.current) {
        return;
      }
      const landmarks = extractFirstPersonLandmarks(body.results);
      if (landmarks == null) {
        return;
      }
      const info = {
        inputImageWidth: Number(body.inputImageWidth),
        inputImageHeight: Number(body.inputImageHeight),
        inferenceTime: Number(body.inferenceTime),
      };
      const mirrored = device?.position === 'front';
      const vc = new BaseViewCoordinator(
        { width: previewSize.width, height: previewSize.height },
        mirrored,
        frameOrientationSV.value,
        outputOrientationSV.value,
        'cover',
      );
      const frameDims = vc.getFrameDims(info);
      const pick = (i: number) => {
        const lm = landmarks[i];
        return vc.convertPoint(frameDims, { x: lm.x, y: lm.y });
      };
      const shoulder = pick(LEFT_SHOULDER);
      const elbow = pick(LEFT_ELBOW);
      const wrist = pick(LEFT_WRIST);
      const next: OverlayArmKeypoints = { shoulder, elbow, wrist };
      setArmKeypoints(next);

      const analysis = analyzeSwimFrame(
        { shoulder: next.shoulder, elbow: next.elbow, wrist: next.wrist },
        swimStateRef.current,
      );
      swimStateRef.current = analysis.nextState;
      setAnalysisText(
        `Phase: ${analysis.phase} | Angle: ${Math.round(analysis.angle)}° | Feedback: ${analysis.feedback ?? 'None'}`,
      );
    },
    [device?.position, frameOrientationSV, outputOrientationSV, previewSize.height, previewSize.width],
  );

  const applyLandmarksOnJS = useMemo(() => Worklets.createRunOnJS(applyLandmarks), [applyLandmarks]);

  useEffect(() => {
    if (PoseDetection == null || Platform.OS !== 'ios') {
      if (Platform.OS !== 'ios') {
        setAnalysisText('MediaPipe pose is wired for iOS only in this build.');
      } else {
        setAnalysisText('PoseDetection native module missing.');
      }
      return;
    }
    const emitter = new NativeEventEmitter(PoseDetection);
    const sub = emitter.addListener(
      'onResults',
      (payload: Record<string, unknown>) => applyLandmarksOnJS(payload),
    );
    const errSub = emitter.addListener('onError', (e: { handle?: number; message?: string }) => {
      if (e?.handle === detectorHandleRef.current) {
        setAnalysisText(`Pose error: ${e.message ?? 'unknown'}`);
      }
    });

    PoseDetection.createDetector(
      1,
      0.5,
      0.5,
      0.5,
      false,
      POSE_MODEL,
      Delegate.GPU,
      RunningMode.LIVE_STREAM,
    )
      .then((handle: number) => {
        detectorHandleRef.current = handle;
        detectorHandleSV.value = handle;
        setPoseReady(true);
        setAnalysisText('Pose detector ready.');
      })
      .catch((e: Error) => {
        setAnalysisText(`Detector failed: ${e.message}`);
      });

    return () => {
      sub.remove();
      errSub.remove();
      const h = detectorHandleRef.current;
      detectorHandleRef.current = null;
      detectorHandleSV.value = -1;
      setPoseReady(false);
      if (h != null) {
        PoseDetection.releaseDetector(h).catch(() => {});
      }
    };
  }, [applyLandmarksOnJS, detectorHandleSV]);

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      const h = detectorHandleSV.value;
      if (posePlugin == null || h < 0) {
        return;
      }
      frameOrientationSV.value = frame.orientation;
      posePlugin.call(frame, {
        detectorHandle: h,
        orientation: outputOrientationSV.value,
      });
    },
    [poseReady, detectorHandleSV, frameOrientationSV, outputOrientationSV],
  );

  const onPreviewLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setPreviewSize({ width, height });
    }
  };

  if (statusText) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onPreviewLayout}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device!}
        isActive
        photo
        frameProcessor={posePlugin != null && Platform.OS === 'ios' ? frameProcessor : undefined}
        onOutputOrientationChanged={o => {
          outputOrientationSV.value = o;
        }}
      />
      <PoseOverlay
        keypoints={{
          shoulder: armKeypoints?.shoulder,
          elbow: armKeypoints?.elbow,
          wrist: armKeypoints?.wrist,
        }}
        width={previewSize.width}
        height={previewSize.height}
        isMirrored={device?.position === 'front'}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayTitle}>MediaPipe pose (native)</Text>
        {pluginError ? <Text style={styles.overlayError}>{pluginError}</Text> : null}
        <Text style={styles.overlayValue}>{analysisText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 24,
  },
  statusText: {
    marginTop: 12,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  overlayTitle: {
    color: '#9dd6ff',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  overlayValue: {
    color: '#fff',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  overlayError: {
    color: '#f87171',
    fontSize: 12,
    marginBottom: 4,
  },
});
