import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useLayoutEffect } from 'react';
import UniversalView from '../../../components/view/UniversalView';
import SearchButton from '../../../components/button/SearchButton';
import { useFetching } from '../../../hooks/useFetching';
import { CourseService } from '../../../services/API';
import { useState } from 'react';
import { APP_COLORS, N_STATUS, WIDTH } from '../../../constants/constants';
import { useEffect } from 'react';
import { setFontStyle } from '../../../utils/utils';
import LoadingScreen from '../../../components/LoadingScreen';
import Empty from '../../../components/Empty';
import WhatsappButton from '../../../components/button/WhatsappButton';
import { useSettings } from '../../../components/context/Provider';
import { DefaultCard } from './designType/DefaultCard';
import { MiniCard } from './designType/MiniCard';
import { DoubleCard } from './designType/DoubleCard';
import HeaderBar from '../../../components/HeaderBar';
import { lang } from '../../../localization/lang';
import { useLocalization } from '../../../components/context/LocalizationProvider';
import { navHeaderOptions } from '../../../components/navigation/navHeaderOptions';
import { SearchIcon } from '../../../assets/icons';
import { ROUTE_NAMES } from '../../../components/navigation/routes';

const CoursesScreen = props => {
  const { nstatus, nCourse } = useSettings();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [data, setData] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);
  const localization = useLocalization();
  let route = ROUTE_NAMES.courseSearch;
  const [fetchCourses, isLoading, coursesError] = useFetching(async () => {
    const response = await CourseService.fetchCourses();
    setData(response.data?.data);
    setFilters(response.data?.filters);
    setLastPage(response.data?.last_page);
  });

  useLayoutEffect(() => {
    let navigationOptions = navHeaderOptions(
      lang('Курсы', localization),
    );
    navigationOptions.headerRight = renderHeaderRight;
    navigationOptions.headerLeft = null;
    navigationOptions.headerTitleAlign = 'center';
    props.navigation.setOptions(navigationOptions);
  }, []);

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => props.navigation.navigate(route, { filters })}
      style={styles.iconButton}
      activeOpacity={0.65}
    >
      <SearchIcon />
    </TouchableOpacity>
  );

  useEffect(() => {
    if (page === 1) {
      fetchCourses();
    } else {
      fetchNextPage();
    }
  }, [page]);

  const fetchNextPage = async () => {
    const response = await CourseService.fetchCourses('', page);
    setData(data.concat(response.data?.data));
    setLoadingNext(false);
  };

  const onEndReached = () => {
    if (page < lastPage && !loadingNext) {
      setLoadingNext(true);
      setPage(prev => prev + 1);
    }
  };

  const renderCourse = ({ item, index }) => {
    if (nCourse == '1') {
      return (
        <MiniCard item={item} index={index} navigation={props?.navigation} />
      );
    }
    if (nCourse == '2') {
      return (
        <DoubleCard item={item} index={index} navigation={props?.navigation} />
      );
    }

    return (
      <DefaultCard item={item} index={index} navigation={props?.navigation} />
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {loadingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView style={styles.universalView}>
      <View style={styles.primaryView}>
        <FlatList
          data={data}
          numColumns={nCourse === '2' ? 2 : 1}
          renderItem={renderCourse}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={<Empty />}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          onEndReached={onEndReached}
          refreshing={isLoading}
          onRefresh={() => {
            if (page === 1) {
              fetchCourses();
            }
            setPage(1);
          }}
        />
      </View>
      {nstatus === N_STATUS ? null : <WhatsappButton />}
    </UniversalView>
  );
};

export const styles = StyleSheet.create({
  universalView: {
    backgroundColor: APP_COLORS.primary,
  },
  primaryView: {
    borderRadius: 20,
    backgroundColor: APP_COLORS.white,
  },
  contentContainer: {
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

export default CoursesScreen;
