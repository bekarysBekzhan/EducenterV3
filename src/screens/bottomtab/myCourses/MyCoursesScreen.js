import React, { useLayoutEffect } from 'react';
import UniversalView from '../../../components/view/UniversalView';
import MyCoursesTab from './MyCoursesTab';
import MyTestsTab from './MyTestsTab';
import MyTasksTab from './MyTasksTab';
import TopTab from '../../../components/view/TopTab';
import WhatsappButton from '../../../components/button/WhatsappButton';
import { useSettings } from '../../../components/context/Provider';
import { APP_COLORS, N_STATUS } from '../../../constants/constants';
import { useLocalization } from '../../../components/context/LocalizationProvider';
import { lang } from '../../../localization/lang';
import HeaderBar from '../../../components/HeaderBar';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { navHeaderOptions } from '../../../components/navigation/navHeaderOptions';
import { SearchIcon } from '../../../assets/icons';
import { ROUTE_NAMES } from '../../../components/navigation/routes';
import { useNavigation } from '@react-navigation/native';

const MyCoursesScreen = props => {
  const { nstatus } = useSettings();
  const { localization } = useLocalization();
  const navigation = useNavigation();
  let route = ROUTE_NAMES.offlineCourseSearchScreen;
  const filters = {};

  useLayoutEffect(() => {
    let navigationOptions = navHeaderOptions(
      lang('Мои курсы', localization),
    );
    navigationOptions.headerRight = renderHeaderRight;
    navigationOptions.headerLeft = null;
    navigationOptions.headerTitleAlign = 'center';
    navigation.setOptions(navigationOptions);
  }, []);

  const renderHeaderRight = () => (
    <TouchableOpacity
      onPress={() => navigation.navigate(route, { filters })}
      style={styles.iconButton}
      activeOpacity={0.65}
    >
      <SearchIcon />
    </TouchableOpacity>
  );

  const screens = [
    {
      name: lang('Мои курсы', localization),
      component: MyCoursesTab,
    },
    {
      name: lang('Мои тесты', localization),
      component: MyTestsTab,
    },
    {
      name: lang('Мои задания', localization),
      component: MyTasksTab,
    },
  ];

  if (nstatus === N_STATUS) {
    return <MyCoursesTab {...props} />;
  }

  return (
    <UniversalView style={styles.universalView}>
      <View style={styles.topTabContainer}>
        <TopTab screens={screens} swipeEnabled={true} />
      </View>
      {nstatus === N_STATUS ? null : <WhatsappButton />}
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  // ... other styles
  universalView: {
    backgroundColor: APP_COLORS.primary,
  },
  topTabContainer: {
    flex: 1, // Ensure the container takes up the full available space
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', // Ensures content inside respects the border radius
    backgroundColor: APP_COLORS.white, // Add the background color you want
  },
  iconButton: {
    position: 'absolute',
    right: 0,
    padding: 10,
    backgroundColor: '#FFFFFF33',
    borderRadius: 31,
    width: 36,
    height: 36,
    paddingTop: 9,
    gap: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default MyCoursesScreen;
