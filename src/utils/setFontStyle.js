import {StyleSheet} from 'react-native';
import { ColorApp } from '../constans/constants';

export const setFontStyle = (
  fontSize = 16,
  fontWeight = '400',
  color = ColorApp.font,
  lineHeight = fontSize + 3,
) => {
  const styles = StyleSheet.create({
    font: {
      fontSize,
      fontWeight,
      color,
      lineHeight,
    },
  });

  return styles.font;
};
