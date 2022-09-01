import React, {useEffect, useLayoutEffect, useState} from 'react';
// import {Linking} from 'react-native';
import WebView from 'react-native-webview';
import UniversalView from '../../components/view/UniversalView';
import {DOMAIN} from '../../constans/constants';
import {useFetching} from '../../hooks/useFetching';
import {OperationService} from '../../services/API';

const WebViewer = ({navigation, route}) => {
  const {webViewer, type, mode} = route?.params;

  console.log('----> params: ', webViewer, type);

  const [dataSource, setDataSource] = useState({
    data: null,
    loading: true,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: type?.title,
      headerTitleAlign: 'center',
    });
  }, []);

  const [fetchData, loading, error] = useFetching(async () => {
    let params = {
      json: true,
    };

    if (mode?.period_id && mode?.period_id?.hasOwnProperty('period')) {
      params.period_id = mode?.period_id?.id;
    } else if (mode?.packet_id) {
      params.packet_id = mode?.packet_id?.id;
    }

    if (mode?.promocode) {
      params.promocode = mode?.promocode;
    }

    params.useBonuses = mode?.useBonuses;

    const res = await OperationService.fetchData(
      webViewer?.id,
      type?.type,
      params,
    );

    setDataSource(prev => ({
      ...prev,
      data:
        type?.type == 'kaspi_ur' ? {uri: res?.data?.link} : {html: res?.data},
    }));
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        navigation?.goBack();
      }, 1600);
    }
  }, [error]);

  return (
    <UniversalView haveLoader={loading}>
      <WebView startInLoadingState source={dataSource?.data} />
    </UniversalView>
  );
};

export default WebViewer;
