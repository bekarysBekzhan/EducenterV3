import {Text, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {CourseService} from '../../services/API';
import {useState} from 'react';
import {useEffect} from 'react';
import {APP_COLORS, TYPE_SUBCRIBES, WIDTH} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import {JournalIcon} from '../../assets/icons';
import {strings} from '../../localization';
import Divider from '../../components/Divider';
import {useSettings} from '../../components/context/Provider';
import TransactionButton from '../../components/button/TransactionButton';
import DetailView from '../../components/view/DetailView';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import Footer from '../../components/course/Footer';
import LoadingScreen from '../../components/LoadingScreen';
import NavButtonRow from '../../components/view/NavButtonRow';

const OfflineCourseDetailsScreen = props => {
  const {isAuth} = useSettings();
  const courseID = props.route?.params?.courseID;

  const [data, setData] = useState(null);
  const [fetchCourse, isLoading, courseError] = useFetching(async () => {
    const response = await CourseService.fetchCourseByID(courseID);
    setData(response.data?.data);
    console.log('lalalalalala', response);
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
    return <CourseListHeader data={data} props={props} />;
  };

  const renderFooter = () => {
    return <Footer data={data} navigation={props.navigation} />;
  };

  const renderTransactionButton = () => {
    return data?.has_subscribed ? null : (
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
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ItemSeparatorComponent={() => <Divider />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      {renderTransactionButton()}
    </UniversalView>
  );
};

const CourseListHeader = ({data, props}) => {
  const {isAuth} = useSettings();

  const maps = [
    {
      title: strings['Участники курса'],
      leftIcon: <JournalIcon />,
      navigation: ROUTE_NAMES.offlineCourseMemberScreen,
      props: data?.members,
    },
    {
      title: strings['Материалы курса'],
      leftIcon: <JournalIcon />,
      navigation: ROUTE_NAMES.courseMaterialScreen,
      props: data?.files,
    },
  ];

  const listOfData = () => {
    return maps.map((map, key) => (
      <NavButtonRow
        key={key}
        leftIcon={map.leftIcon}
        style={{marginHorizontal: 16, marginVertical: 8}}
        title={map.title}
        onPress={() => props?.navigation?.navigate(map.navigation, map.props)}
      />
    ));
  };

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

      {isAuth ? (data?.has_subscribed ? listOfData() : null) : null}

      <Divider isAbsolute={false} />
      <Text style={styles.courseProgram}>{strings['Программа курса']}</Text>
    </UniversalView>
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
  courseInfoTitle: {
    ...setFontStyle(18, '500'),
    paddingHorizontal: 13,
  },
});

export default OfflineCourseDetailsScreen;
