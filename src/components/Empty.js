import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {strings} from '../localization';
import {setFontStyle} from '../utils/utils';

const Empty = ({text = strings['Нет данных'], style, textStyle}) => {
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
