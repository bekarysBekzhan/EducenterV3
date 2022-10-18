import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React from 'react';
import UniversalView from '../components/view/UniversalView';
import RowView from '../components/view/RowView';
import {clear, filter, filterON, search, x} from '../assets/icons';
import Input from '../components/Input';
import {strings} from '../localization';
import {APP_COLORS, STORAGE, WIDTH} from '../constans/constants';
import {isValidText, setFontStyle} from '../utils/utils';
import SectionView from '../components/view/SectionView';
import {useState} from 'react';
import CourseRow from '../components/CourseRow';
import {CourseService} from '../services/API';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import BottomSheetStack from '../components/navigation/BottomSheetStack';
import {useRef} from 'react';
import {useMemo} from 'react';
import {useCallback} from 'react';
import {useFetching} from '../hooks/useFetching';
import {useEffect} from 'react';
import {ROUTE_NAMES} from '../components/navigation/routes';
import {getObject, storeObject} from '../storage/AsyncStorage';
import {useSettings} from '../components/context/Provider';

const MAX_HISTORY_SIZE = 7;

const OfflineCourseSearchScreen = props => {
  const filters = props.route?.params?.filters;
  const {settings} = useSettings();

  const [focus, setFocus] = useState(true);
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState(null);
  const [history, setHistory] = useState([]);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['80%', '90%'], []);

  const [fetchInitial, isFetchingInitial, fetchingInitialError] = useFetching(
    async () => {
      const response = await CourseService.fetchOfflineCourses(
        value,
        1,
        sort,
        category?.id,
      );
      setData(response.data?.data);
      setLastPage(response.data?.last_page);
    },
  );
  const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(
    async () => {
      const response = await CourseService.fetchOfflineCourses(
        value,
        page,
        sort,
        category?.id,
      );
      setData(prev => prev.concat(response.data?.data));
    },
  );
  const [fetchHistory, isFetchingHistory, fetchingHistoryError] = useFetching(
    async () => {
      const result = await getObject(STORAGE.offlineSearchHistory);
      console.log('fetch history : ', result);
      if (result !== null) {
        setHistory(result);
      } else {
        setHistory([]);
      }
    },
  );

  useEffect(() => {
    console.log('filters : ', filters);
    fetchHistory();
  }, []);

  useEffect(() => {
    console.log('useEffect');
    if (value === '' && sort === null && category === null) {
      setData([]);
    } else {
      fetchInitial();
    }
  }, [value, sort, category]);

  useEffect(() => {
    if (page !== 1) {
      fetchNext();
    }
  }, [page]);

  // fetchInitial error handler
  useEffect(() => {
    if (fetchingInitialError) {
      console.log(fetchingInitialError);
    }
  }, [fetchingInitialError]);

  // fetchNext error handler
  useEffect(() => {
    if (fetchingNextError) {
      console.log(fetchingNextError);
    }
  }, [fetchingNextError]);

  // fetchHistory error handler
  useEffect(() => {
    if (fetchingHistoryError) {
      console.log(fetchingHistoryError);
    }
  }, [fetchingHistoryError]);

  const courseItemTapped = async id => {
    let historyList = history;

    if (
      historyList.filter((search, _) => search === value).length === 0 &&
      isValidText(value)
    ) {
      historyList.splice(0, 0, value);
      if (historyList.length > MAX_HISTORY_SIZE) {
        historyList.pop();
      }
      await storeObject(STORAGE.courseSearchHistory, historyList);
    }

    props.navigation.navigate(ROUTE_NAMES.offlineCourseDetailsScreen, {
      courseID: id,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.item}>
        <CourseRow
          id={item?.id}
          title={item?.title}
          poster={item?.poster}
          reviewCount={item?.reviews_count}
          rating={item?.rating}
          category_name={item?.category_name}
          price={item?.price}
          old_price={item?.old_price}
          onPress={courseItemTapped}
        />
      </View>
    );
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  const onChangeText = async text => {
    setValue(text);
  };

  const clearTapped = () => {
    setValue('');
  };

  const historyItemTapped = search => {
    setValue(search);
  };

  const handleClosePress = () => {
    bottomSheetRef.current.close();
  };

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1);
    }
  };

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setIsFilter(false);
    }
  }, []);

  return (
    <UniversalView>
      <SafeAreaView style={{flex: 1}}>
        <RowView style={styles.searchBar}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            activeOpacity={0.8}>
            {x(16, APP_COLORS.placeholder)}
          </TouchableOpacity>
          <Input
            _focus={focus}
            placeholder={strings['Поиск курсов']}
            left={<View style={styles.searchIcon}>{search('#000')}</View>}
            right={
              <TouchableOpacity activeOpacity={0.8} onPress={clearTapped}>
                {clear()}
              </TouchableOpacity>
            }
            value={value}
            onChangeText={onChangeText}
            extraStyle={styles.inputContainer}
            extraInputStyle={styles.input}
          />
          {settings?.show_filter ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsFilter(true);
                Keyboard.dismiss();
              }}>
              {category || sort ? filterON : filter}
            </TouchableOpacity>
          ) : null}
        </RowView>
        <SectionView
          label={
            value.length > 0 || sort || category
              ? strings.Курсы
              : strings['История поиска']
          }
        />
        {data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            ListFooterComponent={renderFooter}
            keyExtractor={(_, index) => index.toString()}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            refreshing={isFetchingInitial}
            onRefresh={() => {
              if (page === 1) {
                fetchInitial();
              }
              setPage(1);
            }}
          />
        ) : isFetchingHistory ? (
          <ActivityIndicator
            color={APP_COLORS.primary}
            style={{marginTop: 100}}
          />
        ) : (
          history.map((item, index) => (
            <TouchableOpacity
              style={styles.historyItem}
              activeOpacity={0.65}
              onPress={() => historyItemTapped(item)}
              key={index}>
              <Text style={styles.historyItemText}>{item}</Text>
            </TouchableOpacity>
          ))
        )}
        {isFilter ? (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}>
            <BottomSheetStack
              sort={sort}
              category={category}
              setSort={setSort}
              setCategory={setCategory}
              filters={filters}
              fetchCourses={fetchInitial}
              close={handleClosePress}
            />
          </BottomSheet>
        ) : null}
      </SafeAreaView>
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 16,
  },
  searchBar: {
    width: WIDTH,
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 6,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 0,
    // paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  input: {...setFontStyle(15, '400')},
  searchIcon: {
    marginRight: 10,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItem: {
    padding: 16,
    justifyContent: 'center',
    borderBottomWidth: 0.7,
    borderColor: APP_COLORS.border,
  },
  historyItemText: {
    ...setFontStyle(17, '400', APP_COLORS.primary),
  },
});

export default OfflineCourseSearchScreen;
