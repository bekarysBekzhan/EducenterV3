import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import {CourseService} from '../../../services/API';
import {useState} from 'react';
import {useEffect} from 'react';
import {APP_COLORS, TYPE_SUBCRIBES, WIDTH} from '../../../constans/constants';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../../utils/utils';
import RowView from '../../../components/view/RowView';
import {down, iconPlay, lock, PlayIcon, time, up} from '../../../assets/icons';
import {strings} from '../../../localization';
import Divider from '../../../components/Divider';
import Collapsible from 'react-native-collapsible';
import {useSettings} from '../../../components/context/Provider';
import TransactionButton from '../../../components/button/TransactionButton';
import DetailView from '../../../components/view/DetailView';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import Footer from '../../../components/course/Footer';
import LoadingScreen from '../../../components/LoadingScreen';

const CourseDetailScreen = props => {
  const {isAuth} = useSettings();

  const courseID = props.route?.params?.courseID;

  const [data, setData] = useState(null);
  const [fetchCourse, isLoading, courseError] = useFetching(async () => {
    const response = await CourseService.fetchCourseByID(courseID);
    setData(response.data?.data);
  });

  useEffect(() => {
    fetchCourse();
  }, []);

  const onTransaction = () => {
    if (isAuth) {
      if (data?.has_subscribed) {
      } else {
        props.navigation.navigate(ROUTE_NAMES.operation, {
          operation: data,
          type: TYPE_SUBCRIBES.COURSE_SUBCRIBE,
        });
      }
    } else {
      props.navigation.navigate(ROUTE_NAMES.login);
    }
  };

  const renderHeader = () => {
    return <CourseListHeader data={data} />;
  };

  const renderChapter = ({item, index}) => {
    return (
      <CourseChapter
        item={item}
        index={index}
        hasSubscribed={data?.has_subscribed}
        navigation={props.navigation}
      />
    );
  };

  const renderFooter = () => {
    return <Footer data={data} navigation={props.navigation} />;
  };

  const renderTransactionButton = () => {
    return (
      <TransactionButton
        text={strings['Купить полный курс']}
        price={data?.price}
        oldPrice={data?.old_price}
        onPress={onTransaction}
      />
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView style={styles.container}>
      <FlatList
        data={data?.chapters}
        ListHeaderComponent={renderHeader}
        renderItem={renderChapter}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      {renderTransactionButton()}
    </UniversalView>
  );
};

const CourseListHeader = ({data}) => {
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
    </UniversalView>
  );
};

const CourseChapter = ({item, index, hasSubscribed, navigation}) => {
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
  container: {},
  counts: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
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
});

export default CourseDetailScreen;
