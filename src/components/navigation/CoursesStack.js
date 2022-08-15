import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import CoursesScreen from '../../screens/bottomtab/courses/CoursesScreen'
import CourseDetailScreen from '../../screens/bottomtab/courses/CourseDetailScreen'


const CoursesStack = createNativeStackNavigator()

const Courses = () => {

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


    return (
        <CoursesStack.Navigator>
            {   
                screens.map((screen, index) => (
                    <CoursesStack.Screen name={screen.name} component={screen.component}/>
                ))
            }
        </CoursesStack.Navigator>
    )
}

export default Courses