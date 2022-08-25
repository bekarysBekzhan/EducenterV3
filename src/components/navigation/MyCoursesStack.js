import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import MyCoursesScreen from '../../screens/bottomtab/MyCourses/MyCoursesScreen'
import CourseDetailScreen from '../../screens/bottomtab/MyCourses/CourseDetailScreen'
import { useSettings } from '../context/Provider'
import { strings } from '../../localization'
import { navHeaderOptions } from './navHeaderOptions'
import UnauthorizedScreen from '../../screens/bottomtab/myCourses/UnauthorizedScreen'

const MyCoursesStack = createNativeStackNavigator()

const MyCourses = () => {

    const TITLE = strings['Мои курсы']
    const { settings, isAuth } = useSettings()

    const screens = [
        {
            name: ROUTE_NAMES.myCourses,
            component: isAuth ? MyCoursesScreen : UnauthorizedScreen
        },
    ]

    return (
        <MyCoursesStack.Navigator>
            {   
                screens.map((screen, index) => (
                    <MyCoursesStack.Screen 
                        name={screen.name} 
                        component={screen.component} 
                        key={index}
                        options={
                            screen.name === ROUTE_NAMES.myCourses
                            ?
                            navHeaderOptions(settings?.logo, TITLE)
                            :
                            {
                                headerTitle: "Мой курс",
                                headerBackTitleVisible: false
                            }
                        }
                    />
                ))
            }
        </MyCoursesStack.Navigator>
    )
}

export default MyCourses