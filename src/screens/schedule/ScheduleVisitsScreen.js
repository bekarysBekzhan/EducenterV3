import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import Empty from '../../components/Empty';
import ScheduleVisitItem from '../../components/item/ScheduleVisitItem';
import Loader from '../../components/Loader';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {ScheduleService} from '../../services/API';
import {setFontStyle} from '../../utils/utils';

const ScheduleVisitsScreen = () => {
  const [dataSource, setDataSource] = useState({
    page: 1,
    refreshing: false,
    lastPage: null,
    loadMore: false,
    list: [],
  });

  const [fetchScheduleVisitis, isLoading, error] = useFetching(async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await ScheduleService.fetchScheduleVisitis(params);
    setDataSource(prev => ({
      ...prev,
      list: response?.data?.data?.data,
      lastPage: response?.data?.data,
      refreshing: false,
      loadMore: false,
    }));
  });

  const onRefresh = () => {
    setDataSource(prev => ({
      ...prev,
      refreshing: true,
      loadMore: false,
      page: 1,
    }));
    if (dataSource?.page == 1) {
      fetchScheduleVisitis();
    }
  };

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await ScheduleService.fetchScheduleVisitis(params);
    setDataSource(prev => ({
      ...prev,
      data: prev?.data?.concat(response?.data?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
  };

  useEffect(() => {
    if (dataSource?.page == 1) {
      fetchScheduleVisitis();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

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

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const renderItem = useCallback(
    ({item, index}) => (
      <View>
        <Text style={styles.title}>{item?.name}</Text>
        <ScheduleVisitItem data={item?.attendances} />
      </View>
    ),
    [],
  );

  const renderEmpty = <Empty style={styles.empty} />;

  const renderFooter = () => {
    if (dataSource?.loadMore) {
      return <Loader style={styles.loader} />;
    }
    return null;
  };

  return (
    <UniversalView haveLoader={isLoading}>
      <FlatList
        data={dataSource?.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshing={dataSource?.refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: 16,
  },
  title: {
    ...setFontStyle(17, '600'),
    marginHorizontal: 16,
    marginBottom: 8,
  },
  empty: {
    marginTop: 0,
  },
  loader: {
    marginVertical: 16,
  },
});

export default ScheduleVisitsScreen;
