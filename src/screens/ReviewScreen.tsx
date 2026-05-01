import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import TransparentBack from '../../assets/icons/TransparentBack.svg';
import CirclesFour from '../../assets/icons/CirclesFour.svg';
import DroppedElbowCorrect from '../../assets/icons/DroppedElbowCorrect.png';
import DroppedElbow from '../../assets/icons/DroppedElbow.png';
import TransparentMenu from '../../assets/icons/TransparentMenu.svg';
import RedDrop from '../../assets/icons/RedDrop.svg';
import StarFour from '../../assets/icons/StarFour.svg';
import SwimVideoPlaceholder from '../../assets/icons/SwimVideoPlaceholder.png';
import GhostOverlay from '../components/GhostOverlay';

type Point = { x: number; y: number };
type Keypoints = {
  shoulder: Point;
  elbow: Point;
  wrist: Point;
};

type ErrorType = 'none' | 'dropped_elbow' | 'late_catch';

function getElbowAngle(shoulder: Point, elbow: Point, wrist: Point): number {
  const v1x = shoulder.x - elbow.x;
  const v1y = shoulder.y - elbow.y;

  const v2x = wrist.x - elbow.x;
  const v2y = wrist.y - elbow.y;

  const dot = v1x * v2x + v1y * v2y;

  const mag1 = Math.hypot(v1x, v1y);
  const mag2 = Math.hypot(v2x, v2y);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));

  return Math.acos(cos) * (180 / Math.PI);
}

function detectError(keypoints: Keypoints): ErrorType {
  const { shoulder, elbow, wrist } = keypoints;
  const angle = getElbowAngle(shoulder, elbow, wrist);
  const wristBelowShoulder = wrist.y > shoulder.y;
  const enteringCatchPhase = wristBelowShoulder;
  const isLateCatch = enteringCatchPhase && angle > 150;

  const idealElbowY = shoulder.y + (wrist.y - shoulder.y) * 0.25;
  const elbowTooLow = elbow.y > idealElbowY;
  const forearmNotVertical = Math.abs(wrist.x - elbow.x) > 20;
  const wristTooHigh = wrist.y < elbow.y;

  const isDroppedElbow = elbowTooLow || forearmNotVertical || wristTooHigh;

  if (isLateCatch) return 'late_catch';
  if (isDroppedElbow) return 'dropped_elbow';

  return 'none';
}

function getErrorContent(errorType: ErrorType) {
  switch (errorType) {
    case 'late_catch':
      return {
        title: 'Late Catch',
        description: 'You start pulling too late, reducing efficiency.',
        tip: 'Start bending your elbow earlier and anchor the water sooner.',
      };
    case 'dropped_elbow':
      return {
        title: 'Dropped Elbow',
        description: 'Your elbow drops during the pull, reducing propulsion.',
        tip: 'Keep your elbow high and forearm vertical as early as possible.',
      };
    default:
      return null;
  }
}

export default function ReviewScreen() {
  const mockKeypoints: Keypoints = {
    shoulder: { x: 220, y: 215 },
    elbow: { x: 255, y: 250 },
    wrist: { x: 305, y: 300 },
  };
  const errorType = detectError(mockKeypoints);
  const content = getErrorContent(errorType);
  const [heroSize, setHeroSize] = useState({ width: 0, height: 0 });
  const opacity = useRef(new Animated.Value(0)).current;
  const heroWidth = heroSize.width;
  const heroHeight = heroSize.height;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.4,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleHeroLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setHeroSize({ width, height });
  };

  return (
    <View style={styles.root}>
      <View style={styles.heroSection} onLayout={handleHeroLayout}>
        <Image source={SwimVideoPlaceholder} style={styles.heroImage} resizeMode="cover" />
        {errorType !== 'none' && heroWidth > 0 && heroHeight > 0 ? (
          <Animated.View key="ghost" style={[styles.ghostOverlayContainer, { opacity }]}>
            <GhostOverlay keypoints={mockKeypoints} errorType={errorType} width={heroWidth} height={heroHeight} />
          </Animated.View>
        ) : null}
        <View style={styles.heroOverlay}>
          <View style={[styles.heroIconButton, styles.heroBackButton]}>
            <TransparentBack width={45} height={45} />
          </View>
          <Text style={styles.heroTitle}>Fix</Text>
          <View style={[styles.heroIconButton, styles.heroMenuButton]}>
            <TransparentMenu width={55} height={55} />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>{content?.title}</Text>

          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Image source={DroppedElbow} style={styles.compareImage} resizeMode="contain" />
              <View style={styles.labelRow}>
                <RedDrop width={15} height={15} style={styles.labelIcon} />
                <Text style={styles.wrongLabel}>WRONG</Text>
              </View>
            </View>

            <View style={[styles.comparisonItem, styles.comparisonItemCorrect]}>
              <Image source={DroppedElbowCorrect} style={styles.compareImage} resizeMode="contain" />
              <View style={styles.labelRow}>
                <StarFour width={15} height={15} style={styles.labelIcon} />
                <Text style={styles.correctLabel}>CORRECT</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>{content?.description}</Text>
            <Text style={styles.tipText}>{content?.tip}</Text>
          </View>

          <View style={styles.button}>
            <CirclesFour width={17} height={17} />
            <Text style={styles.buttonText}>Try again</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    marginHorizontal: 0,
    marginTop: -15,
    marginBottom: 10,
    width: '100%',
    aspectRatio: 390 / 360,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
  },
  ghostOverlayContainer: {
    ...StyleSheet.absoluteFill,
  },
  heroIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 40,
  },
  heroBackButton: {
    left: 16,
  },
  heroMenuButton: {
    right: 16,
  },
  heroTitle: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.3,
    color: '#ffffff',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -40,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  content: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  comparisonItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
  },
  comparisonItemCorrect: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    shadowOpacity: 0.03,
    elevation: 2,
  },
  compareImage: {
    width: 126,
    height: 126,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 6,
  },
  labelIcon: {
    marginRight: 6,
  },
  wrongLabel: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  correctLabel: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  descriptionSection: {
    marginTop: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
  },
  tipText: {
    fontSize: 14,
    marginTop: 6,
    color: '#64748b',
  },
  button: {
    alignSelf: 'center',
    marginTop: 15,
    backgroundColor: '#000000',
    borderRadius: 999,
    minHeight: 44,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
