import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import UniversalView from '../components/view/UniversalView';
import RowView from '../components/view/RowView';
import {clear, filter, search, x} from '../assets/icons';
import Input from '../components/Input';
import {strings} from '../localization';
import {APP_COLORS, WIDTH} from '../constans/constants';
import {setFontStyle} from '../utils/utils';
import SectionView from '../components/view/SectionView';
import {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import CourseRow from '../components/CourseRow';
import {CourseService} from '../services/API';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import BottomSheetStack from '../components/navigation/BottomSheetStack';
import {useRef} from 'react';
import {useMemo} from 'react';
import {useCallback} from 'react';

const SearchScreen = props => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [isFilter, setIsFilter] = useState(false);
  const [sort, setSort] = useState(null);
  const [category, setCategory] = useState(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '85%'], []);
  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges : ', index);
    if (index === -1) {
      setIsEmpty(false);
    }
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.item}>
        <CourseRow
          title={item?.title}
          poster={item?.poster}
          reviewCount={item?.reviews_count}
          rating={item?.rating}
          category_name={item?.category_name}
          price={item?.price}
          old_price={item?.old_price}
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

  return (
    <UniversalView>
      <SafeAreaView style={{flex: 1}}>
        <SearchBar
          {...props}
          setIsEmpty={setIsEmpty}
          setData={setData}
          page={page}
          setIsFilter={setIsFilter}
        />
        <SectionView
          label={isEmpty ? strings['История поиска'] : strings.Курсы}
        />
        {data !== null ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
          />
        ) : (
          data
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
            <BottomSheetStack setSort={setSort} setCategory={setCategory} />
          </BottomSheet>
        ) : null}
      </SafeAreaView>
    </UniversalView>
  );
};

const SearchBar = ({navigation, setIsEmpty, setData, page, setIsFilter}) => {
  const [value, setValue] = useState('');

  const onChangeText = async text => {
    setValue(text);
    if (text === '') {
      console.log('empty');
      setIsEmpty(true);
      setData(null);
    } else {
      setIsEmpty(false);
      const response = await CourseService.fetchCourses(text, page);
      setData(response.data?.data);
    }
  };

  const clearTapped = () => {
    setIsEmpty(true);
    setValue('');
  };

  return (
    <RowView style={styles.searchBar}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
        {x(16, APP_COLORS.placeholder)}
      </TouchableOpacity>
      <Input
        _focus={true}
        placeholder={strings['Поиск курсов и тестов']}
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
          if (value) {
            setIsFilter(true);
          }
        }}>
        {filter}
      </TouchableOpacity>
    </RowView>
  );
};

const styles = StyleSheet.create({
  listContainer: {},
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
    marginHorizontal: 10,
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
});

export default SearchScreen;
