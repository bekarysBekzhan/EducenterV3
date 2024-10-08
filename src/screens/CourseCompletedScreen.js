import { Text, StyleSheet } from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import UniversalView from '../components/view/UniversalView';
import { useFetching } from '../hooks/useFetching';
import { CourseService } from '../services/API';
import LoadingScreen from '../components/LoadingScreen';
import { fileDownloader, setFontStyle, wordLocalization } from '../utils/utils';
import CourseRow from '../components/CourseRow';
import SimpleButton from '../components/button/SimpleButton';
import { APP_COLORS, WIDTH } from '../constants/constants';
import { ROUTE_NAMES } from '../components/navigation/routes';
import RNFS from 'react-native-fs';
import Downloader from '../components/Downloader';
import { useLocalization } from '../components/context/LocalizationProvider';
import { lang } from '../localization/lang';
import { useSettings } from '../components/context/Provider';

const CourseCompletedScreen = props => {
  const { localization } = useLocalization();
  const { settings } = useSettings();

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
      title: lang('Завершение курса', localization),
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

  const onReview = () => {
    props.navigation.navigate(ROUTE_NAMES.courseLeaveReview, { id });
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <UniversalView style={styles.container}>
        <Text style={styles.congrats}>{lang('Поздравляем!', localization)}</Text>
        <Text style={styles.text}>
          {wordLocalization(
            lang(
              'Вы прошли курс “:course_name”. Оставтье отзыв о курсе, тем самым вы поможете улучшить нам сервис',
              localization,
            ),
            {
              course_name: data?.title,
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
          containerStyle={styles.courseRowStyle}
        />
        {data?.certification ? (
          <Text style={[styles.text, { textAlign: 'center' }]}>
            {lang(
              'Твой сертификат доступен в твоем личном кабинете',
              localization,
            )}
          </Text>
        ) : null}
        {data?.certification ? (
          <SimpleButton
            text={lang('Скачать сертификат', localization)}
            style={styles.downloadButton}
            textStyle={{color: settings?.color_app}}
            onPress={downloader}
          />
        ) : null}
        <SimpleButton
          text={lang('Оставить отзыв', localization)}
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
    backgroundColor: APP_COLORS.mediumgray,
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
  courseRowStyle: { marginBottom: 20 },
});

export default CourseCompletedScreen;
