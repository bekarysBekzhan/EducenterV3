import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import FastImage from 'react-native-fast-image';
import RowView from '../view/RowView';
import Price from '../Price';
import ItemRating from '../ItemRating';

const CalendarCourseItem = ({onPress = () => undefined}) => {
  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={onPress}>
      <FastImage source={{uri: item?.poster}} style={styles.poster} />
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

const styles = StyleSheet.create({});
