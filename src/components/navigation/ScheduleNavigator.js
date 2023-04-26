import React, {useLayoutEffect} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StyleSheet} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import {ROUTE_NAMES} from './routes';
import ScheduleLessonsScreen from '../../screens/schedule/ScheduleLessonScreen';
import ScheduleVisitsScreen from '../../screens/schedule/ScheduleVisitsScreen';
import {useNavigation} from '@react-navigation/native';
import {useLocalization} from '../context/LocalizationProvider';

const Tab = createMaterialTopTabNavigator();

const ScheduleNavigator = () => {
  const navigation = useNavigation();
  const {localization} = useLocalization();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: lang('Расписание', localization),
    });
  }, []);

  return (
    <Tab.Navigator
      style={styles.screen}
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarIndicatorContainerStyle: styles.tabBarIndicatorContainerStyle,
        tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
        tabBarInactiveTintColor: APP_COLORS.placeholder,
        tabBarActiveTintColor: APP_COLORS.font,
      }}>
      <Tab.Screen
        name={ROUTE_NAMES.scheduleLessons}
        component={ScheduleLessonsScreen}
        options={{title: lang('Уроки', localization)}}
      />
      <Tab.Screen
        name={ROUTE_NAMES.scheduleVisitis}
        component={ScheduleVisitsScreen}
        options={{title: lang('Посещения', localization)}}
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

export default ScheduleNavigator;
