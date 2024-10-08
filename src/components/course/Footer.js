import {View, Text, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {ROUTE_NAMES} from '../navigation/routes';
import ReviewItem from '../view/ReviewItem';
import UniversalView from '../view/UniversalView';
import Person from '../Person';
import RowView from '../view/RowView';
import {setFontStyle} from '../../utils/utils';
import TextButton from '../button/TextButton';
import {APP_COLORS, WIDTH} from '../../constants/constants';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';
import { useSettings } from '../context/Provider';

const Footer = ({data, navigation, haveAuthor = true}) => {
  const {localization} = useLocalization();
  const { settings } = useSettings();

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
      <View style={{paddingTop: 32}}>
        {haveAuthor ? (
          <Person
            status={lang('Автор курса', localization)}
            image={data?.author?.avatar}
            name={data?.author?.name}
            description={data?.author?.description}
          />
        ) : null}

        {data?.reviews?.length ? (
          <RowView style={styles.rowStyle}>
            <Text
              style={{
                ...setFontStyle(21, '700'),
              }}>
              {lang('Автор Отзывы', localization)}
            </Text>
            <TextButton
              text={lang('Все', localization)}
              textStyle={[styles.allButton, {color: settings?.color_app}]}
              style={{marginBottom: 16}}
              onPress={onAllReviews}
            />
          </RowView>
        ) : null}
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
  rowStyle: {
    marginHorizontal: 16,
    justifyContent: 'space-between',
  },
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
