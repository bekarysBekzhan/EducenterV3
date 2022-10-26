import React, {memo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {APP_COLORS} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import Price from '../Price';
import CategoryStarRow from '../view/CategoryRow';
import RowView from '../view/RowView';

const SearchItem = ({
  styleView,
  styleRow,
  poster,
  posterStyle,
  categoryStarRowProps,
  title,
  titleStyle,
  price,
  old_price,
  onPress,
}) => {
  const [loading, setLoading] = useState(null);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={{...styles.view, ...styleView}}>
        <RowView style={{...styles.row, ...styleRow}}>
          <FastImage
            source={{
              uri: poster,
              priority: 'high',
            }}
            style={{...styles.poster, ...posterStyle}}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => setLoading(false)}>
            {loading && (
              <ActivityIndicator size="small" color={APP_COLORS.primary} />
            )}
          </FastImage>

          <View style={styles.col}>
            <CategoryStarRow {...categoryStarRowProps} />
            {title ? (
              <Text style={{...styles.title, ...titleStyle}}>{title}</Text>
            ) : null}
            <Price price={price} old_price={old_price} />
          </View>
        </RowView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  view: {
    marginBottom: 18,
  },
  row: {},
  poster: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    ...setFontStyle(15, '600'),
    marginBottom: 4,
  },
});

export default memo(SearchItem);
