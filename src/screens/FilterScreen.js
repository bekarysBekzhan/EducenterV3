import {BottomSheetView} from '@gorhom/bottom-sheet';
import React from 'react';
import {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import SimpleButton from '../components/button/SimpleButton';
import {useSettings} from '../components/context/Provider';
import {ROUTE_NAMES} from '../components/navigation/routes';
import SelectOption from '../components/SelectOption';
import NavButtonRow from '../components/view/NavButtonRow';
import SectionView from '../components/view/SectionView';
import {strings} from '../localization';
import {convertToIterable} from '../utils/utils';

const FilterScreen = ({navigation, route}) => {
  const {settings} = useSettings();

  console.log(
    'settings?.show_filter_categories',
    settings?.show_filter_categories,
  );

  const sort = route.params?.sort;
  const setSort = route.params?.setSort;
  const setCategory = route.params?.setCategory;
  const filters = route?.params?.filters;
  const close = route?.params?.close;
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category?.name,
  );

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
    setSelectedCategory(null);
  };

  const applyFilterTapped = () => {
    console.log('close stack');
    close();
  };

  const renderFilter = ({item, index}) => {
    return (
      <NavButtonRow
        title={item.title}
        selectedCategory={selectedCategory}
        onPress={() =>
          navigation.navigate(ROUTE_NAMES.selectCategory, {
            data: item.data,
            setSelectedCategory: setSelectedCategory,
          })
        }
        style={styles.navButton}
      />
    );
  };

  const renderFooter = () => {
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
          <View>
            <SimpleButton
              text={strings.Применить}
              onPress={applyFilterTapped}
              style={styles.button}
            />
            <SimpleButton
              text={strings.Сбросить}
              onPress={clearFilterTapped}
              style={styles.button}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <BottomSheetView style={styles.container}>
      <FlatList
        data={
          Boolean(parseFloat(settings?.show_filter_categories))
            ? [
                {
                  title: strings.Категория,
                  data: filters?.categories,
                },
              ]
            : []
        }
        renderItem={renderFilter}
        ListFooterComponent={renderFooter}
        keyExtractor={(_, index) => index.toString()}
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
  },
});

export default FilterScreen;
