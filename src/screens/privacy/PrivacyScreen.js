import {FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import PrivacyItem from '../../components/item/PrivacyItem';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import {useFetching} from '../../hooks/useFetching';
import {PolicyService} from '../../services/API';

const PrivacyScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    data: [],
  });

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
        contentContainerStyle={styles.list}
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
