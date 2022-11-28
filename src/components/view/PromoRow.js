import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import {checkPrice} from '../../utils/checkPrice';
import {setFontStyle} from '../../utils/utils';
import {useSettings} from '../context/Provider';
import RowView from './RowView';

const PromoRow = ({style, text, textStyle, price, priceStyle, showZero}) => {
  const {settings} = useSettings();

  return (
    <RowView style={{...styles.row, ...style}}>
      <Text style={{...styles.label, ...textStyle}}>{text}</Text>
      <Text style={{...styles.price, ...priceStyle}}>
        {checkPrice(price, showZero, settings?.currency_symbol)}
      </Text>
    </RowView>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: 8,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  label: {
    ...setFontStyle(16, '400', APP_COLORS.label),
    marginRight: 16,
  },
  price: {
    ...setFontStyle(),
  },
});

export default PromoRow;
