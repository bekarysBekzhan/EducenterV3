import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import HtmlView from '../../components/HtmlView';
import {NewsService} from '../../services/API';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../utils/utils';
import DateFormat from '../../components/DateFormat';

const NewsDetailScreen = ({route}) => {
  const [dataSource, setDataSource] = useState({
    data: '',
  });
  console.log('====', route);
  const [fetchNewsDetail, isLoading, error] = useFetching(async () => {
    const response = await NewsService.fetchNewsDetail(route?.params?.newsId);
    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
    }));
  });

  useEffect(() => {
    fetchNewsDetail();
  }, []);

  return (
    <UniversalView
      haveLoader={isLoading}
      haveScroll
      contentContainerStyle={styles.view}>
      <Text style={styles.title}>{dataSource?.data?.title}</Text>
      <View style={styles.date}>
        <DateFormat date={dataSource?.data?.added_at} />
      </View>
      <FastImage
        style={styles.poster}
        source={{uri: dataSource?.data?.poster}}
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
