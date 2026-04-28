import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import TransparentBack from '../../assets/icons/TransparentBack.svg';
import CirclesFour from '../../assets/icons/CirclesFour.svg';
import DroppedElbowCorrect from '../../assets/icons/DroppedElbowCorrect.png';
import DroppedElbow from '../../assets/icons/DroppedElbow.png';
import TransparentMenu from '../../assets/icons/TransparentMenu.svg';
import RedDrop from '../../assets/icons/RedDrop.svg';
import StarFour from '../../assets/icons/StarFour.svg';
import SwimVideoPlaceholder from '../../assets/icons/SwimVideoPlaceholder.png';

export default function ReviewScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.heroSection}>
        <Image source={SwimVideoPlaceholder} style={styles.heroImage} resizeMode="contain" />
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
          <Text style={styles.title}>Dropped Elbow</Text>

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
            <Text style={styles.descriptionText}>Your elbow drops during the pull, reducing propulsion.</Text>
            <Text style={styles.tipText}>Keep your elbow high and forearm vertical as early as possible.</Text>
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
