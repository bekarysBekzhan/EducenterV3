import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ROUTE_NAMES } from './routes'
import { useSettings } from '../context/Provider'
import { strings } from '../../localization'
import { navHeaderOptions } from './navHeaderOptions'
import UnauthorizedScreen from '../../screens/bottomtab/myCourses/UnauthorizedScreen'
import MyCoursesScreen from '../../screens/bottomtab/myCourses/MyCoursesScreen'
import MyCourseDetailScreen from '../../screens/bottomtab/myCourses/MyCourseDetailScreen'
import MyTestDetailScreen from '../../screens/bottomtab/myCourses/MyTestDetailScreen'

const MyCoursesStack = createNativeStackNavigator()

const MyCourses = () => {

    const TITLE = strings['Мои курсы']
    const { settings, isAuth } = useSettings()

    console.log("isAuth " , isAuth)

    const screens = [
        {
            name: ROUTE_NAMES.myCourses,
            component: isAuth ? MyCoursesScreen : UnauthorizedScreen
        },
        {
            name: ROUTE_NAMES.myCourseDetail,
            component: MyCourseDetailScreen
        },
        {
            name: ROUTE_NAMES.myTestDetail,
            component: MyTestDetailScreen
        }
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
                                headerBackTitleVisible: false,
                            }
                        }
                    />
                ))
            }
        </MyCoursesStack.Navigator>
    )
}

export default MyCourses