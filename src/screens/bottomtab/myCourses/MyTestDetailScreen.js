import React, {useEffect, useState} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import DetailView from '../../../components/view/DetailView';
import {useFetching} from '../../../hooks/useFetching';
import {TestService} from '../../../services/API';
import LoadingScreen from '../../../components/LoadingScreen';
import Person from '../../../components/Person';
import TransactionButton from '../../../components/button/TransactionButton';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import {useLocalization} from '../../../components/context/LocalizationProvider';
import {lang} from '../../../localization/lang';
import SmallHeaderBar from '../../../components/SmallHeaderBar';

const MyTestDetailScreen = props => {
  const id = props.route?.params?.id;
  const {localization} = useLocalization();

  const [data, setData] = useState(null);
  const [fetchTest, isFetching, fetchingError] = useFetching(async () => {
    const response = await TestService.fetchTestByID(id);
    setData(response.data?.data);
  });

  useEffect(() => {
    fetchTest();
  }, []);

  useEffect(() => {
    if (fetchingError) {
      console.log(fetchingError);
    }
  }, [fetchingError]);

  const onNavigation = () => {
    props.navigation.navigate(ROUTE_NAMES.testPreview, {
      id: data?.id,
      title: data?.title,
      type: 'module',
    });
  };

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
        text={lang('Пройти тест', localization)}
        onPress={onNavigation}
      />
    </UniversalView>
  );
};

export default MyTestDetailScreen;
