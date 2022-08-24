import {FlatList, LogBox, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import {useFetching} from '../hooks/useFetching';
import HistoryItem from '../components/HistoryItem';
import {HistoryService} from '../services/API';
import Loader from '../components/Loader';

const HistoryScreen = () => {
  const [dataSource, setDataSource] = useState({
    data: [],
    page: 1,
    lastPage: null,
    refreshing: false,
    loadMore: false,
  });

  const [fectHistory, isLoading, error] = useFetching(async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await HistoryService.fetchHistory(params);
    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data?.orders?.data,
      lastPage: response?.data?.data?.orders?.last_page,
      refreshing: false,
      loadMore: false,
    }));
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await HistoryService.fetchHistory(params);
    setDataSource(prev => ({
      ...prev,
      data: prev?.data?.concat(response?.data?.data?.orders?.data),
      refreshing: false,
      loadMore: false,
    }));
  };

  useEffect(() => {
    if (dataSource?.page == 1) {
      fectHistory();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const renderItem = useCallback(
    ({item}) => (
      <HistoryItem
        title={item?.entity?.title}
        date={item?.added_at}
        price={item?.cost}
        iconType={item?.type}
      />
    ),
    [],
  );

  const onRefresh = useCallback(() => {
    setDataSource(prev => ({
      ...prev,
      refreshing: true,
      loadMore: false,
      page: 1,
      lastPage: null,
    }));
  });

  const onEndReached = () => {
    console.log('lastPage', dataSource?.lastPage);
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
      return <Loader style={styles.loader} />;
    }
    return null;
  };

  return (
    <UniversalView haveLoader={isLoading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={dataSource?.refreshing}
        onRefresh={onRefresh}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
        initialNumToRender={20}
        ListFooterComponent={renderFooter}
      />
    </UniversalView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  loader: {
    marginVertical: 16,
  },
});
