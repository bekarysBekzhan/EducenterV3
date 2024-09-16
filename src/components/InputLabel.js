import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { APP_COLORS } from '../constants/constants';
import { setFontStyle } from '../utils/utils';
import Input from './Input';

const InputLabel = ({ label, style, ...props }) => {
  const memoStyle = useMemo(() => [styles.view, style], [style]);

  return (
    <View style={memoStyle}>
      <Text style={styles.label}>{label}</Text>
      <Input
        {...props}
        extraStyle={styles.inputStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    marginTop: 24,
  },
  label: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
  },
  inputStyle: {
    backgroundColor: APP_COLORS.input,
  }
});

export default InputLabel;
