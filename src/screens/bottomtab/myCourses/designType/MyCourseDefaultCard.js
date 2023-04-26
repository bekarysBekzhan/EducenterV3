import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import * as Progress from 'react-native-progress';
import {check, PlayIcon} from '../../../../assets/icons';
import CourseRow from '../../../../components/CourseRow';
import {setFontStyle} from '../../../../utils/utils';
import {ROUTE_NAMES} from '../../../../components/navigation/routes';
import {APP_COLORS, WIDTH} from '../../../../constans/constants';
import {useLocalization} from '../../../../components/context/LocalizationProvider';
import {lang} from '../../../../localization/lang';

export const MyCourseDefaultCard = ({item, index, navigation}) => {
  const {localization} = useLocalization();

  console.log('MyCourseDefaultCard');
  const onPressNextLesson = () => {
    navigation.navigate(ROUTE_NAMES.lesson, {
      id: item?.progress_information?.next_lesson?.id,
      title: item?.progress_information?.next_lesson?.chapter?.title,
    });
  };

  const onPressCourse = () => {
    navigation.navigate(ROUTE_NAMES.myCourseDetail, {courseID: item?.id});
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.93} onPress={onPressNextLesson}>
        <FastImage
          style={styles.poster}
          source={{
            uri: item?.progress_information?.next_lesson?.preview,
            priority: 'high',
          }}>
          <View style={styles.posterOverlay}>
            <RowView style={styles.row1}>
              <Text style={styles.position}>
                {item?.progress_information?.next_lesson?.position}{' '}
                {lang('урок', localization)}
              </Text>
              <Progress.Circle
                size={40}
                progress={
                  item?.progress_information?.number
                    ? parseFloat(item.progress_information?.number) / 100
                    : 0
                }
                formatText={() =>
                  item.progress_information?.number
                    ? item.progress_information.number
                    : '0 %'
                }
                borderWidth={0}
                unfilledColor={'rgba(255,255,255,0.4)'}
                borderColor={null}
                color={'#fff'}
                showsText
                textStyle={setFontStyle(10, '500', '#fff')}
              />
            </RowView>
            <View>
              {item?.progress_information?.finished ? (
                <RowView>
                  <View style={styles.icon}>{check()}</View>
                  <Text style={styles.actionText}>
                    {lang('Курс завершен', localization)}
                  </Text>
                </RowView>
              ) : (
                <RowView>
                  <View style={[styles.icon, {paddingLeft: 7}]}>
                    <PlayIcon size={0.6} />
                  </View>
                  <Text style={styles.actionText}>
                    {lang('Продолжить урок', localization)}
                  </Text>
                </RowView>
              )}
              <Text numberOfLines={2} style={styles.title}>
                {item?.progress_information?.next_lesson?.title}
              </Text>
              <Text numberOfLines={2} style={styles.description}>
                {item?.progress_information?.next_lesson?.description}
              </Text>
            </View>
          </View>
        </FastImage>
      </TouchableOpacity>
      <CourseRow
        title={item?.title}
        poster={item?.poster}
        category_name={item?.category_name}
        reviewCount={item?.reviews_count}
        rating={item?.reviews_stars}
        onPress={onPressCourse}
        certificate={item?.user_certificate}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  card: {
    marginHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.border,
  },
  poster: {
    flex: 1,
    borderRadius: 16,
    height: 220,
    marginBottom: 16,
  },
  posterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  position: {
    ...setFontStyle(16, '600', 'white'),
    textTransform: 'uppercase',
  },
  row1: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 7,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
  },
  actionText: {
    ...setFontStyle(12, '500', 'white'),
    marginLeft: 8,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginVertical: 8,
    ...setFontStyle(18, '600', 'white'),
  },
  description: {
    ...setFontStyle(14, '500', 'white'),
  },
});
