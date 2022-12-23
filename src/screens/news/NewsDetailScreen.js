import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import HtmlView from '../../components/HtmlView';
import {NewsService} from '../../services/API';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../utils/utils';
import DateFormat from '../../components/DateFormat';
import {storeObject} from '../../storage/AsyncStorage';
import {STORAGE} from '../../constans/constants';
import {useSettings} from '../../components/context/Provider';

const NewsDetailScreen = ({navigation, route}) => {
  const {onNotification, newsId} = route?.params;

  const {settings} = useSettings();

  const [dataSource, setDataSource] = useState({
    data: '',
  });
  console.log('====', route);
  const [fetchNewsDetail, isLoading, error] = useFetching(async () => {
    const response = await NewsService.fetchNewsDetail(newsId);
    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
    }));
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: settings?.modules_enabled_news_title,
      headerTitleAlign: 'center',
    });
  }, []);

  const markRead = async () => {
    await storeObject(STORAGE.isRead, true);
    if (global?.setIsRead) {
      global?.setIsRead(true);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
    if (onNotification) {
      markRead();
    }
  }, []);

  return (
    <UniversalView
      haveLoader={isLoading}
      haveScroll
      contentContainerStyle={styles.view} overScrollMode={'never'}>
      <Text style={styles.title}>{dataSource?.data?.title}</Text>
      <View style={styles.date}>
        <DateFormat date={dataSource?.data?.added_at} />
      </View>
      <FastImage
        style={styles.poster}
        source={{uri: dataSource?.data?.poster, priority: "high"}}
      />
      <HtmlView html={dataSource?.data?.description} />
    </UniversalView>
  );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
  view: {
    padding: 16,
  },
  title: {
    ...setFontStyle(28, '700'),
    marginBottom: 8,
    textAlign: 'center',
  },
  date: {
    alignSelf: 'center',
  },
  poster: {
    width: '100%',
    height: 200,
    marginTop: 8,
    marginBottom: 16,
  },
});
