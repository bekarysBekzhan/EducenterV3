import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import RowView from '../view/RowView';
import { TimeIcon } from '../../assets/icons';
import Price from '../Price';
import TextButton from '../button/TextButton';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS, N_STATUS } from '../../constants/constants';
import { useSettings } from '../context/Provider';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import FastImage from 'react-native-fast-image';
import { WIDTH } from '../../constants/constants';
import { HEIGHT } from '../../constants/constants';

const ModuleTestItem = ({
  categoryName,
  author,
  poster,
  type = 'test',
  time,
  title,
  attempts,
  price,
  oldPrice,
  hasSubscribed = false,
  onPress = () => undefined,
}) => {
  const { localization } = useLocalization();
  const { nstatus, settings } = useSettings();

  const getText = () => {
    if (nstatus === N_STATUS) {
      return lang('Пройти тест', localization);
    }

    const buyText = {
      test: lang('Купить тест', localization),
      task: lang('Купить задание', localization),
    };
    
    const doText = {
      test: lang('Пройти тест', localization),
      task: lang('Пройти задание', localization),
    };

    if (hasSubscribed) {
      return doText[type];
    }
    if (price) {
      return buyText[type];
    }
    return lang('Бесплатно', localization);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}>
      <RowView style={styles.row1}>
        <FastImage
          source={{ uri: poster, priority: 'high' }}
          style={styles.poster}
        />
        <View style={styles.infoContainer}>
          <Text style={[styles.category, {color: settings?.color_app}]}>{categoryName}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text>{author?.name}</Text>
        </View>
      </RowView>
      <View style={styles.row2}>
        {price === 0 || hasSubscribed ? (
          <View />
        ) : (
          <Price price={price ? price : 0} oldPrice={oldPrice ? oldPrice : 0} />
        )}
        <TextButton
          text={getText()}
          onPress={onPress}
          style={[styles.button, {backgroundColor: hasSubscribed ? APP_COLORS.mediumgray : settings?.color_app}]}
          textStyle={[styles.buttonText, {color: hasSubscribed ? settings?.color_app : APP_COLORS.white}]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,

    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000153',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 46,
    elevation: 5,
  },
  poster: {
    width: WIDTH / 4,
    height: HEIGHT / 13.6,
    gap: 0,
    borderRadius: 8,
    marginRight: 12,
  },
  taskPhoto: {
    width: 97,
    height: 61,
    gap: 0,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: APP_COLORS.border,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  row1: {
    paddingBottom: 16,
    paddingTop: 4,
  },
  category: {
    ...setFontStyle(11, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
  time: {
    ...setFontStyle(10, '600', APP_COLORS.placeholder),
    marginLeft: 4,
  },
  title: {
    ...setFontStyle(17, '600'),
    marginVertical: 5,
    flexWrap: 'wrap',
  },
  attempts: {
    ...setFontStyle(14, '400', APP_COLORS.placeholder),
  },
  row2: {
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 8,
    height: 46,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 24,
    backgroundColor: APP_COLORS.primary,
    marginBottom: 4,
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.white),
    lineHeight: 14,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});

export default ModuleTestItem;

