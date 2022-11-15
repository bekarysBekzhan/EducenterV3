import {FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {NewsService} from '../../services/API';
import NewsCard from '../../components/news/NewsCard';
import Loader from '../../components/Loader';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import Empty from '../../components/Empty';

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
      data: response?.data?.data?.data,
      lastPage: response?.data?.data?.last_page,
      refreshing: false,
      loadMore: false,
    }));
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await NewsService.fetchNews(params);
    setDataSource(prev => ({
      ...prev,
      data: prev?.data?.concat(response?.data?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
  };

  useEffect(() => {
    if (dataSource?.page == 1) {
      fetchNews();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const onItem = useCallback(item => {
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

  const onRefresh = () => {
    setDataSource(prev => ({
      ...prev,
      page: 1,
      lastPage: null,
      loadMore: false,
      refreshing: true,
    }));
    if (dataSource?.page == 1) {
      fetchNews();
    }
  };

  const onEndReached = () => {
    if (!dataSource?.loadMore) {
      if (dataSource?.page < dataSource?.lastPage) {
        setDataSource(prev => ({
          ...prev,
          loadMore: true,
          refreshing: false,
          page: prev?.page + 1,
        }));
      }
    }
  };

  const renderFooter = () => {
    if (dataSource?.loadMore) {
      return <Loader />;
    }
    return null;
  };

  return (
    <UniversalView haveLoader={isLoading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={() => <Empty />}
        contentContainerStyle={styles.list}
        refreshing={dataSource?.refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
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
