import {StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import HtmlView from '../../components/HtmlView';
import {useFetching} from '../../hooks/useFetching';
import {PolicyService} from '../../services/API';
import {strings} from '../../localization';

const PolicyScreen = ({navigation, route}) => {
  const id = route?.params?.id;

  const [dataSource, setDataSource] = useState({
    data: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings['Правила и соглашения'],
      headerTitleAlign: 'center',
    });
  }, []);

  const [fetchPage, loading, error] = useFetching(async () => {
    const response = await PolicyService.fetchPageById(id);
    console.log('fetchPage: ', response);
    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
    }));
  }, []);

  useEffect(() => {
    fetchPage();
  }, []);

  return (
    <UniversalView
      haveScroll
      haveLoader={loading}
      contentContainerStyle={styles.content}>
      <HtmlView html={dataSource?.data?.description} />
    </UniversalView>
  );
};

export default PolicyScreen;

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
