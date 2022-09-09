import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useSettings} from '../../components/context/Provider';
import Empty from '../../components/Empty';
import JournalItem from '../../components/item/JournalItem';
import Loader from '../../components/Loader';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {JournalService} from '../../services/API';

const MyJournalScreen = ({navigation}) => {
  const {isAuth} = useSettings();

  const [dataSource, setDataSource] = useState({
    page: 1,
    lastPage: null,
    refreshing: false,
    loadMore: false,
    list: [],
  });

  const [fetchMyJournal, loading, error] = useFetching(async () => {
    const response = await JournalService.fetchMyJournals();
    setDataSource(prev => ({
      ...prev,
      list: response?.data?.data?.data,
      refreshing: false,
      loadMore: false,
      lastPage: response?.data?.data?.last_page,
    }));
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await JournalService.fetchMyJournals(params);
    setDataSource(prev => ({
      ...prev,
      list: prev?.data?.concat(response?.data?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
  };

  useEffect(() => {
    const unsubcribeFocus = navigation.addListener('tabPress', e => {
      if (!isAuth) {
        e.preventDefault();
      } else {
        if (dataSource?.page == 1) {
          fetchMyJournal();
        } else {
          fetchNextPage();
        }
      }
    });

    return () => unsubcribeFocus;
  }, [dataSource?.page]);

  const onRefresh = () => {
    setDataSource(prev => ({
      ...prev,
      page: 1,
      lastPage: null,
      loadMore: false,
      refreshing: true,
    }));
    if (dataSource?.page == 1) {
      fetchMyJournal();
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

  const onNav = useCallback(item => {
    console.log('onNav', item);
    if (item?.file) {
      navigation.navigate(ROUTE_NAMES.readJournal, {readJournal: item});
    }
  }, []);

  const keyExtractor = item => item?.id?.toString();

  const renderItem = useCallback(
    ({item, index}) => (
      <JournalItem
        item={item}
        source={item?.journal?.poster}
        title={item?.title}
        number={item?.number}
        showPrice={false}
        hasFile={item?.file}
        onPress={onNav}
      />
    ),
    [],
  );

  const renderEmpty = <Empty />;

  return (
    <UniversalView haveLoader={loading}>
      <FlatList
        data={dataSource?.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onRefresh={onRefresh}
        refreshing={dataSource?.refreshing}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

export default MyJournalScreen;
