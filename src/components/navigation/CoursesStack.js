import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen'
import CourseDetailScreen from '../../screens/bottomtab/courses/CourseDetailScreen'
import { useSettings } from '../context/Provider'
import { strings } from '../../localization'
import { navHeaderOptions } from './navHeaderOptions'

const CoursesStack = createNativeStackNavigator()

const Courses = () => {

    const TITLE = strings.Курсы

    const screens = [
        {
            name: ROUTE_NAMES.courses,
            component: CoursesScreen
        },
        {
            name: ROUTE_NAMES.courseDetail,
            component: CourseDetailScreen
        }
    ]

    const { settings } = useSettings()

    return (
        <CoursesStack.Navigator>
            {   
                screens.map((screen, index) => (
                    <CoursesStack.Screen 
                        name={screen.name} 
                        component={screen.component} 
                        key={index}
                        options={
                            screen.name === ROUTE_NAMES.courses
                            ?
                            navHeaderOptions(settings?.logo, TITLE)
                            :
                            {
                                headerTitle: "Курс"
                            }
                        }
                    />
                ))
            }
        </CoursesStack.Navigator>
    )
}

export default Courses