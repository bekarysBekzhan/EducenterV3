import {StyleSheet, Text} from 'react-native';
import React, {useMemo} from 'react';
import RowView from './view/RowView';
import {setFontStyle} from '../utils/utils';
import {APP_COLORS} from '../constans/constants';
import { useSettings } from './context/Provider';

const Price = ({price = 0, priceStyle, oldPrice = 0, oldPriceStyle, style}) => {

  const { settings } = useSettings();

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
      <Text style={memoPriceStyle}>{price.toLocaleString("fr")} {settings?.currency_symbol}</Text>
      {oldPrice != 0 && oldPrice != null ? (
        <Text style={memoOldPriceStyle}>{oldPrice.toLocaleString('fr')} {settings?.currency_symbol}</Text>
      ) : null}
    </RowView>
  );
};

export default Price;

const styles = StyleSheet.create({
  price: {
    ...setFontStyle(17, '600', APP_COLORS.primary),
  },
  oldPrice: {
    ...setFontStyle(17, '400', '#808191'),
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: '#808191',
    marginLeft: 4,
  },
});
