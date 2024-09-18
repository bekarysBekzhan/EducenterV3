import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import React from 'react';
import { APP_COLORS, N_STATUS, WIDTH } from '../../../../constants/constants';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import Price from '../../../../components/Price';
import ItemRating from '../../../../components/ItemRating';
import { ROUTE_NAMES } from '../../../../components/navigation/routes';
import { useSettings } from '../../../../components/context/Provider';
import { setFontStyle } from '../../../../utils/utils';
import { lang } from '../../../../localization/lang';

export const DefaultCard = ({ item, index, navigation }) => {
  const { nstatus, settings } = useSettings();

  console.log('DefaultCard');

  const onCourse = () => {
    if (item?.has_subscribed) {
      navigation.navigate(ROUTE_NAMES.myCourseDetail, { courseID: item?.id });
    } else {
      navigation.navigate(ROUTE_NAMES.courseDetail, { courseID: item?.id });
    }
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={onCourse}>
      <FastImage
        source={{ uri: item?.poster, priority: 'high' }}
        style={styles.poster}
      />
      <View style={styles.courseCardInfo}>
        <Text style={[styles.category, {color: settings?.color_app}]}>{item?.category_name}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item?.title}
        </Text>
        <RowView style={styles.row2}>
          <Text style={styles.nameStyle}>{item?.name}</Text>
          <ItemRating
            rating={item?.rating}
            reviewCount={item?.reviews_count}
            starSize={16}
          />
        </RowView>
        <RowView style={styles.row1}>
          {nstatus === N_STATUS ? null : (
            <Price
              price={item?.price}
              oldPrice={item?.old_price}
              priceStyle={styles.price}
              oldPriceStyle={styles.oldPrice}
            />
          )}
        </RowView>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  courseCard: {
    borderRadius: 16,
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
  courseCardInfo: {
    padding: 16,
  },
  row1: {
    justifyContent: 'space-between',
  },
  row2: {
    marginBottom: 8,
  },
  nameStyle: {
    ...setFontStyle(12, '400', APP_COLORS.gray4),
    textAlign: 'left',
  },
  title: {
    ...setFontStyle(16, '600', APP_COLORS.font),
    letterSpacing: 0.4,
    textAlign: 'left',
    marginBottom: 8,
  },
  category: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
    textAlign: 'left',
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: APP_COLORS.darkgray,
  },
  price: {
    ...setFontStyle(20, '700', APP_COLORS.darkblack),
    textAlign: 'right',
  },
  oldPrice: {
    ...setFontStyle(14, '400', APP_COLORS.label),
    textAlign: 'right',
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

