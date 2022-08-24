import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import UniversalView from './UniversalView';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS, HEIGHT, WIDTH} from '../../constans/constants';
import TextButton from '../button/TextButton';
import {strings} from '../../localization';
import HtmlView from '../HtmlView';
import ItemRating from '../ItemRating';
import FastImage from 'react-native-fast-image';
import {useState} from 'react';
import RowView from './RowView';
import {time} from '../../assets/icons';

const DetailView = ({
  poster,
  category,
  title,
  duration,
  description,
  rating,
  reviewCount,
}) => {
  const [isDescriptionMore, setDescriptionMore] = useState(false);

  return (
    <View style={styles.container}>
      {
        poster 
        ?
        <FastImage
          source={{uri: poster, priority: 'high'}}
          style={styles.poster}
        />
        :
        null
      }
      <View
        style={{
          padding: 16,
        }}>
        {category ? <Text style={styles.category}>{category}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        <RowView>
          {time()}
          <Text style={styles.time}>{duration ? duration : 30} {strings.мин}.</Text>
          {
            rating !== undefined || reviewCount !== undefined
            ?
            <ItemRating
              rating={rating}
              reviewCount={reviewCount}
              starSize={16}
              word={true}
            />
            :
            null
          }
        </RowView>
        <View
          style={
            isDescriptionMore
              ? styles.descriptionViewShow
              : styles.descriptionViewHidden
          }>
          {description ? <HtmlView html={description} /> : null}
        </View>
        {description && !isDescriptionMore ? (
          <TextButton
            text={strings.Подробнее}
            style={styles.moreButton}
            textStyle={styles.moreButtonText}
            onPress={() => setDescriptionMore(true)}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.2,
    borderColor: APP_COLORS.border
  },
  category: {
    textTransform: 'uppercase',
    ...setFontStyle(14, '700', APP_COLORS.placeholder),
  },
  title: {
    ...setFontStyle(21, '700'),
    marginVertical: 8,
  },
  counts: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
  },
  poster: {
    width: WIDTH,
    height: HEIGHT / 3.6,
  },
  time: {
    marginHorizontal: 4,
    ...setFontStyle(15, '400', APP_COLORS.primary),
  },
  descriptionViewHidden: {
    overflow: 'hidden',
    maxHeight: 120,
  },
  descriptionViewShow: {
    overflow: 'hidden',
    maxHeight: null,
  },
  moreButton: {
    alignSelf: 'flex-start',
  },
  moreButtonText: {
    ...setFontStyle(15, '500', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
});

export default DetailView;
