import React, {useCallback, useLayoutEffect, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import {FlatList} from 'react-native-gesture-handler';
import SelectOption from '../components/SelectOption';

const SelectCategoryRatingScreen = ({navigation, route}) => {
  console.log('SelectCategoryRatingScreen', navigation, route);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route?.params?.title,
    });
  }, []);

  const [currentKey, setCurrentKey] = useState(
    route?.params?.objectKey == 'name'
      ? route?.params?.category
      : route?.params?.test,
  );

  const selectKeyPressed = value => {
    if (currentKey !== value) {
      setCurrentKey(value);
      if (route?.params?.objectKey == 'name') {
        route.params.setCategory(value);
      } else {
        route.params.setTest(value);
      }

      route.params.setSelectedCategory(
        route?.params?.objectKey == 'name' ? value?.name : value?.title,
      );
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <SelectOption
        value={item}
        label={item?.[route?.params?.objectKey]}
        currentKey={currentKey}
        selectKeyPressed={selectKeyPressed}
      />
    );
  };

  const keyExtractor = useCallback((_, index) => index, []);

  return (
    <UniversalView>
      <FlatList
        data={route.params.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </UniversalView>
  );
};

export default SelectCategoryRatingScreen;
