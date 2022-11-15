import {Text, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import {useFetching} from '../hooks/useFetching';
import {CourseService} from '../services/API';
import LoadingScreen from '../components/LoadingScreen';
import {strings} from '../localization';
import {fileDownloader, setFontStyle, wordLocalization} from '../utils/utils';
import CourseRow from '../components/CourseRow';
import SimpleButton from '../components/button/SimpleButton';
import {APP_COLORS, WIDTH} from '../constans/constants';
import {ROUTE_NAMES} from '../components/navigation/routes';
import RNFS from 'react-native-fs';
import Downloader from "../components/Downloader"

const CourseCompletedScreen = props => {

  const id = props.route?.params?.id;

  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const refJobId = useRef(null);

  const [fetchFinishedCourse, isFetching, fetchingError] = useFetching(
    async () => {
      const response = await CourseService.finishCourse(id);
      setData(response.data?.data);
    },
  );

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: strings['Завершение курса'],
    });
  }, []);

  useEffect(() => {
    fetchFinishedCourse();
  }, []);

  useEffect(() => {
    if (fetchingError) {
      console.log(fetchingError);
    }
  }, [fetchingError]);

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
    const urlFile = data?.user_certificate?.file
    const fileName = data?.title
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

  const onReview = () => {
    props.navigation.navigate(ROUTE_NAMES.courseLeaveReview, {id});
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView style={styles.container}>
      <Text style={styles.congrats}>{strings['Поздравляем!']}</Text>
      <Text style={styles.text}>
        {wordLocalization(
          strings[
            'Вы прошли курс “:course_name” успешно, набрав :num баллов из :count. Оставтье отзыв о курсе, тем самым вы поможете улучшить нам сервис'
          ],
          {
            course_name: data?.title,
            num: 8,
            count: 10,
          },
        )}
      </Text>
      <CourseRow
        poster={data?.poster}
        title={data?.title}
        category_name={data?.category?.name}
        reviewCount={data?.reviews_count}
        rating={data?.rating}
        disabled={true}
      />
      <Text style={[styles.text, {textAlign: 'center'}]}>
        {strings['Твой сертификат доступен в твоем личном кабинете']}
      </Text>
      <SimpleButton
        text={strings['Скачать сертификат']}
        style={styles.downloadButton}
        textStyle={styles.downloadText}
        onPress={downloader}
      />
      <SimpleButton
        text={strings['Оставить отзыв']}
        style={styles.reviewButton}
        textStyle={styles.reviewText}
        onPress={onReview}
      />
      <Downloader
        visible={visible}
        progress={progress}
        onPressCancel={cancelDownloader}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  congrats: {
    ...setFontStyle(29, '700'),
  },
  text: {
    ...setFontStyle(16),
    marginVertical: 16,
  },
  downloadButton: {
    backgroundColor: 'transparent',
    borderWidth: 0.75,
    borderColor: APP_COLORS.border,
    marginBottom: 8,
  },
  downloadText: {
    color: APP_COLORS.primary,
  },
  reviewButton: {},
  reviewText: {},
  view: {
    width: WIDTH,
    height: 200,
    backgroundColor: 'yellow',
  },
});

export default CourseCompletedScreen;
