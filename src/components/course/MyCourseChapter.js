import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useSettings } from '../context/Provider';
import { ROUTE_NAMES } from '../navigation/routes';
import { APP_COLORS, WIDTH } from '../../constants/constants';
import { down, iconPlay, LeftArrowIcon, lock, PlayIcon, time, up } from '../../assets/icons';
import RowView from '../view/RowView';
import FastImage from 'react-native-fast-image';
import Collapsible from 'react-native-collapsible';
import { setFontStyle, wordLocalization } from '../../utils/utils';
import Divider from '../Divider';
import { useLocalization } from './../../components/context/LocalizationProvider';
import { lang } from '../../localization/lang';
import { CourseService } from '../../services/API';
import { useFetching } from '../../hooks/useFetching';
import { useLayoutEffect } from 'react';

const MyCourseChapter = ({
  item,
  index,
  hasSubscribed = true,
  navigation,
  totalLessonsCount,
  passedLessonsCount,
  percent,
  from = 'course',
  onPress = () => undefined,
}) => {
  const { localization } = useLocalization();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const { settings, isAuth } = useSettings();

  const onLesson = (id, title) => {
    if (!isAuth) {
      navigation.navigate(ROUTE_NAMES.login);
    } else {
      if (from === 'course') {
        navigation.navigate(ROUTE_NAMES.lesson, { id, title, hasSubscribed });
      } else if (from === 'lesson') {
        navigation.replace(ROUTE_NAMES.lesson, { id, title, hasSubscribed });
        onPress();
      }
    }
  };
  //--
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchCourse, isLoading, courseError] = useFetching(async () => {
    setIsCollapsed(prev => !prev);
    const response = await CourseService.fetchChapterById(item?.id)
    setData(response?.data?.data);
    setLoading(false);
    console.log("CourseChapter Featch", response?.data?.data);
  });
  //--

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: renderHeaderLeft,
      headerRight: null,
    });
  });

  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.iconButton}
      activeOpacity={0.65}
    >
      <LeftArrowIcon />
    </TouchableOpacity>
  );

  const renderProgressBar = (percent = 10) => {
    console.log('percent : ', percent);
    return (
      <View style={styles.progressBar}>
        <View
          style={[
            styles.completedProgress,
            {
              width: percent + '%',
              backgroundColor: percent === 100 ? 'green' : APP_COLORS.progress,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => isCollapsed ? (data ? setIsCollapsed(prev => !prev) : fetchCourse()) : setIsCollapsed(prev => !prev)}
        style={[
          styles.chapter,
          { backgroundColor: isCollapsed ? APP_COLORS.gray2 : 'white' },
        ]}
        activeOpacity={0.8}>
        <View style={styles.chapterInfo}>
          <Text style={styles.chapterTitle} numberOfLines={2}>
            {item?.title}
          </Text>
          <Text style={styles.counts}>
            {item?.lessons_count} {lang('лекции', localization)}・
            {item?.files_count} {lang('файла', localization)}・
            {item?.tests_count} {lang('тест', localization)}
          </Text>
          <View style={styles.courseStatus}>
            {renderProgressBar(percent)}
            <RowView style={{ justifyContent: 'space-between' }}>
              <Text style={styles.counts}>
                {lang(
                  wordLocalization(':num из :count', {
                    num:
                      typeof passedLessonsCount == 'undefined'
                        ? 0
                        : passedLessonsCount,
                    count: totalLessonsCount,
                  }),
                  localization,
                )}
              </Text>
              <Text style={styles.counts}>
                {isNaN(percent) ? 0 : Math.round(percent)}%
              </Text>
            </RowView>
          </View>
        </View>
        <RowView>
          {/* <FastImage
            source={{
              uri:
                item?.lessons?.length > 0
                  ? item?.lessons[0]?.preview
                  : settings?.logo,
            }}
            style={styles.chapterPoster}>
            <View style={styles.chapterPosterOpacity}>
              <View style={styles.chapterPlay}>
                <PlayIcon size={0.9} color={APP_COLORS.primary} />
              </View>
            </View>
          </FastImage> */}
          <View style={{ marginLeft: 8 }}>{isCollapsed ? down : up}</View>
        </RowView>
      </TouchableOpacity>
      <Divider
        isAbsolute={false}
        style={{
          width: WIDTH - 32,
        }}
      />
      {!isCollapsed ? loading ? <ActivityIndicator style={{ padding: 6 }} /> :
        <Collapsible collapsed={isCollapsed} style={styles.collapsed}>
          {data?.lessons.map((lesson, i) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onLesson(lesson?.id, lesson?.title)}
              key={i}>
              <RowView style={styles.lesson}>
                <RowView style={styles.lessonRow1}>
                  <View style={styles.lessonIcon}>
                    {lesson?.is_promo || hasSubscribed ? (
                      <View style={[styles.lessonPlay, {backgroundColor: settings?.color_app}]}>{iconPlay(0.85)}</View>
                    ) : (
                      lock()
                    )}
                  </View>
                  <Text
                    style={
                      lesson?.is_promo || hasSubscribed
                        ? styles.lessonTitle
                        : styles.lessonLockedTitle
                    }
                    numberOfLines={3}>
                    {index + 1}.{i + 1} {lesson?.title}
                  </Text>
                </RowView>
                <RowView>
                  {time(undefined, APP_COLORS.placeholder)}
                  <Text style={styles.lessonTime}>
                    {lesson?.time < 10 ? '0' + lesson?.time : lesson?.time}:00
                  </Text>
                </RowView>
              </RowView>
            </TouchableOpacity>
          ))}
        </Collapsible> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  chapter: {
    paddingTop: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterInfo: {
    flex: 1,
    paddingRight: 12,
  },
  chapterPoster: {
    width: 62,
    height: 62,
    borderRadius: 8,
  },
  chapterTitle: {
    ...setFontStyle(16, '600', APP_COLORS.font),
    marginBottom: 7,
  },
  chapterPosterOpacity: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterPlay: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseProgram: {
    margin: 16,
    ...setFontStyle(21, '700', APP_COLORS.font),
  },
  collapsed: {
    padding: 0,
  },
  lesson: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  lessonRow1: {
    flex: 1,
    paddingRight: 40,
  },
  lessonIcon: {
    marginRight: 9,
  },
  lessonPlay: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonTitle: {
    ...setFontStyle(12, '500'),
  },
  lessonLockedTitle: {
    ...setFontStyle(12, '400', APP_COLORS.placeholder),
  },
  lessonTime: {
    ...setFontStyle(11, '400', APP_COLORS.placeholder),
  },
  progressBar: {
    height: 6.8,
    backgroundColor: APP_COLORS.input,
    borderRadius: 13,
    marginVertical: 8,
  },
  counts: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
  },
  courseStatus: {
    marginBottom: 10,
  },
  completedProgress: {
    height: 7.0,
    borderRadius: 13,
  },
  iconButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
  },
});

export default MyCourseChapter;
