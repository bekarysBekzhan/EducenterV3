import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, View } from 'react-native';
import { useSettings } from '../context/Provider';
import { APP_COLORS } from '../../constants/constants';
import { ROUTE_NAMES } from './routes';
import JournalsScreen from '../../screens/journal/JournalsScreen';
import MyJournalScreen from '../../screens/journal/MyJournalScreen';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import SmallHeaderBar from '../SmallHeaderBar';

const Tab = createMaterialTopTabNavigator();

const JournalNavigator = () => {
  const { isAuth } = useSettings();

  const { localization } = useLocalization();

  return (
    <View style={styles.mainView}>
      <SmallHeaderBar title={lang('Все журналы', localization)} />
      <Tab.Navigator
        style={styles.screen}
        screenOptions={{
          tabBarStyle: styles.tabBarStyle,
          tabBarItemStyle: styles.tabBarItemStyle,
          tabBarLabelStyle: styles.tabBarLabelStyle,
          tabBarIndicatorContainerStyle: styles.tabBarIndicatorContainerStyle,
          tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
          tabBarInactiveTintColor: APP_COLORS.label,
          tabBarActiveTintColor: APP_COLORS.fontColor,
          swipeEnabled: false,
        }}>
        <Tab.Screen
          name={ROUTE_NAMES.journals}
          component={JournalsScreen}
          options={{
            title: lang('Все журналы', localization),
          }}
        />
        <Tab.Screen
          name={ROUTE_NAMES.myJournlas}
          component={MyJournalScreen}
          options={{
            title: lang('Купленные журналы', localization),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  screen: {
    backgroundColor: '#fff',
  },
  tabBarStyle: {
    backgroundColor: APP_COLORS.tabBg,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
  },
  tabBarItemStyle: {
    borderRadius: 6,
  },
  tabBarLabelStyle: {
    fontSize: 15,
    lineHeight: 20,
    textTransform: 'none',
    textAlign: 'center',
  },
  tabBarIndicatorContainerStyle: {
    borderRadius: 6,
    margin: 2,
    paddingHorizontal: 4,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 0},
    // shadowOpacity: 0.04,
    // shadowRadius: 2,
    // elevation: 1,
  },
  tabBarIndicatorStyle: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
});

export default JournalNavigator;
