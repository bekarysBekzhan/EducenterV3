import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import { useSettings } from '../context/Provider';
import TasksScreen from '../../screens/bottomtab/tasks/TasksScreen';
import TaskDetailScreen from '../../screens/bottomtab/tasks/TaskDetailScreen';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import HeaderBar from '../HeaderBar';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constants/constants';
import { LeftArrowIcon, SearchIcon } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const TasksStack = createNativeStackNavigator();

const Tasks = () => {
  const { localization } = useLocalization();
  const TITLE = lang('Задания', localization);
  const navigation = useNavigation();

  const screens = [
    {
      name: ROUTE_NAMES.tasks,
      component: TasksScreen,
    },
    {
      name: ROUTE_NAMES.taskDetail,
      component: TaskDetailScreen,
    },
  ];

  const { settings } = useSettings();

  return (
    <View style={styles.mainView}>
      <TasksStack.Navigator>
        {screens.map((screen, index) => (
          <TasksStack.Screen
            name={screen.name}
            key={index}
            component={screen.component}
            options={{
              headerShown: true,
              headerTitle: lang('Задания', localization),
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
      </TasksStack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
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
});


export default Tasks;

