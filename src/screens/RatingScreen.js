import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, View, TouchableOpacity } from 'react-native';
import { clear, filter, filterON, search } from '../assets/icons';
import Empty from '../components/Empty';
import Input from '../components/Input';
import RatingItem from '../components/item/RatingItem';
import Loader from '../components/Loader';
import RowView from '../components/view/RowView';
import UniversalView from '../components/view/UniversalView';
import { APP_COLORS, WIDTH } from '../constans/constants';
import { useFetching } from '../hooks/useFetching';
import { strings } from '../localization';
import { RatingService } from '../services/API';
import { setFontStyle } from '../utils/utils';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import BottomSheetRatingStack from '../components/navigation/BottomSheetRatingStack';

const RatingScreen = ({ }) => {
  const [dataSource, setDataSource] = useState({
    page: 1,
    lastPage: null,
    refreshing: false,
    loadMore: false,
    list: []
  });

  const [focus, setFocus] = useState(true);
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState();
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState(null);
  const [history, setHistory] = useState([]);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '40%', '50%', '60%'], []);

  const clearTapped = () => {
    setValue('');
  };

  const onChangeText = async text => {
    setValue(text);
  };

  const [fetchRating, loading, error] = useFetching(async () => {
    let params = {
      page: dataSource?.page,
      filter: true,
    };
    const response = await RatingService.fetchRating(params);
    setDataSource(prev => ({
      ...prev,
      list: response?.data?.data,
      loadMore: false,
      refreshing: false,
    }));
    setDataFilter(response?.data?.filters)
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
      filter: true,
    };
    const response = await RatingService.fetchRating(params);
    setDataSource(prev => ({
      ...prev,
      list: prev?.data?.concat(response?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
    setSort(response?.data?.filters)
  };

  const getRating = async () => {
    let params = { page: refPage.current };

    if (!params?.page) {
      setDataSource(prev => ({
        ...prev,
        refreshing: false,
        more_loading: false,
      }));
      return;
    }

    if (typeof params?.page != 'number') {
      setDataSource(prev => ({ ...prev, more_loading: true }));
      params.page = params?.page?.split('=');
      params.page = params?.page[params?.page?.length - 1];
    }

    try {
      const res = await axios.get(RATING_URL, { params });

      console.log('res getRating: ', res);

      let convertSorts = Object.entries(res?.data?.filters?.sorts).map(
        ([i, k]) => ({ value: i, name: k, id: i }),
      );

      setDataSource(prev => ({
        ...prev,
        list:
          refPage.current == 1
            ? res?.data?.data
            : prev?.list?.concat(res?.data?.data),
        sorts: convertSorts,
        categories: res?.data?.filters?.categories,
        tests: res?.data?.filters?.tests,
        refreshing: false,
        more_loading: false,
      }));

      refPage.current = res?.data?.next_page_url;

      setDataSource(prev => ({ ...prev, loading: false }));
    } catch (e) {
      console.log('catch getRating: ', e, e?.response);
      setDataSource(prev => ({
        ...prev,
        refreshing: false,
        more_loading: false,
      }));
      //   handlerErrorRequest(e);
    }
  };

  const onRefresh = () => {
    setDataSource(prev => ({
      ...prev,
      page: 1,
      lastPage: null,
      loadMore: false,
      refreshing: true,
    }));
    if (dataSource?.page == 1) {
      fetchRating();
    }
  };

  useEffect(() => {
    if (dataSource?.page == 1) {
      fetchRating();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setIsFilter(false);
    }
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current.close();
  };

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  //   const renderHeader = (
  //     <FitlerView
  //       onFilterPress={() => handleClosePressFilter()}
  //       placeholder={strings['Поиск среди участников']}
  //     />
  //   );

  const renderItem = useCallback(
    ({ item, index }) => (
      <RatingItem
        count={index + 1}
        avatar={item?.user?.avatar}
        category={item?.entity?.category?.name}
        name={item?.user?.name}
        title={item?.entity?.title}
        score={item?.score}
      />
    ),
    [],
  );

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

  const renderEmpty = <Empty />;

  const renderFooter = () => {
    if (dataSource?.loadMore) {
      return <Loader />;
    }
    return null;
  };

  return (
    <UniversalView haveLoader={loading}>
      <RowView style={styles.searchBar}>
        <Input
          // _focus={focus}
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
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setIsFilter(true);
            Keyboard.dismiss();
          }}>
          {category || sort ? filterON : filter}
        </TouchableOpacity>
      </RowView>
      <FlatList
        data={dataSource?.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshing={dataSource?.refreshing}
        onRefresh={onRefresh}
      />
      {isFilter ? (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={3}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backdropComponent={renderBackdrop}>
          <BottomSheetRatingStack
            sort={sort}
            category={category}
            setSort={setSort}
            setCategory={setCategory}
            filters={dataFilter}
            close={handleClosePress}
          />
        </BottomSheet>
      ) : null}
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  button: {
    marginTop: 16,
  },
  item: {
    padding: 16,
  },
  searchBar: {
    width: WIDTH,
    justifyContent: 'space-between',
    padding: 16,
    paddingLeft: 0,
    paddingBottom: 6,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 0,
    // paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  input: { ...setFontStyle(15, '400') },
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

export default RatingScreen;
