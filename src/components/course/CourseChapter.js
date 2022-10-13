import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useSettings } from '../context/Provider';
import { ROUTE_NAMES } from '../navigation/routes';
import { APP_COLORS } from '../../constans/constants';
import { strings } from '../../localization';
import { down, iconPlay, lock, PlayIcon, time, up } from '../../assets/icons';
import RowView from '../view/RowView';
import FastImage from 'react-native-fast-image';
import Collapsible from 'react-native-collapsible';
import { setFontStyle } from '../../utils/utils';

const CourseChapter = ({item, index, hasSubscribed = false, navigation, from = "course", onPress = () => undefined}) => {

    const [isCollapsed, setIsCollapsed] = useState(true);
    const {settings, isAuth} = useSettings();
  
    const onLesson = (id, title) => {
      if (!isAuth) {
        navigation.navigate(ROUTE_NAMES.login);
      } else {
        if (from === "course") {
          navigation.navigate(ROUTE_NAMES.lesson, {id, title, hasSubscribed});
        } else if(from === "lesson") {
          navigation.replace(ROUTE_NAMES.lesson, {id, title, hasSubscribed});
          onPress()
        }
      }
    };
  
    const renderStatus = () => {
  
      if (item?.lessons.filter(lesson => lesson?.is_promo).length > 0) {
        return (
          <RowView>
            <View
              style={[styles.chapterPlay, {backgroundColor: APP_COLORS.primary}]}>
              <PlayIcon size={0.9} />
            </View>
            <Text style={styles.promoText}>
              {strings['Смотреть первый урок бесплатно']}
            </Text>
          </RowView>
        );
      }
  
      return (
        <RowView>
          {lock()}
          <Text style={styles.subscribeToCourseText}>
            {strings['Купите курс чтобы смотреть']}
          </Text>
        </RowView>
      );
    };
  
    return (
      <View>
        <TouchableOpacity
          onPress={() => setIsCollapsed(prev => !prev)}
          style={[
            styles.chapter,
            {backgroundColor: isCollapsed ? APP_COLORS.gray2 : 'white'},
          ]}
          activeOpacity={0.8}
        >
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterTitle} numberOfLines={2}>{item?.title}</Text>
            <Text style={styles.counts}>
              {item?.lessons?.length} {strings.лекции}・{item?.files_count}{' '}
              {strings.файла}・{item?.tests_count} {strings.тест}
            </Text>
            <View style={styles.courseStatus}>{renderStatus()}</View>
          </View>
          <RowView>
            <FastImage
              source={{
                uri:
                  item?.lessons?.length > 0
                    ? item?.lessons[0]?.preview
                    : settings?.logo,
                priority: "high",
              }}
              style={styles.chapterPoster}>
              <View style={styles.chapterPosterOpacity}>
                <View style={styles.chapterPlay}>
                  <PlayIcon size={0.9} color={APP_COLORS.primary} />
                </View>
              </View>
            </FastImage>
            <View style={{marginLeft: 8}}>{isCollapsed ? down : up}</View>
          </RowView>
        </TouchableOpacity>
  
        <Collapsible collapsed={isCollapsed} style={styles.collapsed}>
          {item?.lessons.map((lesson, i) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onLesson(lesson?.id, lesson?.chapter?.title)}
              key={i}>
              <RowView style={styles.lesson}>
                <RowView style={styles.lessonRow1}>
                  <View style={styles.lessonIcon}>
                    {lesson?.is_promo ? (
                      <View style={styles.lessonPlay}>{iconPlay(0.85)}</View>
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
        </Collapsible>
      </View>
    );
  };

const styles = StyleSheet.create({
    chapter: {
        padding: 8,
        paddingLeft: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      chapterInfo: {
        flex: 1,
        paddingRight: 8,
      },
      chapterPoster: {
        width: 62,
        height: 62,
        borderRadius: 8,
      },
      chapterTitle: {
        ...setFontStyle(16, '600'),
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
      promoText: {
        ...setFontStyle(13, '600', APP_COLORS.primary),
        textTransform: 'uppercase',
        marginLeft: 6,
        flex: 1,
      },
      courseProgram: {
        margin: 16,
        ...setFontStyle(21, '700'),
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
      subscribeToCourseText: {
        ...setFontStyle(14, '400', APP_COLORS.placeholder),
        marginLeft: 6,
        flex: 1,
      },
      counts: {
        ...setFontStyle(13, '400', APP_COLORS.placeholder),
        marginBottom: 8,
      },
      courseStatus: {
        marginBottom: 10,
      },
})

export default CourseChapter