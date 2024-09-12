import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import TestsScreen from '../../screens/bottomtab/tests/TestsScreen';
import TestDetailScreen from '../../screens/bottomtab/tests/TestDetailScreen';
import { useSettings } from '../context/Provider';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constants/constants';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { LeftArrowIcon, SearchIcon } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const TestsStack = createNativeStackNavigator();

const Tests = () => {
  const { localization } = useLocalization();
  const TITLE = lang('Тесты', localization);
  const navigation = useNavigation();

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

  const { settings } = useSettings();

  return (
    <TestsStack.Navigator>
      {screens.map((screen, index) => (
        <TestsStack.Screen
          name={screen.name}
          key={index}
          component={screen.component}
          options={{
            headerShown: true,
            headerTitle: lang('Тесты', localization),
            headerTitleAlign: 'center',
            headerTitleStyle: {
              ...setFontStyle(20, '700', APP_COLORS.white),
            },
            headerBackTitleVisible: true,
            headerStyle: {
              backgroundColor: APP_COLORS.primary,
            },
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.pop()}
                style={styles.iconButton}
                activeOpacity={0.65}
              >
                <LeftArrowIcon />
              </TouchableOpacity>
            ),
          }
          }
        />
      ))}
    </TestsStack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
  },
})

export default Tests;


// screenOptions={{
//   headerShown: true,
//   headerTitleAlign: 'center',
//   headerTitleStyle: {
//     ...setFontStyle(20, '700', APP_COLORS.white),
//   },
//   headerBackTitleVisible: true,
//   headerStyle: {
//     backgroundColor: APP_COLORS.primary,
//   },
//   headerShadowVisible: false,
//   headerLeft: () => (
//     <TouchableOpacity
//       onPress={() => navigation.pop()}
//       style={styles.iconButton}
//       activeOpacity={0.65}
//     >
//       <LeftArrowIcon />
//     </TouchableOpacity>
//   ),
// }}>