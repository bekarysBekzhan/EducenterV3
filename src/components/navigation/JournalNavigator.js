import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StyleSheet} from 'react-native';
import {useSettings} from '../context/Provider';
import {strings} from '../../localization';
import {APP_COLORS} from '../../constans/constants';
import {ROUTE_NAMES} from './routes';
import JournalsScreen from '../../screens/journal/JournalsScreen';
import MyJournalScreen from '../../screens/journal/MyJournalScreen';

const Tab = createMaterialTopTabNavigator();

const JournalNavigator = () => {
  const {isAuth} = useSettings();

  return (
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
          title: strings['Все журналы'],
        }}
      />
      <Tab.Screen
        name={ROUTE_NAMES.myJournlas}
        component={MyJournalScreen}
        options={{
          title: strings['Купленные журналы'],
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
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
