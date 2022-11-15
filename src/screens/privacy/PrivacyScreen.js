import {FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import PrivacyItem from '../../components/item/PrivacyItem';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import {useFetching} from '../../hooks/useFetching';
import {PolicyService} from '../../services/API';
import {strings} from '../../localization';
import Empty from '../../components/Empty';

const PrivacyScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    data: [],
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings['Правила и соглашения'],
      headerTitleAlign: 'center',
    });
  }, []);

  const [fetchPage, loading, error] = useFetching(async () => {
    const response = await PolicyService.fetchPage();
    console.log('PrivacyScreen fetchPage: ', response);
    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
    }));
  }, []);

  useEffect(() => {
    fetchPage();
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <PrivacyItem
        item={item}
        title={item?.title}
        onPress={() =>
          navigation.navigate(ROUTE_NAMES.privacyPolicy, {id: item?.id})
        }
      />
    ),
    [],
  );

  const keyExtractor = useCallback((_, index) => index, []);

  return (
    <UniversalView haveLoader={loading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={() => <Empty />}
        contentContainerStyle={styles.list}
        initialNumToRender={20}
      />
    </UniversalView>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});
