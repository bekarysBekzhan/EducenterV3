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
  const [selectedCategory, setSelectedCategory] = useState(
    route.params?.category?.name,
  );

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
      <Footer
        filters={filters}
        sort={sort}
        selectCategory={selectedCategory}
        setSort={setSort}
        setCategory={setCategory}
        setSelectedCategory={setSelectedCategory}
        close={route.params.close}
      />
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

const Footer = ({
  filters,
  sort,
  selectedCategory,
  setSort,
  setCategory,
  setSelectedCategory,
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
    setSelectedCategory(null);
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
  },
});

export default FilterScreen;
