import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TransparentBack from '../../assets/icons/TransparentBack.svg';
import CirclesFour from '../../assets/icons/CirclesFour.svg';
import TransparentMenu from '../../assets/icons/TransparentMenu.svg';
import GhostOverlay from '../components/GhostOverlay';
import { RootStackParamList } from '../../App';

type ErrorType = 'none' | 'dropped_elbow' | 'late_catch';

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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { analysis } = route.params as RootStackParamList['Review'];
  const content = getErrorContent(analysis.errorType);
  const imageSource = analysis.frame;
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
        <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
        {heroWidth > 0 && heroHeight > 0 ? (
          <Animated.View key="ghost" style={[styles.ghostOverlayContainer, { opacity }]}>
            <GhostOverlay keypoints={analysis.keypoints} errorType={analysis.errorType} width={heroWidth} height={heroHeight} />
          </Animated.View>
        ) : null}
        <View style={styles.heroOverlay}>
          <Pressable
            style={[styles.heroIconButton, styles.heroBackButton]}
            onPress={() => navigation.goBack()}>
            <TransparentBack width={45} height={45} />
          </Pressable>
          <Text style={styles.heroTitle}>Fix</Text>
          <View style={[styles.heroIconButton, styles.heroMenuButton]}>
            <TransparentMenu width={55} height={55} />
          </View>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>{content?.title}</Text>
        <Text style={styles.descriptionText}>{content?.description}</Text>
        <Text style={styles.tipText}>{content?.tip}</Text>

        <Pressable
          style={styles.tryAgainButton}
          onPress={() => navigation.goBack()}>
          <CirclesFour width={17} height={17} />
          <Text style={styles.tryAgainButtonText}>Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F6F7F9',
  },
  heroSection: {
    width: '100%',
    aspectRatio: 390 / 360,
    marginTop: 0,
    marginBottom: 0,
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
  bottomSheet: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#2F2F2F',
    marginTop: 10,
  },
  tryAgainButton: {
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 36,
    marginTop: 9,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tryAgainButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
