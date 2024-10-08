import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { APP_COLORS } from '../../constants/constants';
import { setFontStyle } from '../../utils/utils';
import Price from '../Price';
import RowView from '../view/RowView';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import { useSettings } from '../context/Provider';

const JournalItem = ({
  item,
  source,
  title,
  number,
  year,
  price,
  old_price,
  has_subscribed,
  onPress,
  showPrice = true,
  hasFile = false,
  style,
}) => {
  const handlerPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const { localization } = useLocalization();
  const { settings } = useSettings();

  return (
    <TouchableOpacity onPress={handlerPress} activeOpacity={0.9} style={style}>
      <RowView style={styles.row}>
        <FastImage
          source={{ uri: source, priority: 'high' }}
          style={styles.poster}
        />
        <View style={styles.col}>
          {title ? (
            <Text numberOfLines={3} style={styles.title}>
              {title}
            </Text>
          ) : null}
          {number || year ? (
            <Text numberOfLines={1} style={styles.year}>
              № {number} • {year} {lang('год', localization)}
            </Text>
          ) : null}
          {showPrice && <Price price={price} old_price={old_price} />}
          {hasFile ? (
            <Text style={[styles.subscribe, { color: settings?.color_app }]}>
              {lang('Читать журнал', localization)}
            </Text>
          ) : (
            <Text style={[styles.subscribe, { color: settings?.color_app }]}>
              {has_subscribed
                ? lang('Вы подписаны', localization)
                : lang('Подписаться', localization)}
            </Text>
          )}
        </View>
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: APP_COLORS.border,
    marginBottom: 16,
  },
  poster: {
    width: 122,
    height: 160,
    borderRadius: 4,
    backgroundColor: APP_COLORS.white,
    alignSelf: 'flex-start',
  },
  col: {
    height: '100%',
    flex: 1,
    marginLeft: 12,
  },
  title: {
    ...setFontStyle(17, '600'),
    marginBottom: 4,
  },
  year: {
    ...setFontStyle(13, '400', APP_COLORS.label),
    marginBottom: 16,
  },
  subscribe: {
    ...setFontStyle(13, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
    position: 'absolute',
    bottom: 0,
  },
});

export default memo(JournalItem);
