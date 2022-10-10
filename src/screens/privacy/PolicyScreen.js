import {StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import HtmlView from '../../components/HtmlView';
import {useFetching} from '../../hooks/useFetching';
import {PolicyService} from '../../services/API';

const PolicyScreen = ({route}) => {
  const id = route?.params?.id;

  const [dataSource, setDataSource] = useState({
    data: '',
  });

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
