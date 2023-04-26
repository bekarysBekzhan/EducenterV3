import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';
import {getVersion} from 'react-native-device-info';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const DevView = () => {
  const {localization} = useLocalization();
  return (
    <View style={styles.view}>
      <Text style={styles.text}>
        © {new Date().getFullYear()} •{' '}
        {lang('Создай свою онлайн школу вместе с Educenter', localization)}
      </Text>
      <Text style={styles.version}>
        {lang('Версия приложения', localization)}
        {getVersion()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  text: {
    textAlign: 'center',
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
  },
  version: {
    textAlign: 'center',
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
  },
});

export default DevView;
