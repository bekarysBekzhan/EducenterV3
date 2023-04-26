import React, {useEffect, useState} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import DetailView from '../../../components/view/DetailView';
import {useFetching} from '../../../hooks/useFetching';
import {TestService} from '../../../services/API';
import LoadingScreen from '../../../components/LoadingScreen';
import Person from '../../../components/Person';
import TransactionButton from '../../../components/button/TransactionButton';
import {useSettings} from '../../../components/context/Provider';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import {N_STATUS, TYPE_SUBCRIBES} from '../../../constans/constants';
import {useLocalization} from '../../../components/context/LocalizationProvider';
import {lang} from '../../../localization/lang';

const TestDetailScreen = props => {
  const id = props.route?.params?.id;

  const {localization} = useLocalization();

  const {isAuth, nstatus} = useSettings();
  const [data, setData] = useState(null);
  const [fetchTest, isFetching] = useFetching(async () => {
    const response = await TestService.fetchTestByID(id);
    setData(response.data?.data);
  });

  useEffect(() => {
    fetchTest();
  }, []);

  useEffect(() => {
    if (props.route?.params?.reloadTest) {
      fetchTest();
      if (global?.fetchTests) {
        global.fetchTests();
      }
    }
  }, [props.route?.params?.reloadTest]);

  const onNavigation = () => {
    if (isAuth) {
      if (data?.has_subscribed) {
        props.navigation.navigate(ROUTE_NAMES.testPreview, {
          id: data?.id,
          title: data?.title,
          type: 'module',
        });
      } else {
        props.navigation.navigate(ROUTE_NAMES.operation, {
          operation: data,
          type: TYPE_SUBCRIBES.TEST_SUBCRIBE,
          previousScreen: ROUTE_NAMES.testDetail,
        });
      }
    } else {
      props.navigation.navigate(ROUTE_NAMES.login);
    }
  };

  const getTransactionText = () => {
    if (nstatus === N_STATUS) {
      return lang('Пройти тест', localization);
    }

    if (data?.has_subscribed) {
      return lang('Пройти тест', localization);
    }
    if (data?.price) {
      return lang('Купить тест', localization);
    }
    return lang('Бесплатно', localization);
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <UniversalView haveScroll>
        <DetailView
          title={data?.title}
          poster={data?.poster}
          category={data?.category?.name}
          duration={data?.timer}
          description={data?.description}
        />
        <Person
          name={data?.author?.name}
          image={data?.author?.avatar}
          status={lang('Автор теста', localization)}
          description={data?.author?.description}
          extraStyles={{
            margin: 16,
            marginTop: 32,
          }}
        />
      </UniversalView>
      <TransactionButton
        text={getTransactionText()}
        onPress={onNavigation}
        oldPrice={data?.has_subscribed ? 0 : data?.old_price}
        price={data?.has_subscribed ? 0 : data?.price}
      />
    </UniversalView>
  );
};

export default TestDetailScreen;
