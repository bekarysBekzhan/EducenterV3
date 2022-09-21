import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import {CourseService} from '../../../services/API';
import {useState} from 'react';
import {useEffect} from 'react';
import {APP_COLORS, WIDTH} from '../../../constans/constants';
import FastImage from 'react-native-fast-image';
import {fileDownloader, setFontStyle, wordLocalization} from '../../../utils/utils';
import RowView from '../../../components/view/RowView';
import {down, iconPlay, lock, PlayIcon, time, up} from '../../../assets/icons';
import {strings} from '../../../localization';
import Divider from '../../../components/Divider';
import Collapsible from 'react-native-collapsible';
import {useSettings} from '../../../components/context/Provider';
import TransactionButton from '../../../components/button/TransactionButton';
import DetailView from '../../../components/view/DetailView';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import RNFS from 'react-native-fs';
import Downloader from '../../../components/Downloader';
import Footer from '../../../components/course/Footer';
import LoadingScreen from '../../../components/LoadingScreen';

const MyCourseDetailScreen = props => {

  const courseID = props.route?.params?.courseID;

  const {settings} = useSettings();

  const [visible, setVisible] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [progress, setProgress] = useState(0);

  const refJobId = useRef(null);

  const [data, setData] = useState(null);
  const [fetchCourse, isLoading, courseError] = useFetching(async () => {
    const response = await CourseService.fetchCourseByID(courseID);
    setData(response.data?.data);
  });

  useEffect(() => {
    fetchCourse();
  }, []);

  const onProgress = useCallback(data => {
    console.log('progress: ', data);

    if (data) {
      refJobId.current = data?.jobId;
      let currentPercent = (data?.bytesWritten * 100) / data?.contentLength;
      setProgress(currentPercent);
    } else {
      refJobId.current = null;
      setProgress(0);
    }
  }, []);

  const downloader = useCallback(() => {
    const urlFile = data?.user_certificate?.file;
    const fileName = data?.title;
    setVisible(true);
    fileDownloader(urlFile, fileName, () => setVisible(false), onProgress);
  }, []);

  const cancelDownloader = useCallback(() => {
    setVisible(false);
    if (refJobId.current) {
      RNFS.stopDownload(refJobId.current);
      setProgress(0);
    }
  }, []);

  const passedLessonCount = (chapter) => {
    if (chapter?.position < data?.progress?.last_chapter_position) {
      return chapter?.lessons_count
    } 
    if (chapter?.position > data?.progress?.last_chapter_position) {
      return 0
    }

    return data?.progress?.last_lesson_position
  }

  const getProgressPercent = (chapter) => {
    return (passedLessonCount(chapter) / chapter?.lessons_count) * 100
  }

  const renderHeader = () => {
    return (
      <UniversalView>
        <DetailView
          poster={data?.poster}
          category={data?.category?.name}
          title={data?.title}
          duration={data?.time}
          rating={data?.rating}
          reviewCount={data?.reviews_count}
          description={data?.description}
        />
        <Divider isAbsolute={false} />
        <Text style={styles.courseProgram}>{strings['Программа курса']}</Text>
        <RowView style={{ justifyContent: "space-between", margin: 16 }}>
          <Text>{strings['Скрыть пройденные курсы']}</Text>
          <Switch
            value={isFilter}
            onValueChange={(value) => setIsFilter(value)}
            thumbColor={isFilter ? APP_COLORS.primary : APP_COLORS.placeholder}
            trackColor={{ true: "#EBEBFE", false: "white"}}
          />
        </RowView>
      </UniversalView>
    )
  };

  const renderChapter = ({item, index}) => {

    if (isFilter && getProgressPercent(item) === 100) {
      return null
    }

    return (
      <CourseChapter
        item={item}
        index={index}
        hasSubscribed={data?.has_subscribed}
        navigation={props.navigation}
        passedLessonsCount={passedLessonCount(item)}
        totalLessonsCount={item?.lessons_count}
        percent={getProgressPercent(item)}
      />
    );
  };

  const renderFooter = () => {
    return <Footer data={data} navigation={props?.navigation} />;
  };

  const renderTransactionButton = () => {

    if (data?.progress?.finished && data?.user_certificate && settings?.modules_enabled_certificates) {
      return (
        <TransactionButton
          text={strings['Скачать сертификат']}
          style={{backgroundColor: 'green'}}
          textStyle={{textTransform: 'uppercase'}}
          onPress={downloader}
        />
      )
    }

    return (
      <TransactionButton
        text={strings['Продолжить урок']}
        onPress={() =>
          props.navigation.navigate(ROUTE_NAMES.lesson, {
            id: data?.progress?.next_lesson?.id,
            title: data?.progress?.next_lesson?.chapter?.title,
          })
        }
      />
    );
  };

  if (isLoading) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView style={styles.container}>
        <FlatList
          data={data?.chapters}
          ListHeaderComponent={renderHeader}
          renderItem={renderChapter}
          ListFooterComponent={renderFooter}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      {renderTransactionButton()}
      <Downloader
        visible={visible}
        progress={progress}
        onPressCancel={cancelDownloader}
      />
    </UniversalView>
  );
};

const CourseChapter = ({
  item, 
  index, 
  hasSubscribed, 
  navigation,
  totalLessonsCount,
  passedLessonsCount,
  percent,
}) => {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const {settings, isAuth} = useSettings();

  const onLesson = (id, title) => {
    if (!isAuth) {
      navigation.replace(ROUTE_NAMES.bottomTab, {
        screen: ROUTE_NAMES.menuStack,
      });
    } else {
      navigation.navigate(ROUTE_NAMES.lesson, {id, title});
    }
  };

  const renderProgressBar = (percent = 10) => {
    console.log("percent : " , percent)
    return (
      <View style={styles.progressBar}>
        <View style={[styles.completedProgress, { 
          width: percent + "%", 
          backgroundColor: percent === 100 ? "green" : APP_COLORS.primary 
          }]}
        />
      </View>
    )
  }

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
          <Text style={styles.chapterTitle} numberOfLines={2}>
            {item?.title}
          </Text>
          <Text style={styles.counts}>
            {item?.lessons?.length} {strings.лекции}・{item?.files_count}{' '}
            {strings.файла}・{item?.tests_count} {strings.тест}
          </Text>
          <View style={styles.courseStatus}>
            {renderProgressBar(percent)}
            <RowView style={{ justifyContent: "space-between" }}>
              <Text style={styles.counts}>{wordLocalization(strings[':num из :count'], { num: passedLessonsCount, count: totalLessonsCount})}</Text>
              <Text style={styles.counts}>{Math.round(percent)}%</Text>
            </RowView>
          </View>
        </View>
        <RowView>
          <FastImage
            source={{
              uri:
                item?.lessons?.length > 0
                  ? item?.lessons[0]?.preview
                  : settings?.logo,
            }}
            style={styles.chapterPoster}>
            <View style={styles.chapterPosterOpacity}>
              <View style={styles.chapterPlay}>
                <PlayIcon size={0.9} color={APP_COLORS.primary}/>
              </View>
            </View>
          </FastImage>
          <View style={{marginLeft: 8}}>{isCollapsed ? down : up}</View>
        </RowView>
      </TouchableOpacity>
      <Divider
        isAbsolute={false}
        style={{
          width: WIDTH - 32,
        }}
      />
      <Collapsible collapsed={isCollapsed} style={styles.collapsed}>
        {item?.lessons.map((lesson, i) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onLesson(lesson?.id, lesson?.chapter?.title)}
            key={i}>
            <RowView style={styles.lesson}>
              <RowView style={styles.lessonRow1}>
                <View style={styles.lessonIcon}>
                  {lesson?.is_promo || hasSubscribed ? (
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
  container: {},
  counts: {
    ...setFontStyle(13, '500', APP_COLORS.placeholder),
  },
  subscribeToCourseText: {
    ...setFontStyle(14, '400', APP_COLORS.placeholder),
    marginLeft: 6,
  },
  courseStatus: {
    marginBottom: 10,
  },
  chapter: {
    padding: 8,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterInfo: {
    flex: 1,
    paddingRight: 12
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
  progressBar: {
    height: 6.8,
    backgroundColor: APP_COLORS.input,
    borderRadius: 13,
    marginVertical: 8
  },
  completedProgress: {
    height: 7.0,
    borderRadius: 13,
  }
});

export default MyCourseDetailScreen;
