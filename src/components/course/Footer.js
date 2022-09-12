import {View, Text, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {ROUTE_NAMES} from '../navigation/routes';
import ReviewItem from '../view/ReviewItem';
import UniversalView from '../view/UniversalView';
import Person from '../Person';
import RowView from '../view/RowView';
import {strings} from '../../localization';
import {setFontStyle} from '../../utils/utils';
import TextButton from '../button/TextButton';
import {APP_COLORS, WIDTH} from '../../constans/constants';

const Footer = ({data, navigation}) => {
  const onAllReviews = () => {
    navigation.navigate(ROUTE_NAMES.reviews, {id: data?.id});
  };

  const renderReview = ({item, index}) => {
    return (
      <ReviewItem
        avatar={item?.user?.avatar}
        name={item?.user?.name}
        date={item?.added_at}
        rating={item?.stars}
        startRating={item?.stars}
        review={item?.text}
        style={{
          ...styles.reviewItem,
          marginLeft: index === 0 ? 16 : 0,
          marginRight: index === data?.reviews.length - 1 ? 16 : 10,
        }}
        numberOfLines={3}
      />
    );
  };

  return (
    <UniversalView>
      <View style={{padding: 16, paddingTop: 32}}>
        <Person
          status={strings['Автор курса']}
          image={data?.author?.avatar}
          name={data?.author?.name + ' ' + data?.author?.surname}
          description={data?.author?.description}
        />
        <RowView style={{justifyContent: 'space-between'}}>
          <Text
            style={{
              ...setFontStyle(21, '700'),
            }}>
            {strings.Отзывы}
          </Text>
          <TextButton
            text={strings.Все}
            textStyle={styles.allButton}
            onPress={onAllReviews}
          />
        </RowView>
      </View>
      <FlatList
        data={data?.reviews}
        renderItem={renderReview}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  allButton: {
    ...setFontStyle(15, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
  reviewItem: {
    width: WIDTH - 64,
    height: 200,
  },
});

export default Footer;
