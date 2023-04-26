import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import {setFontStyle} from '../../../../utils/utils';
import {ROUTE_NAMES} from '../../../../components/navigation/routes';
import {APP_COLORS, WIDTH} from '../../../../constans/constants';
import ItemRating from '../../../../components/ItemRating';

export const MyCourseMiniCard = ({item, index, navigation}) => {
  console.log(item);

  const onPressCourse = () => {
    navigation.navigate(ROUTE_NAMES.myCourseDetail, {courseID: item?.id});
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={onPressCourse}>
      <RowView style={styles.row}>
        <FastImage
          source={{uri: item?.poster, priority: 'high'}}
          style={styles.poster}
        />
        <View style={styles.col}>
          <Text style={styles.title} numberOfLines={1}>
            {item?.title}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {item.category_name}
          </Text>
          <ItemRating
            rating={item?.rating}
            reviewCount={item?.reviews_count}
            starSize={16}
          />
        </View>
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    marginHorizontal: 13,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOpacity: 0.09,
    elevation: 1,
  },
  title: {
    ...setFontStyle(16, '600', APP_COLORS.font),
  },
  category: {
    textTransform: 'uppercase',
    ...setFontStyle(12, '400', APP_COLORS.placeholder),
  },
  poster: {
    width: 86,
    height: 86,
    borderRadius: 10,
  },
  price: {
    fontSize: 14,
  },
  col: {
    height: 72,
    flexDirection: 'column',
    marginHorizontal: 12,
    justifyContent: 'space-between',
    width: WIDTH - 158, //24+16+86+32
  },
  row: {
    marginLeft: 16,
  },
  priceContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
