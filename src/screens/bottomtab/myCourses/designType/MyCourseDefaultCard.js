import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import RowView from '../../../../components/view/RowView';
import * as Progress from 'react-native-progress';
import { check, iconPlay, PlayIcon } from '../../../../assets/icons';
import CourseRow from '../../../../components/CourseRow';
import { setFontStyle } from '../../../../utils/utils';
import { ROUTE_NAMES } from '../../../../components/navigation/routes';
import { APP_COLORS, WIDTH } from '../../../../constants/constants';
import { useLocalization } from '../../../../components/context/LocalizationProvider';
import { lang } from '../../../../localization/lang';
import { useSettings } from '../../../../components/context/Provider';

export const MyCourseDefaultCard = ({ item, index, navigation }) => {
  const { localization } = useLocalization();
  const { settings } = useSettings();

  console.log('MyCourseDefaultCard');
  const onPressNextLesson = () => {
    navigation.navigate(ROUTE_NAMES.lesson, {
      id: item?.progress_information?.next_lesson?.id,
      title: item?.progress_information?.next_lesson?.chapter?.title,
    });
  };

  const onPressCourse = () => {
    navigation.navigate(ROUTE_NAMES.myCourseDetail, { courseID: item?.id });
  };

  const maxLength = 20;
  const title = item?.progress_information?.next_lesson?.title || '';

  const truncatedTitle = title.length > maxLength ? title.substring(0, maxLength) + '...' : title;

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.93} onPress={onPressNextLesson}>
        <RowView style={styles.row1}>
          <FastImage
            style={styles.poster}
            source={{
              uri: item?.progress_information?.next_lesson?.preview,
              priority: 'high',
            }} />
          <View style={styles.courseInfo}>
            <Text style={[styles.position, { color: settings?.color_app }]}>
              {lang('Урок', localization)}{' '}
              {item?.progress_information?.next_lesson?.position}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.title}
            >
              {truncatedTitle}
            </Text>
          </View>
        </RowView>
        <View style={styles.progressInfo}>
          {item?.progress_information?.finished ? (
            <RowView>
              <View style={styles.completedIcon}>{check()}</View>
              <Text style={styles.completedActionText}>
                {lang('Курс завершен', localization)}
              </Text>
            </RowView>
          ) : (
            <RowView>
              <View style={[styles.continueIcon, { paddingLeft: 7, backgroundColor: settings?.color_app }]}>
                {iconPlay(0.85)}
              </View>
              <Text style={[styles.continueActionText, { color: settings?.color_app }]}>
                {lang('Продолжить урок', localization)}
              </Text>
            </RowView>
          )}
          <Progress.Bar
            progress={
              item?.progress_information?.number
                ? parseFloat(item.progress_information?.number) / 100
                : 0
            }
            width={WIDTH / 1.2}
            height={4}
            borderRadius={12}
            borderWidth={4}
            borderColor={APP_COLORS.white}
            unfilledColor={APP_COLORS.gray}
            color={item?.progress_information?.finished ? APP_COLORS.green : APP_COLORS.progress}
            style={styles.progressBar}
          />
          <RowView style={styles.rowView}>
            <Text style={styles.progressText}>
              {item?.progress?.last_lesson_position} из {item?.lessons_count}
            </Text>
            <Text style={styles.progressPercentage}>
              {item?.progress?.lessons_count
                ? item.progress_information.number
                : '0 %'}
            </Text>
          </RowView>
        </View>
      </TouchableOpacity>
      <CourseRow
        title={item?.title}
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
    paddingTop: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: APP_COLORS.white,

    shadowColor: '#000153',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 100,
    elevation: 100,
  },
  poster: {
    borderRadius: 8,
    width: WIDTH / 4.05,
    height: 61,
    marginBottom: 16,
  },
  progressInfo: {
    justifyContent: 'space-between',
  },
  row1: {
    flex: 1,
    alignItems: 'flex-start',
  },
  courseInfo: {
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  position: {
    ...setFontStyle(14, '500', APP_COLORS.primary),
    letterSpacing: 0.4,
    textTransform: 'none',
    textAlign: 'left',
  },
  title: {
    marginTop: 4,
    ...setFontStyle(16, '500', APP_COLORS.black),
    letterSpacing: 0.4,
    textAlign: 'left',
    flexWrap: 'wrap',
  },
  completedIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 100,
    backgroundColor: APP_COLORS.green,
  },
  continueIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
  },
  completedActionText: {
    ...setFontStyle(12, '600', APP_COLORS.green),
    textAlign: 'right',
    letterSpacing: 0.4,
    marginLeft: 8,
  },
  continueActionText: {
    ...setFontStyle(12, '600', APP_COLORS.primary),
    textAlign: 'right',
    letterSpacing: 0.4,
    marginLeft: 8,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    marginVertical: 8,
    marginRight: 4,
  },
  rowView: {
    marginHorizontal: 3,
    justifyContent: 'space-between',
  },
  progressPercentage: {
    ...setFontStyle(11, '400', APP_COLORS.placeholder),
    textAlign: 'right',
  },
  progressText: {
    ...setFontStyle(11, '400', APP_COLORS.placeholder),
    textAlign: 'left',
  },
});
