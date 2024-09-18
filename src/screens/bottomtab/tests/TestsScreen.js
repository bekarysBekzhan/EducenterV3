import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import UniversalView from '../../../components/view/UniversalView';
import { useFetching } from '../../../hooks/useFetching';
import LoadingScreen from '../../../components/LoadingScreen';
import SearchButton from '../../../components/button/SearchButton';
import ModuleTestItem from '../../../components/test/ModuleTestItem';
import { TestService } from '../../../services/API';
import { APP_COLORS, N_STATUS, WIDTH } from '../../../constants/constants';
import { ROUTE_NAMES } from '../../../components/navigation/routes';
import Empty from '../../../components/Empty';
import WhatsappButton from '../../../components/button/WhatsappButton';
import { useSettings } from '../../../components/context/Provider';
import HeaderBar from '../../../components/HeaderBar';
import { lang } from '../../../localization/lang';
import { useLocalization } from '../../../components/context/LocalizationProvider';
import { navHeaderOptions } from '../../../components/navigation/navHeaderOptions';
import { BellIcon, SearchIcon } from '../../../assets/icons';

const TestsScreen = props => {
  const { nstatus, isAuth, settings } = useSettings();
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const localization = useLocalization();
  let route = ROUTE_NAMES.testSearch;
  const [fetchTests, isFetching] = useFetching(async () => {
    const response = await TestService.fetchTests();
    setData(response.data?.data);
    setFilters(response.data?.filters);
    setLastPage(response.data?.last_page);
  });
  const [fetchNext, isFetchingNext] = useFetching(
    async () => {
      const response = await TestService.fetchTests('', page);
      setData(prev => prev.concat(response.data?.data));
    },
  );

  useLayoutEffect(() => {
    let navigationOptions = navHeaderOptions(
      lang('Тесты', localization),
    );
    navigationOptions.headerRight = renderHeaderRight;
    navigationOptions.headerLeft = null;
    navigationOptions.headerTitleAlign = 'center';
    props.navigation.setOptions(navigationOptions);
  }, []);

  useEffect(() => {
    global.fetchTests = fetchTests;
  }, []);

  useEffect(() => {
    if (page === 1) {
      fetchTests();
    } else {
      fetchNext();
    }
  }, [page]);

  const testItemTapped = item => {
    if (isAuth) {
      props.navigation.navigate(ROUTE_NAMES.testDetail, { id: item?.id });
    } else {
      props.navigation.navigate(ROUTE_NAMES.login);
    }
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate(route, { filters })}
      style={styles.iconButton}
      activeOpacity={0.65}
    >
      <SearchIcon />
    </TouchableOpacity>
  );

  const renderTest = ({ item, index }) => {
    return (
      <ModuleTestItem
        id={item?.id}
        index={index}
        categoryName={item?.category?.name}
        time={item?.timer}
        title={item?.title}
        attempts={item?.attempts}
        price={item?.price}
        oldPrice={item?.old_price}
        onPress={() => testItemTapped(item)}
        hasSubscribed={item?.has_subscribed}
      />
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1);
    }
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView style={{backgroundColor: settings?.color_app}}>
      <View style={styles.primaryView}>
        <FlatList
          data={data}
          contentContainerStyle={styles.container}
          renderItem={renderTest}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => <Empty />}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          refreshing={isFetching}
          onRefresh={() => {
            if (page === 1) {
              fetchTests();
            }
            setPage(1);
          }}
        />
      </View>
      <WhatsappButton />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  universalView: {
    backgroundColor: APP_COLORS.primary,
  },
  primaryView: {
    borderRadius: 20,
    backgroundColor: APP_COLORS.white,
  },
  container: {
    padding: 16,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default TestsScreen;
