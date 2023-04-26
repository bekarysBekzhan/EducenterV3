import {StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import HtmlView from '../../components/HtmlView';
import {useFetching} from '../../hooks/useFetching';
import {PolicyService} from '../../services/API';
import {APP_COLORS} from '../../constans/constants';
import { useLocalization } from '../../components/context/LocalizationProvider';
import { lang } from '../../localization/lang';

const PolicyScreen = ({navigation, route}) => {
  const id = route?.params?.id;

  const {localization} = useLocalization();


  const [dataSource, setDataSource] = useState({
    data: '',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: lang('Правила и соглашения', localization),
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
      contentContainerStyle={styles.content}
      overScrollMode={'never'}>
      <HtmlView
        html={dataSource?.data?.description}
        tagsStyles={{
          p: {color: APP_COLORS.font},
          span: {color: APP_COLORS.font},
        }}
      />
    </UniversalView>
  );
};

export default PolicyScreen;

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
});
