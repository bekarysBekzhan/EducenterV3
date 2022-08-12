import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import FilterScreen from '../../screens/FilterScreen'
import SelectCategoryScreen from '../../screens/SelectCategoryScreen'
import { strings } from '../../localization'

const BottomSheet = createNativeStackNavigator() 

const BottomSheetStack = ({ setSort, setCategory, filterConfigs }) => {

    const SCREENS = [
        {
            name: ROUTE_NAMES.filter,
            component: FilterScreen,
            setState: setSort,
            label: strings.Фильтр
        },
        {
            name: ROUTE_NAMES.selectCategory,
            component: SelectCategoryScreen,
            setState: setCategory,
            label: strings['Выберите категорию']
        }
    ]

    return (
        <BottomSheet.Navigator
        >
            {
                SCREENS.map((route, index) => (
                    <BottomSheet.Screen name={route.name} component={route.component} key={index} initialParams={{ setSort: route?.setState, setCategory: route?.setState, filterConfigs: filterConfigs }} options={{ headerTitle: route.label }}/>
                ))
            }
        </BottomSheet.Navigator>
    )
}

export default BottomSheetStack