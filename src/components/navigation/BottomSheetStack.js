import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import FilterScreen from '../../screens/FilterScreen'
import SelectCategoryScreen from '../../screens/SelectCategoryScreen'

const BottomSheet = createNativeStackNavigator() 

const BottomSheetStack = () => {

    const SCREENS = [
        {
            name: ROUTE_NAMES.filter,
            component: FilterScreen
        },
        {
            name: ROUTE_NAMES.selectCategory,
            component: SelectCategoryScreen
        }
    ]

    return (
        <BottomSheet.Navigator>
            {
                SCREENS.map((route, index) => (
                    <BottomSheet.Screen name={route.name} component={route.component}/>
                ))
            }
        </BottomSheet.Navigator>
    )
}

export default BottomSheetStack