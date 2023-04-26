import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import FilterScreen from '../../screens/FilterScreen';
import SelectCategoryScreen from '../../screens/SelectCategoryScreen';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const BottomSheet = createNativeStackNavigator();

const BottomSheetStack = ({
  sort,
  category,
  setSort,
  setCategory,
  filters,
  close,
}) => {
  const {localization} = useLocalization();

  const SCREENS = [
    {
      name: ROUTE_NAMES.filter,
      component: FilterScreen,
      title: lang('Фильтр', localization),
    },
    {
      name: ROUTE_NAMES.selectCategory,
      component: SelectCategoryScreen,
      title: lang('Выберите категорию', localization),
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
            headerBackVisible: ROUTE_NAMES.filter == route.name ? false : true,
            animation: 'fade_from_bottom',
          }}
        />
      ))}
    </BottomSheet.Navigator>
  );
};

export default BottomSheetStack;
