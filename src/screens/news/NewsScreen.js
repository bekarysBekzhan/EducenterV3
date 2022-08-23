import {FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState, Fragment} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {NewsService} from '../../services/API';
import NewsCard from '../../components/news/NewsCard';
import Loader from '../../components/Loader';
import {ROUTE_NAMES} from '../../components/navigation/routes';

const NewsScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    data: [],
    page: 1,
    lastPage: null,
    loadMore: false,
    refreshing: false,
  });

  const [fetchNews, isLoading, error] = useFetching(async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await NewsService.fetchNews(params);
    setDataSource(prev => ({
      ...prev,
      data:
        dataSource?.page == 1
          ? response?.data?.data?.data
          : prev?.data?.concat(response?.data?.data?.data),
      page: response?.data?.data?.current_page,
      lastPage: response?.data?.data?.last_page,
      refreshing: false,
      loadMore: false,
    }));
  });

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (dataSource?.refreshing || dataSource?.loadMore) {
      fetchNews();
    }
  }, [dataSource?.loadMore, dataSource?.refreshing]);

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const onItem = useCallback(item => {
    console.log(item);
    navigation.navigate(ROUTE_NAMES.newsDetail, {newsId: item?.id});
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <NewsCard
        item={item}
        title={item?.title}
        source={item?.poster}
        date={item?.added_at}
        onPress={onItem}
      />
    ),
    [],
  );

  const onRefresh = useCallback(() => {
    setDataSource(prev => ({
      ...prev,
      page: 1,
      lastPage: null,
      loadMore: false,
      refreshing: true,
    }));
  }, []);

  const onEndReached = useCallback(() => {
    if (dataSource?.page < dataSource?.lastPage) {
      setDataSource(prev => ({
        ...prev,
        page: prev?.page + 1,
        refreshing: false,
        loadMore: true,
      }));
    }
  }, [isLoading]);

  const renderFooter = useCallback(
    () => <Fragment>{dataSource?.loadMore ? <Loader /> : null}</Fragment>,
    [dataSource?.loadMore],
  );

  return (
    <UniversalView haveLoader={isLoading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        refreshing={dataSource?.refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.01}
        onEndReached={onEndReached}
        ListFooterComponent={renderFooter}
      />
    </UniversalView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});
