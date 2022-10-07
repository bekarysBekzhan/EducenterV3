import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {clear, filter, filterON, search} from '../assets/icons';
import Empty from '../components/Empty';
import Input from '../components/Input';
import RatingItem from '../components/item/RatingItem';
import Loader from '../components/Loader';
import RowView from '../components/view/RowView';
import UniversalView from '../components/view/UniversalView';
import {APP_COLORS, WIDTH} from '../constans/constants';
import {useFetching} from '../hooks/useFetching';
import {strings} from '../localization';
import {RatingService} from '../services/API';
import {setFontStyle} from '../utils/utils';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import BottomSheetRatingStack from '../components/navigation/BottomSheetRatingStack';

const RatingScreen = ({}) => {
  const [dataSource, setDataSource] = useState({
    page: 1,
    lastPage: null,
    refreshing: false,
    loadMore: false,
    list: [],
  });

  const [value, setValue] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState();
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState(null);
  const [test, setTest] = useState(null);
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
      category_id: category?.id,
      test_id: test?.id,
      query: value,
    };
    const response = await RatingService.fetchRating(params);
    setDataSource(prev => ({
      ...prev,
      list: response?.data?.data,
      lastPage: response?.data?.last_page,
      loadMore: false,
      refreshing: false,
    }));
    setDataFilter(response?.data?.filters);
  });

  const fetchNextPage = async () => {
    let params = {
      page: dataSource?.page,
      filter: true,
      category_id: category?.id,
      test_id: test?.id,
      query: value,
    };
    const response = await RatingService.fetchRating(params);
    setDataSource(prev => ({
      ...prev,
      list: prev?.list?.concat(response?.data?.data),
      refreshing: false,
      loadMore: false,
    }));
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

  const onEndReached = () => {
    if (!dataSource?.loadMore) {
      if (dataSource?.page < dataSource?.lastPage) {
        setDataSource(prev => ({
          ...prev,
          loadMore: true,
          refreshing: false,
          page: prev?.page + 1,
        }));
      }
    }
  };

  useEffect(() => {
    if (dataSource?.page == 1) {
      fetchRating();
    } else {
      fetchNextPage();
    }
  }, [dataSource?.page]);

  useEffect(() => {
    if (value === '' && sort === null && category === null && test === null) {
      setDataSource(prev => ({...prev, list: []}));
    } else {
      fetchRating();
    }
  }, [value, sort, category, test]);

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setIsFilter(false);
    }
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current.close();
  };

  const keyExtractor = useCallback((_, index) => index, []);

  const renderItem = useCallback(
    ({item, index}) => (
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
    <UniversalView>
      <RowView style={styles.searchBar}>
        <Input
          // _focus={focus}
          placeholder={strings['Поиск тестов']}
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
      {
        loading
        ?
        <Loader/>
        :
        <FlatList
          data={dataSource?.list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          // ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
          refreshing={dataSource?.refreshing}
          onRefresh={onRefresh}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.01}
        />
      }
      {isFilter ? (
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={3}
          onChange={handleSheetChanges}
          // enablePanDownToClose
          backdropComponent={renderBackdrop}>
          <BottomSheetRatingStack
            sort={sort}
            category={category}
            test={test}
            setSort={setSort}
            setCategory={setCategory}
            setTest={setTest}
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

export default RatingScreen;
