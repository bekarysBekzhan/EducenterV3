import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const SimpleButton = ({
  onPress = null,
  loading = false,
  style,
  text,
  textStyle,
}) => {
  const memoStyle = useMemo(() => [styles.button, style], [style]);
  const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);

  return (
    <TouchableOpacity
      style={memoStyle}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={loading}>
      <Text style={memoTextStyle}>{text}</Text>
    </TouchableOpacity>
  );
};

export default SimpleButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '',
  },
  text: {},
});
