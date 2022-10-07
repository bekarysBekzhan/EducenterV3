import {
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import React from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import {CourseService} from '../../../services/API';
import {useState} from 'react';
import {useEffect} from 'react';
import {setFontStyle} from '../../../utils/utils';
import {strings} from '../../../localization';
import Divider from '../../../components/Divider';
import {useSettings} from '../../../components/context/Provider';
import TransactionButton from '../../../components/button/TransactionButton';
import DetailView from '../../../components/view/DetailView';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import Footer from '../../../components/course/Footer';
import LoadingScreen from '../../../components/LoadingScreen';
import CourseChapter from '../../../components/course/CourseChapter';
import { TYPE_SUBCRIBES } from '../../../constans/constants';

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

const styles = StyleSheet.create({
  container: {},
  courseProgram: {
    margin: 16,
    ...setFontStyle(21, '700'),
  },
});

export default CourseDetailScreen;
