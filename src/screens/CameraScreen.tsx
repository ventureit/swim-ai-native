import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

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

/** Figma: iPhone 13 & 14 - 1 (`1:2`), design size 390×844 */
const DESIGN_W = 390;
const DESIGN_H = 844;

const ASSETS = {
  union: 'https://www.figma.com/api/mcp/asset/ed84a5ba-4548-4127-9e74-61424f5769a5',
  union1: 'https://www.figma.com/api/mcp/asset/ab10f603-2211-4e16-8dc4-cde42d9e844e',
  intersect: 'https://www.figma.com/api/mcp/asset/5d2596d9-ed39-4809-a329-8ed9cd7fe5ca',
  images: 'https://www.figma.com/api/mcp/asset/1a8065c7-609f-4cfb-a5e6-96fead8d5211',
  vectorSwim: 'https://www.figma.com/api/mcp/asset/8012f6a4-3bbe-4d42-abdf-322d97511dae',
  dotsThreeCircle: 'https://www.figma.com/api/mcp/asset/223d0e1b-a7be-41f2-b53d-f4c10be01738',
  vectorBack: 'https://www.figma.com/api/mcp/asset/a24adbd8-363a-4a54-8bba-0ab84d14096c',
  subtract: 'https://www.figma.com/api/mcp/asset/76c636a6-c1c0-4910-ba98-e52fa79f4594',
} as const;

export default function CameraScreen() {
  const { width: screenW, height: screenH } = useMemo(() => Dimensions.get('window'), []);
  const sx = screenW / DESIGN_W;
  const sy = screenH / DESIGN_H;

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

  const bracketW = 300 * sx;
  const bracketH = 420 * sx;

  const bottomSectionH = (DESIGN_H - 542) * sy;
  const tilesBottomInset = (DESIGN_H - 717 - 85) * sy;

  return (
    <View style={styles.root}>
      <View style={[styles.headerRow, { paddingTop: 30 * sy, paddingHorizontal: 14 * sx }]}>
        <View style={[styles.headerIconSlot, { width: 55 * sx, height: 55 * sy }]}>
          <Image source={{ uri: ASSETS.vectorBack }} style={styles.headerIconFill} resizeMode="contain" />
        </View>
        <View style={[styles.headerIconSlot, { width: 55 * sx, height: 55 * sy }]}>
          <Image source={{ uri: ASSETS.dotsThreeCircle }} style={styles.headerIconFill} resizeMode="contain" />
        </View>
      </View>

      <View style={[styles.cameraBlock, { paddingTop: Math.max(0, (104 - 30 - 55) * sy) }]}>
        <View style={[styles.bracketWrap, { width: bracketW, height: bracketH }]}>
          <Image source={{ uri: ASSETS.subtract }} style={styles.bracketImage} resizeMode="contain" />
          <View style={styles.feedbackOverlay} pointerEvents="none">
            {activeState.feedback ? <Text style={styles.feedbackText}>{activeState.feedback}</Text> : null}
            <Text style={[styles.phaseText, !activeState.feedback && styles.phaseTextOnly]}>{activeState.phase}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.bottomStack, { height: bottomSectionH, flexShrink: 0 }]}>
        <View style={styles.wavesLayer}>
          <Image
            source={{ uri: ASSETS.union1 }}
            style={[styles.waveImg, { top: 0, left: -38 * sx, width: 439.255 * sx, height: 116.638 * sy }]}
            resizeMode="stretch"
          />
          <Image
            source={{ uri: ASSETS.intersect }}
            style={[styles.waveImg, { top: (548 - 542) * sy, left: -43 * sx, width: 439.255 * sx, height: 111.089 * sy }]}
            resizeMode="stretch"
          />
          <Image
            source={{ uri: ASSETS.union }}
            style={[styles.waveImg, { top: (627 - 542) * sy, left: 0, width: DESIGN_W * sx, height: 342 * sy }]}
            resizeMode="stretch"
          />
          <Image
            source={{ uri: ASSETS.union }}
            style={[styles.waveImg, { top: (695 - 542) * sy, left: 0, width: DESIGN_W * sx, height: 342 * sy }]}
            resizeMode="stretch"
          />
        </View>

        <View style={[styles.tilesRow, { paddingHorizontal: 30 * sx, bottom: tilesBottomInset }]}>
          <View style={[styles.tile, { width: 113 * sx, height: 85 * sy, borderRadius: 16 * sx }]}>
            <Image source={{ uri: ASSETS.vectorSwim }} style={[styles.tileIcon, { width: 40 * sx, height: 37 * sy }]} resizeMode="contain" />
            <Text style={[styles.tileLabel, styles.tileLabelSwims]}>Swims</Text>
          </View>
          <View style={[styles.tile, { width: 113 * sx, height: 85 * sy, borderRadius: 16 * sx }]}>
            <Image source={{ uri: ASSETS.images }} style={[styles.tileIcon, { width: 40 * sx, height: 40 * sy }]} resizeMode="contain" />
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
    width: '100%',
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconFill: {
    width: '100%',
    height: '100%',
  },
  cameraBlock: {
    flex: 1,
    alignItems: 'center',
  },
  bracketWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracketImage: {
    width: '100%',
    height: '100%',
  },
  feedbackOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  feedbackText: {
    color: '#0f172a',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
  },
  phaseText: {
    color: 'rgba(15, 23, 42, 0.45)',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  phaseTextOnly: {
    fontSize: 16,
    lineHeight: 20,
    color: 'rgba(15, 23, 42, 0.55)',
  },
  bottomStack: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  wavesLayer: {
    ...StyleSheet.absoluteFill,
  },
  waveImg: {
    position: 'absolute',
  },
  tilesRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tile: {
    backgroundColor: '#f8fafc',
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 9,
  },
  tileIcon: {
    marginBottom: 4,
  },
  tileLabel: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '400',
  },
  tileLabelSwims: {
    color: '#0f172a',
  },
});
