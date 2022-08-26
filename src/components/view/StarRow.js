import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';
import {starIcon} from '../../assets/icons';
import RowView from './RowView';

const StarRow = ({style, rating, ratingStyle, reviews, reviewsStyle}) => (
  <RowView style={{...styles.row, ...style}}>
    {starIcon(16)}
    <Text style={{...styles.ratingStyle, ...ratingStyle}}>{rating}</Text>
    <Text style={{...styles.reviewsStyle, ...reviewsStyle}}>({reviews})</Text>
  </RowView>
);

const styles = StyleSheet.create({
  row: {
    backgroundColor: APP_COLORS.transparent,
  },
  ratingStyle: {
    ...setFontStyle(10, '500'),
    marginHorizontal: 2,
  },
  reviewsStyle: {
    ...setFontStyle(10),
    opacity: 0.8,
  },
});

export default StarRow;
