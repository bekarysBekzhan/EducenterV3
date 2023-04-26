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

export const MiniCard = ({item, index, navigation}) => {
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
            {item?.lessons_count}{' '}
            {item?.lessons_count == 0
              ? lang('урок', localization)
              : item?.lessons_count > 0 && item?.lessons_count < 5
              ? lang('урока', localization)
              : lang('уроков', localization)}
          </Text>
          <ItemRating
            rating={item?.rating}
            reviewCount={item?.reviews_count}
            starSize={16}
          />
        </View>
      </RowView>
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
