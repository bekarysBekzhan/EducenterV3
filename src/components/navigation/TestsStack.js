import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_NAMES} from './routes';
import TestsScreen from '../../screens/bottomtab/tests/TestsScreen';
import TestDetailScreen from '../../screens/bottomtab/tests/TestDetailScreen';
import {useSettings} from '../context/Provider';
import {navHeaderOptions} from './navHeaderOptions';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const TestsStack = createNativeStackNavigator();

const Tests = () => {
  const {localization} = useLocalization();
  const TITLE = lang('Тесты', localization);

  const screens = [
    {
      name: ROUTE_NAMES.tests,
      component: TestsScreen,
    },
    {
      name: ROUTE_NAMES.testDetail,
      component: TestDetailScreen,
    },
  ];

  const {settings} = useSettings();

  return (
    <TestsStack.Navigator>
      {screens.map((screen, index) => (
        <TestsStack.Screen
          name={screen.name}
          key={index}
          component={screen.component}
          options={
            screen.name === ROUTE_NAMES.tests
              ? navHeaderOptions(settings?.logo, TITLE)
              : {
                  headerTitle: lang('Тесты', localization),
                  headerBackTitleVisible: false,
                  headerTitleAlign: 'center',
                }
          }
        />
      ))}
    </TestsStack.Navigator>
  );
};

export default Tests;
