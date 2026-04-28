import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TransparentBack from '../../assets/icons/TransparentBack.svg';
import CameraRectangleIcon from '../../assets/icons/CameraRectangleIcon.svg';
import ImagesIcon from '../../assets/icons/ImagesIcon.svg';
import TransparentMenu from '../../assets/icons/TransparentMenu.svg';
import SwimIcon from '../../assets/icons/SwimIcon.svg';
import WaveGroupIcon from '../components/WaveGroupIcon';

type FeedbackPhaseState = {
  feedback: string | null;
  phase: string;
};

const DEMO_STATES: FeedbackPhaseState[] = [
  { feedback: 'Good Catch', phase: 'Catch' },
  { feedback: 'Dropped Elbow', phase: 'Catch' },
  { feedback: null, phase: 'Recovery' },
];

function isJestRuntime(): boolean {
  const proc = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.NODE_ENV === 'test';
}

export default function CameraScreen() {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    if (isJestRuntime()) {
      return;
    }

    const intervalId = setInterval(() => {
      setStateIndex(previous => (previous + 1) % DEMO_STATES.length);
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const activeState = DEMO_STATES[stateIndex];
  const hasFeedback = Boolean(activeState.feedback);

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <View style={styles.headerIconSlot}>
          <View style={styles.iconButton}>
            <TransparentBack width={45} height={45} />
          </View>
        </View>
        <View style={styles.headerIconSlot}>
          <View style={styles.iconButton}>
            <TransparentMenu width={55} height={55} />
          </View>
        </View>
      </View>

      <View style={styles.cameraArea}>
        {/* <View style={styles.cameraFramePlaceholder}> */}
        <View style={styles.cameraBracketWrap} pointerEvents="none">
          <CameraRectangleIcon width="100%" height="100%" />
        </View>
        <View style={[styles.feedbackOverlay, !hasFeedback && styles.feedbackOverlayPhaseOnly]} pointerEvents="none">
          {hasFeedback ? <Text style={styles.feedbackText}>{activeState.feedback}</Text> : null}
          <Text style={[styles.phaseText, !hasFeedback && styles.phaseTextOnly]}>{activeState.phase}</Text>
        </View>
        {/* </View> */}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.bottomWaveLayer} pointerEvents="none">
          <WaveGroupIcon width="100%" height="100%" />
        </View>
        <View style={styles.tilesRow}>
          <View style={styles.tile}>
            <View style={styles.tileIconWrap}>
              <SwimIcon width={40} height={37} />
            </View>
            <Text style={[styles.tileLabel, styles.tileLabelSwims]}>Swims</Text>
          </View>
          <View style={styles.tile}>
            <View style={styles.tileIconWrap}>
              <ImagesIcon width={40} height={40} />
            </View>
            <Text style={styles.tileLabel}>Videos</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerIconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  iconButton: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraArea: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  cameraFramePlaceholder: {
    width: '100%',
    maxWidth: 296,
    aspectRatio: 5 / 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  cameraBracketWrap: {
    ...StyleSheet.absoluteFill,
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  feedbackOverlayPhaseOnly: {
    gap: 0,
    paddingTop: 8,
  },
  feedbackText: {
    color: '#0b1220',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  phaseText: {
    color: 'rgba(15, 23, 42, 0.4)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '300',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  phaseTextOnly: {
    fontSize: 18,
    lineHeight: 24,
    color: 'rgba(15, 23, 42, 0.5)',
    fontWeight: '400',
  },
  bottomSection: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  bottomWaveLayer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tilesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  tile: {
    width: 120,
    height: 80,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tileIconWrap: {
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#0f172a',
    fontWeight: '500',
    textAlign: 'center',
  },
  tileLabelSwims: {
    color: '#0f172a',
  },
});
