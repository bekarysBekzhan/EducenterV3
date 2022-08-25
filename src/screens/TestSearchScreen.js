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
import {APP_COLORS, WIDTH} from '../constans/constants';
import {setFontStyle} from '../utils/utils';
import SectionView from '../components/view/SectionView';
import {useState} from 'react';
import {TestService} from '../services/API';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import BottomSheetStack from '../components/navigation/BottomSheetStack';
import {useRef} from 'react';
import {useMemo} from 'react';
import {useCallback} from 'react';
import { useFetching } from '../hooks/useFetching';
import { useEffect } from 'react';
import ModuleTestItem from '../components/test/ModuleTestItem';

const TestSearchScreen = props => {

  const filters = props.route?.params?.filters

  const [focus, setFocus] = useState(true)
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(null)
  const [isFilter, setIsFilter] = useState(false);
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState(null);
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '40%', '50%', "60%"], []);

  const [fetchInitial, isFetchingInitial, fetchingInitialError] = useFetching(async() => {
    const response = await TestService.fetchTests(value, 1, sort, category?.id);
    setData(response.data?.data)
    setLastPage(response.data?.last_page)
  })
  const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(async() => {
    const response = await TestService.fetchTests(value, page, sort, category?.id);
    setData(prev => prev.concat(response.data?.data))
  })

  useEffect(() => {
    console.log("filters : " , filters)
  }, [] )

  useEffect(() => {
    if (value === '' && sort === null && category === null) {
      setData([]);
    } else {
      fetchInitial()
    }
  }, [value, sort, category])

  useEffect(() => {
    if(page !== 1) {
      fetchNext()
    }
  }, [page])

  // fetchInitial error handler
  useEffect(() => {
    if (fetchingInitialError) {
      console.log(fetchingInitialError)
    }
  }, [fetchingInitialError])

  // fetchNext error handler
  useEffect(() => {
    if(fetchingNextError) {
      console.log(fetchingNextError)
    }
  }, [fetchingNextError])

  const moduleItemTapped = (id) => {
    console.log("test " , id)
  }

  const renderItem = ({item, index}) => {
    return (
        <ModuleTestItem
          index={index}
          title={item?.title}
          id={item?.id}
          categoryName={item?.category?.name}
          time={item?.timer}
          attempts={item?.attempts}
          price={item?.price}
          oldPrice={item?.old_price}
          onPress={moduleItemTapped}
        />
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
    <View
      style={styles.footer}
    >
      {
        isFetchingNext
        ?
        <ActivityIndicator color={APP_COLORS.primary}/>
        :
        null
      }
    </View>
  )

  const onChangeText = async text => {
    setValue(text);
  };

  const clearTapped = () => {
    setValue('');
  };

  const handleClosePress = () => {
    bottomSheetRef.current.close()
  }

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1)
    }
  }

  const handleSheetChanges = useCallback(index => {
    if (index === -1) {
      setIsFilter(false);
    }
  }, []);

  return (
    <UniversalView>
      <SafeAreaView style={{flex: 1}}>
        <RowView style={styles.searchBar}>
          <TouchableOpacity onPress={() => props.navigation.goBack()} activeOpacity={0.8}>
            {x(16, APP_COLORS.placeholder)}
          </TouchableOpacity>
          <Input
            _focus={focus}
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
              Keyboard.dismiss()
            }}>
            {
              category || sort
              ?
              filterON
              :
              filter
              
            }
          </TouchableOpacity>
        </RowView>
        <SectionView
          label={value.length > 0 || sort || category ? strings.Тесты : strings['История поиска']}
        />
        {data.length === 0 ? (
          null
        ) : (
          <FlatList
            data={data}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
            ListFooterComponent={renderFooter}
            keyExtractor={(_, index) => index.toString()}
            onEndReached={onEndReached}
            showsVerticalScrollIndicator={false}
            refreshing={isFetchingInitial}
            onRefresh={() => {
              if (page === 1) {
                fetchInitial()
              } 
              setPage(1)
            }}
          />
        )}
        {isFilter ? (
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={0}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
          >
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
  contentContainer: {
    padding: 16
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
    padding: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  input: [setFontStyle(15, '400'), {}],
  searchIcon: {
    marginRight: 10,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: "center",
    alignItems: 'center'
  }
});

export default TestSearchScreen;