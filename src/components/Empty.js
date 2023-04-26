import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {setFontStyle} from '../utils/utils';
import {useLocalization} from './context/LocalizationProvider';
import {lang} from '../localization/lang';

const Empty = ({text, style, textStyle}) => {
  const {localization} = useLocalization();

  text = text || lang('Нет данных', localization);

  const memoStyle = useMemo(() => [styles.view, style], [style]);
  const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);
  return (
    <View style={memoStyle}>
      <Text style={memoTextStyle}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 16,
  },
  text: {
    ...setFontStyle(),
    textAlign: 'center',
  },
});

export default Empty;
