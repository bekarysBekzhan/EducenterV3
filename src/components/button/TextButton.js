import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {setFontStyle} from '../../utils/utils';

const TextButton = ({onPress, style, text, textStyle, ...props}) => {
  const memoStyle = useMemo(() => [styles.button, style], [style]);
  const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={memoStyle}
      {...props}>
      <Text style={memoTextStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 22,
    paddingVertical: 8,
  },
  text: {
    ...setFontStyle(17),
    textAlign: 'center',
  },
});

export default TextButton;
