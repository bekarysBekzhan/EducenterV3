import {BottomSheetFlatList, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import SimpleButton from '../components/button/SimpleButton';
import {ROUTE_NAMES} from '../components/navigation/routes';
import SelectOption from '../components/SelectOption';
import NavButtonRow from '../components/view/NavButtonRow';
import SectionView from '../components/view/SectionView';
import {strings} from '../localization';
import {convertToIterable} from '../utils/utils';

const FilterRatingScreen = ({navigation, route}) => {
  const sort = route.params?.sort;
  const setSort = route.params?.setSort;
  const setCategory = route.params?.setCategory;
  const setTest = route?.params?.setTest;
  const filters = route?.params?.filters;
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category?.name,
  );
  const [selectedTest, setSelectedTest] = useState(route?.params?.test?.title);

  const keyExtractor = useCallback((_, index) => index, []);

  const renderFilter = ({item, index}) => {
    return (
      <NavButtonRow
        title={item.title}
        selectedCategory={
          item?.objectKey == 'name' ? selectedCategory : selectedTest
        }
        onPress={() =>
          navigation.navigate(ROUTE_NAMES.selectCategoryRating, {
            data: item.data,
            setSelectedCategory:
              item?.objectKey == 'name' ? setSelectedCategory : setSelectedTest,
            title: item?.title,
            objectKey: item?.objectKey,
          })
        }
        style={styles.navButton}
      />
    );
  };

  const renderFooter = () => (
    <Footer
      filters={filters}
      sort={sort}
      selectCategory={selectedCategory}
      setSort={setSort}
      setCategory={setCategory}
      setTest={setTest}
      setSelectedCategory={setSelectedCategory}
      setSelectedTest={setSelectedTest}
      close={route.params.close}
    />
  );

  return (
    <BottomSheetView style={styles.container}>
      <BottomSheetFlatList
        data={[
          {
            title: strings['Выберите направление'],
            data: filters?.categories,
            objectKey: 'name',
          },
          {
            title: strings['Выберите тест'],
            data: filters?.tests,
            objectKey: 'title',
          },
        ]}
        renderItem={renderFilter}
        ListFooterComponent={renderFooter}
        keyExtractor={keyExtractor}
      />
    </BottomSheetView>
  );
};

const Footer = ({
  filters,
  sort,
  selectedCategory,
  setSort,
  setCategory,
  setTest,
  setSelectedCategory,
  setSelectedTest,
  close,
}) => {
  const [currentKey, setCurrentKey] = useState(sort);

  const selectKeyPressed = key => {
    console.log('setSort : ', setSort);
    setCurrentKey(key);
    setSort(key);
  };

  const clearFilterTapped = () => {
    setCurrentKey(null);
    setSort(null);
    setCategory(null);
    setTest(null);
    setSelectedCategory(null);
    setSelectedTest(null);
  };

  const applyFilterTapped = async () => {
    close();
  };

  return (
    <View>
      <SectionView label={strings.Сортировка} />
      {convertToIterable(filters.sorts).map((sort, index) => (
        <SelectOption
          value={sort.key}
          _key={sort.key}
          label={sort.value}
          key={index}
          currentKey={currentKey}
          selectKeyPressed={selectKeyPressed}
        />
      ))}
      {selectedCategory || currentKey ? (
        <SimpleButton
          text={strings.Применить}
          onPress={applyFilterTapped}
          style={styles.button}
        />
      ) : (
        <SimpleButton
          text={strings.Отменить}
          onPress={clearFilterTapped}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    margin: 16,
    marginTop: 30,
  },
  navButton: {
    marginVertical: 16,
    marginRight: 16,
    marginBottom: 0,
  },
});

export default FilterRatingScreen;
