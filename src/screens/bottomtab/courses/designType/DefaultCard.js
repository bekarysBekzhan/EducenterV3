import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {APP_COLORS, N_STATUS, WIDTH} from '../../../../constans/constants';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import Price from '../../../../components/Price';
import ItemRating from '../../../../components/ItemRating';
import {ROUTE_NAMES} from '../../../../components/navigation/routes';
import {useSettings} from '../../../../components/context/Provider';
import {setFontStyle} from '../../../../utils/utils';

export const DefaultCard = ({item, index, navigation}) => {
  const {nstatus} = useSettings();

  console.log('DefaultCard');

  const onCourse = () => {
    if (item?.has_subscribed) {
      navigation.navigate(ROUTE_NAMES.myCourseDetail, {courseID: item?.id});
    } else {
      navigation.navigate(ROUTE_NAMES.courseDetail, {courseID: item?.id});
    }
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={onCourse}>
      <FastImage
        source={{uri: item?.poster, priority: 'high'}}
        style={styles.poster}
      />
      <RowView style={styles.row1}>
        <Text style={styles.category}>{item?.category_name}</Text>
        {nstatus === N_STATUS ? null : (
          <Price
            price={item?.price}
            oldPrice={item?.old_price}
            priceStyle={styles.price}
            oldPriceStyle={styles.price}
          />
        )}
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

const styles = StyleSheet.create({
  courseCard: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 22,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOpacity: 0.09,
    elevation: 1,
    marginHorizontal: 13,
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
    ...setFontStyle(18, '700', APP_COLORS.font),
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
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

