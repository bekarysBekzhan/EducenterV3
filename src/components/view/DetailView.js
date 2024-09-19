import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS, HEIGHT, WIDTH } from '../../constants/constants';
import FastImage from 'react-native-fast-image';
import { useState } from 'react';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import { useSettings } from '../context/Provider';

const DetailView = ({
  poster,
  category,
  title,
  duration,
  description,
  rating,
  reviewCount,
}) => {
  const { localization } = useLocalization();

  const [isDescriptionMore, setDescriptionMore] = useState(false);
  const { settings } = useSettings();

  return (
    <View style={styles.container}>
      {poster ? (
        <FastImage
          source={{ uri: poster, priority: 'high' }}
          style={styles.poster}
        />
      ) : (
        <View style={[styles.emptyPoster, { backgroundColor: settings?.color_app }]} />
      )}
      <View style={styles.mainView}>
        {category ? <Text style={[styles.category, { color: settings?.color_app }]}>{category}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center'
  },
  category: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    letterSpacing: 0.4,
    textAlign: 'left',
  },
  title: {
    ...setFontStyle(20, '600', APP_COLORS.black),
    marginVertical: 8,
    letterSpacing: 0.4,
    textAlign: 'left',
  },
  counts: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: HEIGHT / 4.15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    padding: 16,

    shadowOpacity: 0.1,
    shadowRadius: 92,
    shadowColor: '#000153',
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,

    marginBottom: 16,
  },
  emptyPoster: {
    width: '100%',
    height: HEIGHT / 4.15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    backgroundColor: APP_COLORS.primary,
    padding: 16,

    shadowOpacity: 0.1,
    shadowRadius: 92,
    shadowColor: '#000153',
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  mainView: {
    width: '100%',
    height: 79,
    borderRadius: 16,
    backgroundColor: APP_COLORS.white,
    padding: 16,

    shadowOpacity: 0.1,
    shadowRadius: 92,
    shadowColor: '#000153',
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  time: {
    marginHorizontal: 4,
    ...setFontStyle(15, '400', APP_COLORS.primary),
  },
  descriptionViewHidden: {
    overflow: 'hidden',
    maxHeight: 120,
  },
  descriptionViewShow: {
    overflow: 'hidden',
    maxHeight: null,
  },
  moreButton: {
    alignSelf: 'flex-start',
  },
  moreButtonText: {
    ...setFontStyle(15, '500', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
});

export default DetailView;
