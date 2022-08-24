import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {APP_COLORS} from '../constans/constants';
import {setFontStyle} from '../utils/utils';
import Divider from './Divider';
import Price from './Price';
import RowView from './view/RowView';

const HistoryItem = ({title, date, price, isLast, iconType}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'kaspi':
        return (
          <FastImage
            source={require('../assets/images/Kaspi.png')}
            style={styles.img}
          />
        );

      case 'paypost':
        return (
          <FastImage
            source={require('../assets/images/Paypost.png')}
            style={styles.img}
          />
        );

      case 'walletone':
        return (
          <FastImage
            source={require('../assets/images/Walletone.png')}
            style={styles.img}
          />
        );

      case 'paybox':
        return (
          <FastImage
            source={require('../assets/images/Paybox.png')}
            style={styles.img}
          />
        );

      default:
        return null;
    }
  };

  return (
    <RowView style={isLast ? styles.rowLast : styles.row}>
      <View style={styles.col}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {date ? <Text style={styles.date}>{date}</Text> : null}
      </View>
      <RowView style={styles.priceWrap}>
        <Price price={price} />
        {renderIcon()}
      </RowView>
      <Divider style={{left: 16, height: 1}} />
    </RowView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowLast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  col: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    ...setFontStyle(15),
    marginBottom: 4,
  },
  date: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
  },
  priceWrap: {
    flexWrap: 'wrap',
  },
  img: {
    width: 20,
    height: 20,
    marginLeft: 2,
  },
});

export default memo(HistoryItem);
