import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import { useSettings } from '../context/Provider';
import SelectSubjectsScreen from '../../screens/ubt/SelectSubjectsScreen';

const UBTStack = createNativeStackNavigator();

const UBT = props => {
  const { settings } = useSettings();

  const screens = [
    {
      name: ROUTE_NAMES.selectSubjects,
      component: SelectSubjectsScreen,
    },
  ];

  return (
    <UBTStack.Navigator>
      {screens.map((screen, index) => (
        <UBTStack.Screen
          name={screen.name}
          component={screen.component}
          key={index}
          options={
            screen.name === ROUTE_NAMES.selectSubjects
              ? navHeaderOptions(
                settings?.modules_enabled_ubt_title,
              )
              : {
                headerTitleAlign: 'center',
                headerBackTitleVisible: false,
              }
          }
        />
      ))}
    </UBTStack.Navigator>
  );
};

export default UBT;
