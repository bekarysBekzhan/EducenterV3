import { View, Text } from 'react-native'
import React from 'react'
import UniversalView from '../../../components/view/UniversalView'
import { strings } from '../../../localization'
import MyCoursesTab from './MyCoursesTab'
import MyTestsTab from './MyTestsTab'
import MyTasksTab from './MyTasksTab'
import TopTab from '../../../components/view/TopTab'
import WhatsappButton from '../../../components/button/WhatsappButton'
import { useSettings } from '../../../components/context/Provider'
import { N_STATUS } from '../../../constans/constants'

const MyCoursesScreen = (props) => {

  const { nstatus } = useSettings();

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

  if (nstatus === N_STATUS) {
    return <MyCoursesTab {...props}/>;
  }

  return (
    <UniversalView>
      <TopTab screens={screens} swipeEnabled={true}/>
      { nstatus === N_STATUS ? null : <WhatsappButton/> }
    </UniversalView>
  )
}

export default MyCoursesScreen;