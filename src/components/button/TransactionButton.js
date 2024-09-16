import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useMemo } from 'react';
import RowView from '../view/RowView';
import { APP_COLORS, WIDTH } from '../../constants/constants';
import { setFontStyle } from '../../utils/utils';
import Price from '../Price';
import { useSettings } from '../context/Provider';

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

  const { settings } = useSettings();
  const memoStyle = useMemo(() => [{ ...styles.button, backgroundColor: settings?.color_app }, style], [style]);
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

  console.log('transactionButtonText ---', text)

  return (
    <View style={[styles.mainView, { height: price ? 128 : 93 }]}>
      {
        price ?
          <Price
            style={styles.priceView}
            price={price}
            oldPrice={oldPrice}
            priceStyle={styles.priceStyle}
            oldPriceStyle={styles.oldPriceStyle}
          />
          :
          null
      }
      <TouchableOpacity 
      style={[
        styles.button, 
        {backgroundColor: text === 'Пройти тест' ? APP_COLORS.mediumgray : APP_COLORS.primary}
      ]} 
      activeOpacity={0.9} 
      onPress={onPress}
      >
        <Text 
        numberOfLines={2} 
        style={[styles.buttonText, 
        {color: text === 'Пройти тест' ? APP_COLORS.primary : APP_COLORS.white}]}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionButton;

const styles = StyleSheet.create({
  mainView: {
    width: WIDTH,
    height: 128,
    bottom: 100,

    borderTopColor: 'transparent',
    borderTopWidth: 3,
    borderRadius: 20,
    backgroundColor: APP_COLORS.white,
    elevation: 2,

    // iOS shadow properties
    shadowColor: APP_COLORS.darkblack,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 24,

    justifyContent: 'center',
    padding: 16,
  },
  button: {
    alignItems: 'center',
    height: 46,
    backgroundColor: APP_COLORS.primary,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.white),
    letterSpacing: 0.4,
    lineHeight: 14,
  },
  priceView: {
    alignItems: 'flex-end',
    paddingVertical: 4,
    marginBottom: 8,
  },
  priceStyle: {
    ...setFontStyle(20, '700', APP_COLORS.darkblack),
    textAlign: 'right',
  },
  oldPriceStyle: {
    ...setFontStyle(14, '400', APP_COLORS.placeholder),
    textDecorationColor: 'rgba(255,255,255,0.6)',
    textAlign: 'right',
  },
});
