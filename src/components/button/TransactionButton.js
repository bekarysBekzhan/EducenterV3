import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import RowView from '../view/RowView';
import {ColorApp} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import Price from '../Price';

const TransactionButton = ({
  text,
  textStyle,
  price,
  priceStyle,
  oldPrice,
  oldPriceStyle,
  priceViewStyle,
  onPress = () => undefined,
  style,
}) => {
  const memoStyle = useMemo(() => [styles.button, style], [style]);
  const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);
  const memoPriceStyle = useMemo(
    () => [styles.price, priceStyle],
    [priceStyle],
  );
  const memoOldPriceStyle = useMemo(
    () => [styles.oldPrice, oldPriceStyle],
    [oldPriceStyle],
  );

  const memoPriceViewStyle = useMemo(
    () => [styles.priceView, priceViewStyle],
    [priceViewStyle],
  );

  return (
    <TouchableOpacity style={memoStyle} activeOpacity={0.9} onPress={onPress}>
      <RowView>
        <Text numberOfLines={2} style={memoTextStyle}>
          {text}
        </Text>
        <Price
          style={memoPriceViewStyle}
          price={price}
          oldPrice={oldPrice}
          priceStyle={memoPriceStyle}
          oldPriceStyle={memoOldPriceStyle}
        />
      </RowView>
    </TouchableOpacity>
  );
};

export default TransactionButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorApp.primary,
    paddingVertical: 17,
    paddingHorizontal: 16,
    maxHeight: 74,
  },
  text: {
    flex: 1,
    ...setFontStyle(17, '600', '#fff'),
  },
  priceView: {
    flexWrap:'wrap',
    flex: 2,
    justifyContent: 'flex-end',
    marginLeft: 16,
  },
  price: {
    ...setFontStyle(17, '600', '#fff'),
  },
  oldPrice: {
    ...setFontStyle(17, '400', 'rgba(255,255,255,0.6)'),
    textDecorationColor: 'rgba(255,255,255,0.6)',
  },
});
