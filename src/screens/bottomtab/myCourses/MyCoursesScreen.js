import { View, Text } from 'react-native'
import React from 'react'
import UniversalView from '../../../components/view/UniversalView'
import { strings } from '../../../localization'
import MyCoursesTab from './MyCoursesTab'
import MyTestsTab from './MyTestsTab'
import MyTasksTab from './MyTasksTab'
import TopTab from '../../../components/view/TopTab'

const MyCoursesScreen = (props) => {

  const screens = [
    {
      name: strings['Мои курсы'],
      component: MyCoursesTab
    },
    {
      name: strings['Мои тесты'],
      component: MyTestsTab
    },
    {
      name: strings['Мои задания'],
      component: MyTasksTab
    }
  ]

  return (
    <TopTab screens={screens} swipeEnabled={true}/>
  )
}

export default MyCoursesScreen