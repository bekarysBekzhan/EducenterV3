import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {useSettings} from '../../components/context/Provider';
import Empty from '../../components/Empty';
import JournalItem from '../../components/item/JournalItem';
import Loader from '../../components/Loader';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import UniversalView from '../../components/view/UniversalView';
import {TYPE_SUBCRIBES} from '../../constans/constants';
import {useFetching} from '../../hooks/useFetching';
import {JournalService} from '../../services/API';

const JournalsScreen = ({navigation}) => {
  const {isAuth} = useSettings();

  const [dataSource, setDataSource] = useState({
    page: 1,
    lastPage: null,
    refreshing: false,
    loadMore: false,
    list: [],
  });

  const [fetchJornals, loading, error] = useFetching(async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await JournalService.fetchJournals(params);
    setDataSource(prev => ({
      ...prev,
      list: response?.data?.data?.data,
      lastPage: response?.data?.data?.last_page,
      refreshing: false,
    }));
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
    };
    const response = await JournalService.fetchJournals(params);
    setDataSource(prev => ({
      ...prev,
      list: prev?.data?.concat(response?.data?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
  };

  const onRefresh = () => {
    setDataSource(prev => ({
      ...prev,
      page: 1,
      lastPage: null,
      loadMore: false,
      refreshing: true,
    }));
    if (dataSource?.page == 1) {
      fetchJornals();
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

  useEffect(() => {
    if (dataSource?.page == 1) {
      fetchJornals();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

  const renderFooter = () => {
    if (dataSource?.loadMore) {
      return <Loader />;
    }
    return null;
  };

  const onNav = item => {
    if (isAuth) {
      item?.has_subscribed
        ? navigation.navigate(ROUTE_NAMES.readJournal, {readJournal: item})
        : navigation.navigate(ROUTE_NAMES.operation, {
            operation: item,
            type: TYPE_SUBCRIBES.JOURNAL_SUBCRIBE,
            previousScreen: ROUTE_NAMES.journalNavigator,
            onRefresh: onRefresh
          });
    } else {
      navigation.navigate(ROUTE_NAMES.login);
    }
  };

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const renderItem = ({item, index}) => (
    <JournalItem
      item={item}
      source={item?.poster}
      title={item?.title}
      year={item?.year}
      price={item?.price}
      old_price={item?.old_price}
      has_subscribed={item?.has_subscribed}
      onPress={onNav}
    />
  );

  const renderEmpty = <Empty />;

  return (
    <UniversalView haveLoader={loading}>
      <FlatList
        data={dataSource?.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        refreshing={dataSource?.refreshing}
        showsVerticalScrollIndicator={false}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

export default JournalsScreen;
