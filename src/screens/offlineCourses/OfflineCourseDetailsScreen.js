import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {Fragment, useCallback, useState, useEffect, useRef} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {CourseService} from '../../services/API';
import {TYPE_SUBCRIBES} from '../../constans/constants';
import {fileDownloader, setFontStyle} from '../../utils/utils';
import {JournalIcon} from '../../assets/icons';
import {strings} from '../../localization';
import {useSettings} from '../../components/context/Provider';
import TransactionButton from '../../components/button/TransactionButton';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import Footer from '../../components/course/Footer';
import LoadingScreen from '../../components/LoadingScreen';
import NavButtonRow from '../../components/view/NavButtonRow';
import FastImage from 'react-native-fast-image';
import EventItem from '../../components/item/EventItem';
import Downloader from '../../components/Downloader';
import RNFS from 'react-native-fs';

const OfflineCourseDetailsScreen = props => {
  const {isAuth} = useSettings();
  const courseID = props.route?.params?.courseID;

  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const refJobId = useRef(null);
  const [fetchCourse, isLoading, courseError] = useFetching(async () => {
    const response = await CourseService.fetchCourseByID(courseID);
    setData(response.data?.data);
  });

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

  const cancelDownloader = useCallback(() => {
    setVisible(false);
    if (refJobId.current) {
      RNFS.stopDownload(refJobId.current);
      setProgress(0);
    }
  }, []);

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
    {
      title: strings['Скачать сертификат'],
      leftIcon: <JournalIcon />,
      hide: !data?.user_certificate?.file,
      type: 'certificate',
    },
  ];

  useEffect(() => {
    fetchCourse();
  }, []);

  const onTransaction = () => {
    if (isAuth) {
      props.navigation.navigate(ROUTE_NAMES.operation, {
        operation: data,
        type: TYPE_SUBCRIBES.COURSE_SUBCRIBE,
      });
    } else {
      props.navigation.navigate(ROUTE_NAMES.login);
    }
  };

  const renderItem = useCallback(
    ({item, index}) => (
      <EventItem
        item={item}
        date={item?.start_time + ' - ' + item?.end_time}
        address={item?.address}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((_, index) => index, []);

  const renderHeader = () => {
    return <CourseListHeader data={data} props={props} />;
  };

  const renderFooter = () => {
    const listOfData = () => {
      return maps.map((map, key) => {
        if (map.hide) {
          return null;
        } else {
          return (
            <NavButtonRow
              key={key}
              leftIcon={map.leftIcon}
              style={{marginHorizontal: 16, marginVertical: 8}}
              title={map.title}
              onPress={() => {
                if (isAuth) {
                  if (map?.type == 'certificate') {
                    setVisible(true);
                    fileDownloader(
                      data?.user_certificate?.file,
                      data?.title,
                      () => setVisible(false),
                      onProgress,
                    );
                  } else {
                    if (data?.has_subscribed) {
                      props?.navigation?.navigate(map.navigation, map.props);
                    }
                  }
                } else {
                  props?.navigation.navigate(ROUTE_NAMES.login);
                }
              }}
            />
          );
        }
      });
    };

    return (
      <Fragment>
        {listOfData()}
        <Footer data={data} navigation={props.navigation} haveAuthor={false} />
      </Fragment>
    );
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
    <UniversalView>
      <FlatList
        data={data?.times}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
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

const CourseListHeader = ({data}) => {
  return (
    <View>
      <FastImage
        source={{
          uri: data?.poster,
          priority: 'high',
        }}
        style={styles.poster}
      />
      <Text style={styles.title}>{data?.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  poster: {
    width: '100%',
    height: 232,
    marginBottom: 16,
  },
  title: {
    ...setFontStyle(20, '700'),
    marginBottom: 8,
    marginHorizontal: 16,
    textTransform: 'uppercase',
  },
});

export default OfflineCourseDetailsScreen;
