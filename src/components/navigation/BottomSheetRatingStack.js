import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import FilterRatingScreen from '../../screens/FilterRatingScreen';
import SelectCategoryRatingScreen from '../../screens/SelectCategoryRatingScreen';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const BottomSheet = createNativeStackNavigator();

const BottomSheetRatingStack = ({
  sort,
  category,
  test,
  setSort,
  setCategory,
  setTest,
  filters,
  close,
}) => {
  const {localization} = useLocalization();

  const SCREENS = [
    {
      name: ROUTE_NAMES.filterRating,
      component: FilterRatingScreen,
      title: lang('Фильтр', localization),
    },
    {
      name: ROUTE_NAMES.selectCategoryRating,
      component: SelectCategoryRatingScreen,
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
            test: test,
            setSort: setSort,
            setCategory: setCategory,
            setTest: setTest,
            filters: filters,
            close: close,
          }}
          options={{
            headerTitle: route.title,
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerBackVisible:
              ROUTE_NAMES.filterRating == route.name ? false : true,
            animation: 'fade_from_bottom',
          }}
        />
      ))}
    </BottomSheet.Navigator>
  );
};

export default BottomSheetRatingStack;
