import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import FilterScreen from '../../screens/FilterScreen'
import SelectCategoryScreen from '../../screens/SelectCategoryScreen'
import { strings } from '../../localization'

const BottomSheet = createNativeStackNavigator() 

const BottomSheetStack = ({ 
    sort, 
    category, 
    setSort, 
    setCategory, 
    filters,
    close
}) => {

    const SCREENS = [
        {
            name: ROUTE_NAMES.filter,
            component: FilterScreen,
            title: strings.Фильтр
        },
        {
            name: ROUTE_NAMES.selectCategory,
            component: SelectCategoryScreen,
            title: strings['Выберите категорию']
        }
    ]

    return (
        <BottomSheet.Navigator>
            {
                SCREENS.map((route, index) => (
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
                            close: close
                        }} 
                        options={{ 
                            headerTitle: route.title 
                        }}
                    />
                ))
            }
        </BottomSheet.Navigator>
    )
}

export default BottomSheetStack