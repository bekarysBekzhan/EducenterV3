import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import LoadingScreen from '../../../components/LoadingScreen';
import {MyCourseService} from '../../../services/API';
import {APP_COLORS} from '../../../constans/constants';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import {check, down, lock, PlayIcon, TimeIcon, up} from '../../../assets/icons';
import RowView from '../../../components/view/RowView';
import {
  fileDownloader,
  getTimeString,
  setFontStyle,
  wordLocalization,
} from '../../../utils/utils';
import TextButton from '../../../components/button/TextButton';
import Divider from '../../../components/Divider';
import Collapsible from 'react-native-collapsible';
import {useSettings} from '../../../components/context/Provider';
import RNFS from 'react-native-fs';
import Downloader from '../../../components/Downloader';
import Empty from '../../../components/Empty';
import {useLocalization} from '../../../components/context/LocalizationProvider';
import {lang} from '../../../localization/lang';

const MyTestsTab = props => {
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const {localization} = useLocalization();

  const refJobId = useRef(null);

  const [fetchTests, isFetching, fetchingError] = useFetching(async () => {
    const response = await MyCourseService.fetchMyTests();
    console.log('fetchTests', response);
    setData(response.data?.data);
    setLastPage(response.data?.last_page);
  });

  const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(
    async () => {
      const response = await MyCourseService.fetchMyTests('', page);
      console.log('fetchNext MyTest', response);
      setData(prev => prev.concat(response.data?.data));
    },
  );

  // fetchTest error handler
  useEffect(() => {
    if (fetchingError) {
      console.log(fetchingError);
    }
  }, [fetchingError]);

  // fetchNext error handler
  useEffect(() => {
    if (fetchingNextError) {
      console.log(fetchingNextError);
    }
  });

  useEffect(() => {
    if (page === 1) {
      fetchTests();
    } else {
      fetchNext();
    }
  }, [page]);

  const onStartTest = id => {
    props.navigation.navigate(ROUTE_NAMES.myTestDetail, {id});
  };

  const onShowResult = (id, resultType) => {
    props.navigation.navigate(ROUTE_NAMES.testResult, {id, resultType});
  };

  const downloader = useCallback(
    (urlFile, fileName = lang('Сертификат', localization)) => {
      setVisible(true);
      fileDownloader(urlFile, fileName, () => setVisible(false), onProgress);
    },
    [data],
  );

  const cancelDownloader = useCallback(() => {
    setVisible(false);
    if (refJobId.current) {
      RNFS.stopDownload(refJobId.current);
      setProgress(0);
    }
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

  const renderTest = ({item, index}) => {
    return (
      <ModuleMyTestItem
        id={item?.id}
        index={index}
        title={item?.title}
        attempts={item?.attempts}
        attemptHistory={item?.all_passings}
        certificate={item?.user_certificate}
        resultType={item?.result_type}
        localization={localization}
        onStartTest={onStartTest}
        onShowResult={onShowResult}
        onDownload={downloader}
      />
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = () => {
    if (page === 1) {
      fetchTests();
    }
    setPage(1);
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <FlatList
        data={data}
        contentContainerStyle={styles.container}
        renderItem={renderTest}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Empty />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
        refreshing={isFetching}
        onRefresh={onRefresh}
        initialNumToRender={20}
      />
      <Downloader
        visible={visible}
        progress={progress}
        onPressCancel={cancelDownloader}
      />
    </UniversalView>
  );
};

const CURRENT = 'current';
const LOCKED = 'locked';

const ModuleMyTestItem = ({
  id,
  title,
  attempts,
  certificate,
  attemptHistory = [],
  resultType,
  localization,
  onStartTest = () => undefined,
  onShowResult = () => undefined,
  onDownload = () => undefined,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const {settings} = useSettings();

  const usedAttempts = () => {
    const attempts = attemptHistory[attemptHistory?.length - 1]?.attempts;
    const result = isNaN(attempts) ? 0 : attempts;
    return result;
  };

  const getData = () => {
    const data = [...attemptHistory];
    if (usedAttempts() < attempts) {
      const currentAttempt = {
        status: CURRENT,
        attempts: usedAttempts() + 1,
      };
      data.push(currentAttempt);
      for (
        let attempt = 0;
        attempt < attempts - currentAttempt.attempts;
        attempt++
      ) {
        data.push({
          status: LOCKED,
          attempts: currentAttempt.attempts + attempt + 1,
        });
      }
    }
    return data;
  };

  const renderIcon = () => {
    if (usedAttempts() < attempts) {
      return (
        <View style={testItem.icon}>
          <PlayIcon size={0.6} />
        </View>
      );
    }
    return (
      <View
        style={[
          testItem.icon,
          {backgroundColor: 'green', paddingHorizontal: 5},
        ]}>
        {check()}
      </View>
    );
  };

  const renderText = () => {
    if (usedAttempts() < attempts) {
      return (
        <TextButton
          onPress={() => onStartTest(id)}
          style={testItem.button}
          textStyle={[testItem.buttonText]}
          text={lang('Пройти тест', localization)}
        />
      );
    }

    return (
      <TextButton
        onPress={() => undefined}
        style={testItem.button}
        text={lang('Тест пройден', localization)}
        textStyle={[testItem.buttonText, {color: 'green'}]}
      />
    );
  };

  const renderItem = ({item, index}) => {
    if (item?.status === CURRENT) {
      return (
        <TouchableOpacity onPress={() => onStartTest(id)} activeOpacity={0.88}>
          <RowView style={testItem.current}>
            <View style={[testItem.icon, {backgroundColor: APP_COLORS.input}]}>
              <PlayIcon size={0.6} color={APP_COLORS.primary} />
            </View>
            <Text style={testItem.attemptText}>
              {lang('Пройти', localization)}. {lang('Попытка', localization)}{' '}
              {item?.attempts}
            </Text>
          </RowView>
        </TouchableOpacity>
      );
    } else if (item?.status === LOCKED) {
      return (
        <RowView style={testItem.locked}>
          {lock()}
          <Text style={[testItem.attemptText, {color: APP_COLORS.placeholder}]}>
            {lang('Попытка', localization)} {item?.attempts}.{' '}
            {lang('Пройдите предыдущий тест, чтобы начать.', localization)}
          </Text>
        </RowView>
      );
    }

    return (
      <TouchableOpacity
        style={[
          testItem.attempt,
          {
            borderTopWidth: index ? 0.35 : 0,
          },
        ]}
        onPress={() => onShowResult(item?.id, resultType)}
        activeOpacity={0.88}>
        <RowView style={[testItem.attemptRow, {marginBottom: 10}]}>
          <RowView>
            <View style={[testItem.icon, {backgroundColor: APP_COLORS.input}]}>
              <PlayIcon size={0.6} color={APP_COLORS.primary} />
            </View>
            <Text style={testItem.attemptText}>
              {lang('Попытка', localization)} {item?.attempts}
            </Text>
          </RowView>
          <RowView>
            <TimeIcon color={APP_COLORS.placeholder} />
            <Text style={testItem.time}>{getTimeString(item?.time_score)}</Text>
          </RowView>
        </RowView>
        <Text style={testItem.time}>
          {lang('БАЛЛ', localization)} {item?.percent}%・
          {wordLocalization(lang(':num из :count', localization), {
            num: item?.score,
            count: item?.tests_count,
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={testItem.container}>
      <Text style={testItem.title}>{title}</Text>
      <Text style={testItem.attempts}>
        {wordLocalization(
          lang('Пройдено: :num1 из :num2 тестов', localization),
          {
            num1: usedAttempts(),
            num2: attempts,
          },
        )}
      </Text>
      {certificate && settings?.modules_enabled_certificates ? (
        <TextButton
          onPress={() => onDownload(certificate?.file)}
          style={testItem.button}
          textStyle={testItem.buttonText}
          text={lang('Скачать сертификат', localization)}
        />
      ) : null}
      <Divider isAbsolute={false} style={testItem.divider} />
      <RowView style={testItem.row}>
        <RowView style={testItem.row1}>
          {renderIcon()}
          {renderText()}
        </RowView>
        <TouchableOpacity
          onPress={() => setIsCollapsed(prev => !prev)}
          activeOpacity={0.7}>
          <RowView style={testItem.row2}>
            <Text style={testItem.attemptsLeft}>
              {wordLocalization(
                lang('Осталось :attempts попытки', localization),
                {
                  attempts: attempts - usedAttempts(),
                },
              )}
            </Text>
            <View>{isCollapsed ? down : up}</View>
          </RowView>
        </TouchableOpacity>
      </RowView>
      <Collapsible collapsed={isCollapsed}>
        <FlatList
          data={getData()}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          bounces={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          initialNumToRender={getData()?.length}
        />
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footer: {
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const testItem = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 0.45,
    borderColor: APP_COLORS.border,
  },
  row: {
    justifyContent: 'space-between',
  },
  row1: {
    alignItems: 'center',
  },
  category: {
    ...setFontStyle(11, '600', APP_COLORS.placeholder),
    textTransform: 'uppercase',
  },
  time: {
    ...setFontStyle(10, '600', APP_COLORS.placeholder),
    marginLeft: 4,
  },
  title: {
    ...setFontStyle(17, '600'),
    marginVertical: 5,
  },
  attempts: {
    ...setFontStyle(12, '500', APP_COLORS.placeholder),
  },
  row2: {
    alignItems: 'center',
  },
  button: {
    marginTop: 0,
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 7,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    marginRight: 6,
  },
  divider: {
    marginVertical: 8,
  },
  attemptsLeft: {
    ...setFontStyle(13, '500', APP_COLORS.primary),
    marginRight: 6,
  },
  attempt: {
    flex: 1,
    paddingVertical: 12,
    borderColor: APP_COLORS.border,
  },
  attemptText: {
    ...setFontStyle(13, '500'),
    flex: 1,
  },
  attemptRow: {
    justifyContent: 'space-between',
  },
  current: {
    paddingVertical: 16,
    borderTopWidth: 0.35,
    borderColor: APP_COLORS.border,
  },
  locked: {
    paddingVertical: 16,
    borderTopWidth: 0.35,
    borderColor: APP_COLORS.border,
  },
});

export default MyTestsTab;
