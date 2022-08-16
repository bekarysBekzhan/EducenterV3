import { StyleSheet, Text, View } from 'react-native';
import React, { useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import RowView from './RowView';
import { setFontStyle } from '../../utils/utils';
import RatingStar from '../RatingStar';
import { APP_COLORS } from '../../constans/constants';

const ReviewItem = ({
  avatar,
  name,
  date,
  rating,
  startRating,
  review,
  ...props
}) => {
  return (
    <View style={styles.item}>
      <RowView justifyContent="space-between">
        <RowView>
          <FastImage style={styles.avatar} source={{ uri: avatar }} />
          <Text style={styles.name}>{name}</Text>
        </RowView>
        <Text style={styles.date}>{date}</Text>
      </RowView>
      <RowView justifyContent="space-between" marginTop={12}>
        <View>
          <Text style={styles.rating}>Оценка</Text>
          <Text style={styles.ratingNumber}>{rating}</Text>
        </View>
        <RatingStar disabled={true} maxStars={5} rating={startRating} />
      </RowView>
      <Text style={styles.review}>{review}</Text>
    </View>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  item: {
    justifyContent: 'center',
    backgroundColor: APP_COLORS.gray,
    borderRadius: 10,
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'grey',
  },
  name: {
    marginLeft: 8,
    ...setFontStyle(15, '600', '#111621'),
  },
  date: {
    ...setFontStyle(13, '400', '#808191'),
  },
  rating: {
    ...setFontStyle(10, '500', '#808191'),
  },
  ratingNumber: {
    ...setFontStyle(13, '400', '#111621'),
  },
  review: {
    ...setFontStyle(15, '400', '#111621'),
    marginTop: 12,
  },
});
