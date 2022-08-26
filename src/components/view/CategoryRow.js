import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import { setFontStyle } from '../../utils/utils';
import RowView from './RowView';
import StarRow from './StarRow';

const CategoryStarRow = ({
  style,
  category,
  categoryStyle,
  rating,
  ratingStyle,
  reviews,
  reviewsStyle,
  starRowStyle,
}) => (
  <RowView style={{...styles.row, ...style}}>
    {category ? (
      <Text numberOfLines={2} style={{...styles.category, ...categoryStyle}}>
        {category}
      </Text>
    ) : null}
    <StarRow
      style={starRowStyle}
      rating={rating}
      ratingStyle={ratingStyle}
      reviews={reviews}
      reviewsStyle={reviewsStyle}
    />
  </RowView>
);

const styles = StyleSheet.create({
  row: {
    backgroundColor: APP_COLORS.transparent,
  },
  category: {
    flex: 1,
    ...setFontStyle(10, '500', APP_COLORS.label),
    marginRight: 16,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
});

export default CategoryStarRow;
