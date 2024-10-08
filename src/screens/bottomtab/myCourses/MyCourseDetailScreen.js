import { Text, FlatList, StyleSheet, Switch, View } from 'react-native';
import React, { useCallback, useRef } from 'react';
import UniversalView from '../../../components/view/UniversalView';
import { useFetching } from '../../../hooks/useFetching';
import { CourseService } from '../../../services/API';
import { useState } from 'react';
import { useEffect } from 'react';
import { APP_COLORS } from '../../../constants/constants';
import { fileDownloader, setFontStyle } from '../../../utils/utils';
import RowView from '../../../components/view/RowView';
import Divider from '../../../components/Divider';
import { useSettings } from '../../../components/context/Provider';
import TransactionButton from '../../../components/button/TransactionButton';
import DetailView from '../../../components/view/DetailView';
import { ROUTE_NAMES } from '../../../components/navigation/routes';
import RNFS from 'react-native-fs';
import Downloader from '../../../components/Downloader';
import Footer from '../../../components/course/Footer';
import LoadingScreen from '../../../components/LoadingScreen';
import MyCourseChapter from '../../../components/course/MyCourseChapter';
import { useLocalization } from '../../../components/context/LocalizationProvider';
import { lang } from '../../../localization/lang';
import SmallHeaderBar from '../../../components/SmallHeaderBar';

const MyCourseDetailScreen = props => {
  const courseID = props.route?.params?.courseID;

  const { settings } = useSettings();
  const { localization } = useLocalization();

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
    const state = props.navigation.getState();
    console.log('state', state);
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
  }, [data]);

  const cancelDownloader = useCallback(() => {
    setVisible(false);
    if (refJobId.current) {
      RNFS.stopDownload(refJobId.current);
      setProgress(0);
    }
  }, []);

  const passedLessonCount = chapter => {
    if (chapter?.position < data?.progress?.last_chapter_position) {
      return chapter?.lessons_count;
    }
    if (chapter?.position > data?.progress?.last_chapter_position) {
      return 0;
    }

    return data?.progress?.last_lesson_position;
  };

  const getProgressPercent = chapter => {
    return (passedLessonCount(chapter, data) / chapter?.lessons_count) * 100;
  };

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
        <View style={styles.courseInfoContainer}>
          <Text style={styles.courseProgram}>
            {lang('Программа курса', localization)}
          </Text>
          <RowView style={{ justifyContent: 'space-between', margin: 16 }}>
            <Text style={{ color: APP_COLORS.font }}>
              {lang('Скрыть пройденные курсы', localization)}
            </Text>
            <Switch
              value={isFilter}
              onValueChange={value => setIsFilter(value)}
              thumbColor={isFilter ? settings?.color_app : APP_COLORS.placeholder}
              trackColor={{ true: '#EBEBFE', false: '#eee' }}
            />
          </RowView>
        </View>
      </UniversalView>
    );
  };

  const renderChapter = ({ item, index }) => {
    if (isFilter && getProgressPercent(item) === 100) {
      return null;
    }

    return (
      <MyCourseChapter
        item={item}
        index={index}
        hasSubscribed={data?.has_subscribed}
        navigation={props.navigation}
        passedLessonsCount={passedLessonCount(item, data)}
        totalLessonsCount={item?.lessons_count}
        percent={getProgressPercent(item, data)}
      />
    );
  };

  const renderFooter = () => {
    return <Footer data={data} navigation={props?.navigation} />;
  };

  const renderTransactionButton = () => {
    if (
      data?.progress?.finished &&
      data?.user_certificate &&
      settings?.modules_enabled_certificates
    ) {
      return (
        <TransactionButton
          text={lang('Скачать сертификат', localization)}
          style={{ backgroundColor: 'green' }}
          textStyle={{ textTransform: 'uppercase' }}
          onPress={downloader}
        />
      );
    }

    return typeof passedLessonCount(courseID, data) == 'undefined' ? null : (
      <TransactionButton
        text={lang('Продолжить урок', localization)}
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
    return <LoadingScreen />;
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
        contentContainerStyle={styles.listContent}
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

const styles = StyleSheet.create({
  courseInfoContainer: {
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 50,
  },
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
  courseProgram: {
    margin: 16,
    ...setFontStyle(21, '700'),
  },
});

export default MyCourseDetailScreen;
