import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import TransparentBack from '../../assets/icons/TransparentBack.svg';
import CirclesThree from '../../assets/icons/CirclesThree.svg';
import CrossOverEntry from '../../assets/icons/CrossOverEntry.png';
import DroppedElbow from '../../assets/icons/DroppedElbow.png';
import RedDrop from '../../assets/icons/RedDrop.svg';
import SwimVideoPlaceholder from '../../assets/icons/SwimVideoPlaceholder.png';
import LateCatch from '../../assets/icons/LateCatch.png';
import TransparentMenu from '../../assets/icons/TransparentMenu.svg';

export default function SwimsScreen() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardPress = (index: number) => {
    setSelectedIndex(current => (current === index ? null : index));
  };

  return (
    <View style={styles.root}>
      <View style={styles.heroSection}>
        <Image source={SwimVideoPlaceholder} style={styles.heroImage} resizeMode="contain" />
        <View style={styles.heroOverlay}>
          <View style={[styles.heroIconButton, styles.heroBackButton]}>
            <TransparentBack width={45} height={45} />
          </View>
          <Text style={styles.heroTitle}>Swims</Text>
          <View style={[styles.heroIconButton, styles.heroMenuButton]}>
            <TransparentMenu width={55} height={55} />
          </View>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <ScrollView style={styles.listSection} contentContainerStyle={styles.listContent}>
          <View style={styles.itemWrapper}>
            <Pressable onPress={() => handleCardPress(0)} style={styles.item}>
              <View style={styles.itemContent}>
                <Image source={CrossOverEntry} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemTextBlock}>
                  <Text style={styles.itemText}>Cross Over Entry</Text>
                  <View style={styles.descriptionRow}>
                    <RedDrop width={13} height={13} style={styles.descriptionIcon} />
                    <Text style={styles.itemDescription}>Hand crossing centerline</Text>
                  </View>
                </View>
              </View>
            </Pressable>
            {selectedIndex === 0 ? (
              <View style={styles.fixButton}>
                <CirclesThree width={17} height={17} />
                <Text style={styles.fixButtonText}>Fix</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.itemWrapper}>
            <Pressable onPress={() => handleCardPress(1)} style={styles.item}>
              <View style={styles.itemContent}>
                <Image source={DroppedElbow} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemTextBlock}>
                  <Text style={styles.itemText}>Dropped Elbow</Text>
                  <View style={styles.descriptionRow}>
                    <RedDrop width={13} height={13} style={styles.descriptionIcon} />
                    <Text style={styles.itemDescription}>Elbow too low in water</Text>
                  </View>
                </View>
              </View>
            </Pressable>
            {selectedIndex === 1 ? (
              <View style={styles.fixButton}>
                <CirclesThree width={17} height={17} />
                <Text style={styles.fixButtonText}>Fix</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.itemWrapper}>
            <Pressable onPress={() => handleCardPress(2)} style={styles.item}>
              <View style={styles.itemContent}>
                <Image source={LateCatch} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemTextBlock}>
                  <Text style={styles.itemText}>Late Catch</Text>
                  <View style={styles.descriptionRow}>
                    <RedDrop width={13} height={13} style={styles.descriptionIcon} />
                    <Text style={styles.itemDescription}>Catch starts too late</Text>
                  </View>
                </View>
              </View>
            </Pressable>
            {selectedIndex === 2 ? (
              <View style={styles.fixButton}>
                <CirclesThree width={17} height={17} />
                <Text style={styles.fixButtonText}>Fix</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
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
    width: '100%',
    aspectRatio: 390 / 360,
    marginTop: -15, //change to 0 later with video
    marginBottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  listSection: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 16,
    alignItems: 'center',
  },
  itemWrapper: {
    marginBottom: 12,
    width: '92%',
  },
  item: {
    height: 108,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  itemImage: {
    width: 95,
    height: 95,
    borderRadius: 13,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  itemTextBlock: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  descriptionIcon: {
    marginRight: 6,
  },
  itemDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  fixButton: {
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 36,
    marginTop: 9,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  fixButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
