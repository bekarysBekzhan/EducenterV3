import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import SearchButton from '../../components/button/SearchButton';
import { useSettings } from '../../components/context/Provider';
import Empty from '../../components/Empty';
import ItemRating from '../../components/ItemRating';
import LoadingScreen from '../../components/LoadingScreen';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import Price from '../../components/Price';
import RowView from '../../components/view/RowView';
import UniversalView from '../../components/view/UniversalView';
import {APP_COLORS, N_STATUS, WIDTH} from '../../constants/constants';
import {useFetching} from '../../hooks/useFetching';
import {CourseService} from '../../services/API';
import {setFontStyle} from '../../utils/utils';
import SmallHeaderBar from '../../components/SmallHeaderBar';
import { lang } from '../../localization/lang';
import { useLocalization } from '../../components/context/LocalizationProvider';
import { navHeaderOptions } from '../../components/navigation/navHeaderOptions';
import { SearchIcon } from '../../assets/icons';

const OfflineCourseScreen = props => {

  const { nstatus } = useSettings();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(null);
  const [lastPage, setLastPage] = useState(1);
  const [data, setData] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);
  let route = ROUTE_NAMES.offlineCourseSearchScreen;
  const [fetchCourses, isLoading, coursesError] = useFetching(async () => {
    const response = await CourseService.fetchOfflineCourses();
    setData(response.data?.data);
    setFilters(response.data?.filters);
    setLastPage(response.data?.last_page);
  });

  useLayoutEffect(() => {
    let navigationOptions = navHeaderOptions(
      lang('Офлайн курсы', localization),
    );
    navigationOptions.headerRight = renderHeaderRight;
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
    const response = await CourseService.fetchOfflineCourses('', page);
    setData(data.concat(response.data?.data));
    setLoadingNext(false);
  };

  const onEndReached = () => {
    if (page < lastPage && !loadingNext) {
      setLoadingNext(true);
      setPage(prev => prev + 1);
    }
  };

  const renderCourse = ({item, index}) => {
    return (
      <CourseCard item={item} index={index} navigation={props?.navigation} />
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {loadingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  const { localization } = useLocalization();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <FlatList
        data={data}
        renderItem={renderCourse}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => <Empty />}
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
    </UniversalView>
  );
};

const CourseCard = ({item, index, navigation}) => {
  const onCourse = () => {
    navigation.navigate(ROUTE_NAMES.offlineCourseDetailsScreen, {
      courseID: item?.id,
    });
  };

  return (
    <TouchableOpacity
      style={styles.courseCard}
      activeOpacity={0.9}
      onPress={onCourse}>
      <FastImage source={{uri: item?.poster, priority: "high"}} style={styles.poster} />
      <RowView style={styles.row1}>
        <Text style={styles.category}>{item?.category_name}</Text>
        <Price
          price={item?.price}
          oldPrice={item?.old_price}
          priceStyle={styles.price}
          oldPriceStyle={styles.price}
        />
      </RowView>
      <Text style={styles.title} numberOfLines={2}>
        {item?.title}
      </Text>
      <RowView style={styles.row2}>
        <Text>{item?.name}</Text>
        <ItemRating
          rating={item?.rating}
          reviewCount={item?.reviews_count}
          starSize={16}
        />
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  courseCard: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOpacity: 0.09,
    elevation: 1,
  },
  row1: {
    justifyContent: 'space-between',
    padding: 10,
    paddingBottom: 0,
  },
  row2: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  title: {
    margin: 10,
    ...setFontStyle(18, '700'),
  },
  category: {
    textTransform: 'uppercase',
    ...setFontStyle(14, '700', APP_COLORS.placeholder),
  },
  poster: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  price: {
    fontSize: 14,
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

export default OfflineCourseScreen;
