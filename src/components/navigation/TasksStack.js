import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { strings } from '../../localization'
import { ROUTE_NAMES } from './routes'
import TestsScreen from '../../screens/bottomtab/tests/TestsScreen'
import TestDetailScreen from '../../screens/bottomtab/tests/TestDetailScreen'
import { useSettings } from '../context/Provider'
import { navHeaderOptions } from './navHeaderOptions'

const TasksStack = createNativeStackNavigator()

const Tasks = () => {

    const TITLE = strings.Задания

    const screens = [
        {
            name: ROUTE_NAMES.tasks,
            component: TestsScreen
        },
        {
            name: ROUTE_NAMES.taskDetail,
            component: TestDetailScreen
        },
    ]

    const { settings } = useSettings()

    return (
        <TasksStack.Navigator>
            {
                screens.map((screen, index) => (
                    <TasksStack.Screen 
                        name={screen.name} 
                        key={index} 
                        component={screen.component}
                        options={
                            screen.name === ROUTE_NAMES.tasks
                            ?
                            navHeaderOptions(settings?.logo, TITLE)
                            :
                            {
                                headerTitle: strings.Задания,
                                headerBackTitleVisible: false
                            }
                        }
                    />        
                ))
            }
        </TasksStack.Navigator>
    )
}

export default Tasks