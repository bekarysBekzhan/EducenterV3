import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { N_STATUS } from '../../../../constans/constants';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import Price from '../../../../components/Price';
import ItemRating from '../../../../components/ItemRating';
import { ROUTE_NAMES } from '../../../../components/navigation/routes';
import { useSettings } from '../../../../components/context/Provider';
import { styles } from '../CoursesScreen';

export const DoubleCard = ({ item, index, navigation }) => {
  const { nstatus } = useSettings();

  console.log('DoubleCard');


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
      {/* <FastImage source={{ uri: item?.poster, priority: "high" }} style={styles.poster} /> */}
      <RowView style={styles.row1}>
        <Text style={styles.category}>{item?.category_name}</Text>
        {nstatus === N_STATUS ? null : (
          <Price
            price={item?.price}
            oldPrice={item?.old_price}
            priceStyle={styles.price}
            oldPriceStyle={styles.price} />
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
          starSize={16} />
      </RowView>
    </TouchableOpacity>
  );
};
