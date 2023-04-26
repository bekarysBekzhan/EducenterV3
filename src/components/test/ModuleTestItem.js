import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import RowView from '../view/RowView';
import {TimeIcon} from '../../assets/icons';
import Price from '../Price';
import TextButton from '../button/TextButton';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS, N_STATUS} from '../../constans/constants';
import {useSettings} from '../context/Provider';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const ModuleTestItem = ({
  categoryName,
  type = 'test',
  time,
  title,
  attempts,
  price,
  oldPrice,
  hasSubscribed = false,
  onPress = () => undefined,
}) => {
  const {localization} = useLocalization();
  const {nstatus} = useSettings();

  const getText = () => {
    if (nstatus === N_STATUS) {
      return lang('Пройти', localization);
    }

    const buyText = {
      test: lang('Купить тест', localization),
      task: lang('Купить задание', localization),
    };
    if (hasSubscribed) {
      return lang('Пройти', localization);
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
        <Text style={styles.category}>{categoryName}</Text>
        <RowView>
          <TimeIcon color={APP_COLORS.placeholder} size={16} />
          <Text style={styles.time}>
            {time ? time : 30} {lang('мин', localization)}
          </Text>
        </RowView>
      </RowView>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.attempts}>
        {attempts ? attempts : 0} {lang('попыток', localization)}
      </Text>
      <RowView style={styles.row2}>
        {price === 0 || hasSubscribed ? (
          <View />
        ) : (
          <Price price={price ? price : 0} oldPrice={oldPrice ? oldPrice : 0} />
        )}
        <TextButton
          text={getText()}
          onPress={onPress}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 0.45,
    borderColor: APP_COLORS.border,
  },
  row1: {
    justifyContent: 'space-between',
  },
  category: {
    ...setFontStyle(11, '600', APP_COLORS.placeholder),
    textTransform: 'uppercase',
  },
  time: {
    ...setFontStyle(10, '600', APP_COLORS.placeholder),
    marginLeft: 4,
  },
  title: {
    ...setFontStyle(17, '600'),
    marginVertical: 5,
  },
  attempts: {
    ...setFontStyle(12, '500', APP_COLORS.placeholder),
  },
  row2: {
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 5,
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
});

export default ModuleTestItem;
