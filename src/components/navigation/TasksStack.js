import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTE_NAMES } from './routes';
import { useSettings } from '../context/Provider';
import TasksScreen from '../../screens/bottomtab/tasks/TasksScreen';
import TaskDetailScreen from '../../screens/bottomtab/tasks/TaskDetailScreen';
import { useLocalization } from '../context/LocalizationProvider';
import { lang } from '../../localization/lang';
import HeaderBar from '../HeaderBar';
import { StyleSheet, View } from 'react-native';

const TasksStack = createNativeStackNavigator();

const Tasks = () => {
  const { localization } = useLocalization();
  const TITLE = lang('Задания', localization);

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
              headerTitle: lang('Задания', localization),
              headerBackTitleVisible: false,
              headerTitleAlign: 'center',
              headerShown: false,
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
  }
});


export default Tasks;

