import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import { strings } from '../../localization';
import FilterRatingScreen from '../../screens/FilterRatingScreen';
import SelectCategoryRatingScreen from '../../screens/SelectCategoryRatingScreen';

const BottomSheet = createNativeStackNavigator();

const BottomSheetRatingStack = ({
  sort,
  category,
  setSort,
  setCategory,
  filters,
  close,
}) => {
  const SCREENS = [
    {
      name: ROUTE_NAMES.filterRating,
      component: FilterRatingScreen,
      title: strings.Фильтр,
    },
    {
      name: ROUTE_NAMES.selectCategoryRating,
      component: SelectCategoryRatingScreen
    },
  ];

  return (
    <BottomSheet.Navigator>
      {SCREENS.map((route, index) => (
        <BottomSheet.Screen
          name={route.name}
          component={route.component}
          key={index}
          initialParams={{
            sort: sort,
            category: category,
            setSort: setSort,
            setCategory: setCategory,
            filters: filters,
            close: close,
          }}
          options={{
            headerTitle: route.title,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerBackVisible: ROUTE_NAMES.filterRating == route.name ? false : true,
            animation: 'fade_from_bottom',
          }}
        />
      ))}
    </BottomSheet.Navigator>
  );
};

export default BottomSheetRatingStack;
