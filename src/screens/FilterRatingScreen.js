import {BottomSheetFlatList, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import SimpleButton from '../components/button/SimpleButton';
import {ROUTE_NAMES} from '../components/navigation/routes';
import SelectOption from '../components/SelectOption';
import NavButtonRow from '../components/view/NavButtonRow';
import SectionView from '../components/view/SectionView';
import {convertToIterable} from '../utils/utils';
import {useLocalization} from '../components/context/LocalizationProvider';
import {lang} from '../localization/lang';

const FilterRatingScreen = ({navigation, route}) => {
  const {localization} = useLocalization();

  const sort = route.params?.sort;
  const setSort = route.params?.setSort;
  const setCategory = route.params?.setCategory;
  const setTest = route?.params?.setTest;
  const filters = route?.params?.filters;
  const close = route?.params?.close;

  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category?.name,
  );
  const [selectedTest, setSelectedTest] = useState(route?.params?.test?.title);

  const keyExtractor = useCallback((_, index) => index, []);

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
    console.log('close stack');
    close();
  };

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

  const renderFooter = () => {
    return (
      <View>
        <SectionView label={lang('Сортировка', localization)} />
        {convertToIterable(filters?.sorts).map((sort, index) => (
          <SelectOption
            value={sort.key}
            _key={sort.key}
            label={sort.value}
            key={index}
            currentKey={currentKey}
            selectKeyPressed={selectKeyPressed}
          />
        ))}
        <SimpleButton
          text={lang('Применить', localization)}
          onPress={applyFilterTapped}
          style={styles.button}
        />
        {selectedCategory || currentKey || selectedTest ? (
          <SimpleButton
            text={lang('Сбросить', localization)}
            onPress={clearFilterTapped}
            style={styles.button}
          />
        ) : null}
      </View>
    );
  };

  return (
    <BottomSheetView style={styles.container}>
      <BottomSheetFlatList
        data={[
          {
            title: lang('Выберите направление', localization),
            data: filters?.categories,
            objectKey: 'name',
          },
          {
            title: lang('Выберите тест', localization),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    margin: 16,
    marginBottom: 0,
  },
  navButton: {
    marginVertical: 16,
    marginRight: 16,
    marginBottom: 0,
  },
});

export default FilterRatingScreen;
