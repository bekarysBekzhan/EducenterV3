import {StyleSheet, Text} from 'react-native';
import React, {useMemo} from 'react';
import RowView from './view/RowView';
import {setFontStyle} from '../utils/utils';
import {ColorApp} from '../constans/ColorApp';

const Price = ({price = 0, priceStyle, oldPrice = 0, oldPriceStyle, style}) => {
  const memoPriceStyle = useMemo(
    () => [styles.price, priceStyle],
    [priceStyle],
  );

  const memoOldPriceStyle = useMemo(
    () => [styles.oldPrice, oldPriceStyle],
    [oldPriceStyle],
  );

  return (
    <RowView style={style}>
      <Text style={memoPriceStyle}>{price}</Text>
      <Text style={memoOldPriceStyle}>{oldPrice}</Text>
    </RowView>
  );
};

export default Price;

const styles = StyleSheet.create({
  price: {
    ...setFontStyle(17, '600', ColorApp.primary),
  },
  oldPrice: {
    ...setFontStyle(17, '400', '#808191'),
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#808191',
    marginLeft: 4,
  },
});
