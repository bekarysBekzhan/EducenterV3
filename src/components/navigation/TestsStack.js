import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { strings } from '../../localization'
import { ROUTE_NAMES } from './routes'
import TestsScreen from '../../screens/bottomtab/tests/TestsScreen'
import TestDetailScreen from '../../screens/bottomtab/tests/TestDetailScreen'
import { useSettings } from '../context/Provider'
import { navHeaderOptions } from './navHeaderOptions'
import ModuleTestItem from '../test/ModuleTestItem'
import ModuleTestScreen from '../../screens/bottomtab/tests/ModuleTestScreen'

const TestsStack = createNativeStackNavigator()

const Tests = () => {

    const TITLE = strings.Тесты

    const screens = [
        {
            name: ROUTE_NAMES.tests,
            component: TestsScreen
        },
        {
            name: ROUTE_NAMES.testDetail,
            component: TestDetailScreen
        },
    ]

    const { settings } = useSettings()

    return (
        <TestsStack.Navigator>
            {
                screens.map((screen, index) => (
                    <TestsStack.Screen 
                        name={screen.name} 
                        key={index} 
                        component={screen.component}
                        options={
                            screen.name === ROUTE_NAMES.tests
                            ?
                            navHeaderOptions(settings?.logo, TITLE)
                            :
                            {
                                headerTitle: strings.Тесты,
                                headerBackTitleVisible: false
                            }
                        }
                    />        
                ))
            }
        </TestsStack.Navigator>
    )
}

export default Tests