import React, {useEffect, useLayoutEffect, useState} from 'react';
// import {Linking} from 'react-native';
import WebView from 'react-native-webview';
import UniversalView from '../../components/view/UniversalView';
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

    // if (type?.type == 'cloudpayments') {
    //   Linking.openURL(res?.request?.responseURL);
    // }

    setDataSource(prev => ({
      ...prev,
      data: res?.data,
    }));
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <UniversalView haveLoader={loading}>
      <WebView
        startInLoadingState
        source={{
          html: dataSource?.data,
        }}
      />
    </UniversalView>
  );
};

export default WebViewer;
