import {StyleSheet, Text,TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import RowView from '../view/RowView';
import Price from '../Price';
import ItemRating from '../ItemRating';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';

const CalendarCourseItem = ({item = {}, onPress = () => undefined}) => {
  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={onPress}>
      <FastImage
        source={{uri: item?.poster, priority: 'high'}}
        style={styles.poster}
      />
      <RowView style={styles.row1}>
        <Text style={styles.category}>{item?.category_name}</Text>
        <Price
          price={item?.price}
          oldPrice={item?.old_price}
          priceStyle={styles.price}
          oldPriceStyle={styles.price}
        />
      </RowView>
      <Text style={styles.title} numberOfLines={2}>
        {item?.title}
      </Text>
      <RowView style={styles.row2}>
        <Text>{item?.name}</Text>
        <ItemRating
          rating={item?.rating}
          reviewCount={item?.reviews_count}
          starSize={16}
        />
      </RowView>
    </TouchableOpacity>
  );
};

export default CalendarCourseItem;

const styles = StyleSheet.create({
  courseCard: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOpacity: 0.09,
    elevation: 1,
  },
  row1: {
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 0,
  },
  row2: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  title: {
    margin: 10,
    ...setFontStyle(18, '700'),
  },
  category: {
    textTransform: 'uppercase',
    ...setFontStyle(14, '700', APP_COLORS.placeholder),
  },
  poster: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  price: {
    fontSize: 14,
  },
});
