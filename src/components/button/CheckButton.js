import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import RowView from '../view/RowView';
import {check, x} from '../../assets/icons';
import { useSettings } from '../context/Provider';

const CheckButton = ({checked = false, onPress, text, textStyle, style}) => {

  const { settings } = useSettings();

  return (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={onPress}
    style={{
      ...style,
      ...styles.button,
      borderColor: checked ? settings?.color_app : APP_COLORS.border,
    }}>
    <RowView style={styles.row}>
      {checked ? check(1, APP_COLORS.primary) : null}
      <Text style={{...styles.textStyle, ...textStyle}}>{text}</Text>
    </RowView>
  </TouchableOpacity>
);
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    marginVertical: 16,
    backgroundColor: APP_COLORS.white,
  },
  row: {
    backgroundColor: APP_COLORS.white,
  },
  textStyle: {
    ...setFontStyle(17, '600', APP_COLORS.label),
    textAlign: 'center',
    flex: 1,
  },
});

export default CheckButton;
