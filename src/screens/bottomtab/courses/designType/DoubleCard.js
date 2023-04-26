import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import React from 'react';
import {APP_COLORS, N_STATUS, WIDTH} from '../../../../constans/constants';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import Price from '../../../../components/Price';
import ItemRating from '../../../../components/ItemRating';
import {ROUTE_NAMES} from '../../../../components/navigation/routes';
import {useSettings} from '../../../../components/context/Provider';
import {setFontStyle} from '../../../../utils/utils';
import {useLocalization} from '../../../../components/context/LocalizationProvider';
import {lang} from '../../../../localization/lang';

export const DoubleCard = ({item, index, navigation}) => {
  const {localization} = useLocalization();

  const {nstatus} = useSettings();

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
      <View style={styles.col}>
        <Text style={styles.title} numberOfLines={1}>
          {item?.title}
        </Text>

        <Text>
          {item?.lessons_count}{' '}
          {item?.lessons_count == 0
            ? lang('урок', localization)
            : item?.lessons_count > 0 && item?.lessons_count < 5
            ? lang('урока', localization)
            : lang('уроков', localization)}
        </Text>
      </View>
      {nstatus === N_STATUS ? null : (
        <View style={styles.priceContainer}>
          <Price
            price={item?.price}
            oldPrice={item?.old_price}
            priceStyle={styles.price}
            oldPriceStyle={styles.price}
          />
        </View>
      )}
      <View style={styles.rating}>
        <ItemRating
          rating={item?.rating}
          reviewCount={item?.reviews_count}
          starSize={16}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    marginLeft: 16,
    marginBottom: 10,
    width: WIDTH / 2 - 24,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: APP_COLORS.border,
  },
  title: {
    ...setFontStyle(16, '600', APP_COLORS.font),
  },
  category: {
    textTransform: 'uppercase',
    ...setFontStyle(12, '400', APP_COLORS.placeholder),
  },
  poster: {
    width: WIDTH / 2 - 24,
    height: 100,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
    left: 13,
    bottom: 16,
  },
  col: {
    paddingVertical: 10,
    marginHorizontal: 13,
    height: 64,
    justifyContent: 'space-between',
  },
  rating: {
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 6,
    position: 'absolute',
    right: 6,
    top: 10,
  },
});
