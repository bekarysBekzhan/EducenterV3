import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Empty from '../../components/Empty';
import ScheduleLessonItem from '../../components/item/ScheduleLessonItem';
import Loader from '../../components/Loader';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {ScheduleService} from '../../services/API';

const ScheduleLessons = () => {
  const [dataSource, setDataSource] = useState({
    refreshing: false,
    loadMore: false,
    list: [],
    page: 1,
    lastPage: null,
  });

  const [fetchScheduleLessons, isLoading, error] = useFetching(async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await ScheduleService.fetchScheduleLessons(params);
    setDataSource(prev => ({
      ...prev,
      list: response?.data?.data?.data,
      lastPage: response?.data?.data?.last_page,
      refreshing: false,
      loadMore: false,
    }));
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await ScheduleService.fetchScheduleLessons(params);
    setDataSource(prev => ({
      ...prev,
      list: prev?.list?.concat(response?.data?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
  };

  useEffect(() => {
    if (dataSource?.page == 1) {
      fetchScheduleLessons();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

  const onRefresh = () => {
    setDataSource(prev => ({
      ...prev,
      refreshing: true,
      loadMore: false,
      page: 1,
      lastPage: null,
    }));
    if (dataSource?.page == 1) {
      fetchScheduleLessons();
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

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const renderItem = useCallback(
    ({item, index}) => (
      <ScheduleLessonItem
        avatar={item?.teacher?.avatar}
        name={
          item?.teacher
            ? item?.teacher?.name + ' ' + item?.teacher?.surname
            : null
        }
        category={item?.name}
        item={item}
        link={item?.link}
      />
    ),
    [],
  );

  const renderEmpty = <Empty />;

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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
  },
  loader: {
    marginVertical: 16,
  },
});

export default ScheduleLessons;
