import {
  Linking,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import NavButtonRow from '../../../components/view/NavButtonRow';
import SectionView from '../../../components/view/SectionView';
import {
  BellIcon,
  CalendarIcon,
  CallCenterIcon,
  History,
  iconNext,
  JournalIcon,
  NewsIcon,
  OfflineCoursesIcon,
  Password,
  RatingIcon,
  ReclamentIcon,
  ScheduleIcon,
  Settings,
  SettingsIcon,
  UbtIcon,
} from '../../../assets/icons';
import { useSettings } from '../../../components/context/Provider';
import { ROUTE_NAMES } from '../../../components/navigation/routes';
import DevView from '../../../components/view/DevView';
import { useFetching } from '../../../hooks/useFetching';
import { ProfileService } from '../../../services/API';
import { setFontStyle } from '../../../utils/utils';
import { APP_COLORS, N_STATUS, STORAGE, WIDTH } from '../../../constants/constants';
import LoadingScreen from '../../../components/LoadingScreen';
import { storeObject } from '../../../storage/AsyncStorage';
import { lang } from '../../../localization/lang';
import { useLocalization } from '../../../components/context/LocalizationProvider';
import { navHeaderOptions } from '../../../components/navigation/navHeaderOptions';
import FastImage from 'react-native-fast-image';

const ProfileScreen = ({ navigation, route }) => {
  const { profile } = route.params;
  const { localization } = useLocalization();

  const { settings, isRead, setIsRead, nstatus } = useSettings();
  const [dataSource, setDataSource] = useState({
    data: null,
    refreshing: false,
  });

  useLayoutEffect(() => {
    let navigationOptions = navHeaderOptions(
      lang('Мой профиль', localization),
    );
    navigationOptions.headerTitleAlign = 'center',
      navigationOptions.headerRight = renderHeaderRight;
    navigationOptions.headerLeft = null;
    navigation.setOptions(navigationOptions);
  }, [isRead]);

  const MENU = [
    {
      section: lang('МОЙ ПРОФИЛЬ', localization),
      enabled: true,
      data: [
        {
          id: 1,
          text: lang('История оплаты', localization),
          iconLeft: <History color={settings?.color_app} />,
          enabled: nstatus !== N_STATUS,
          action: 'navigation',
          route: ROUTE_NAMES.history,
        },
        {
          id: 2,
          text: lang('Расписание', localization),
          iconLeft: <ScheduleIcon color={settings?.color_app} />,
          enabled: nstatus !== N_STATUS,
          route: ROUTE_NAMES.scheduleNavigator,
          action: 'navigation',
        },
        {
          id: 3,
          text: lang('Сменить пароль', localization),
          iconLeft: <Password color={settings?.color_app} />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.changePassword,
        },
        {
          id: 4,
          text: lang('Настройки', localization),
          iconLeft: <Settings color={settings?.color_app} />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.settings,
        },
      ],
    },
    {
      section: lang('МЕНЮ', localization),
      enabled: true,
      data: [
        {
          id: 0,
          text: lang('ЕНТ', localization),
          iconLeft: <UbtIcon color={settings?.color_app} />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_ubt,
          action: 'navigation',
          route: ROUTE_NAMES.selectSubjects,
        },
        {
          id: 1,
          text: lang('Журнал', localization),
          iconLeft: <JournalIcon color={settings?.color_app} />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_journals,
          action: 'navigation',
          route: ROUTE_NAMES.journalNavigator,
        },
        {
          id: 2,
          text: lang('Рейтинг', localization),
          iconLeft: <RatingIcon color={settings?.color_app} />,
          enabled: settings?.modules_enabled_rating,
          action: 'navigation',
          route: ROUTE_NAMES.rating,
        },
        // {
        //   id: 3,
        //   text: lang('Реферальная программа', localization),
        //   iconLeft: <Referal />,
        // },
        {
          id: 4,
          text: lang('Новости', localization),
          iconLeft: <NewsIcon color={settings?.color_app} />,
          enabled: settings?.modules_enabled_news,
          action: 'navigation',
          route: ROUTE_NAMES?.news,
        },
        {
          id: 5,
          text: lang('Правила и соглашения', localization),
          iconLeft: <ReclamentIcon color={settings?.color_app} />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES?.privacy,
        },
        {
          id: 6,
          text: lang('Офлайн курсы', localization),
          iconLeft: <OfflineCoursesIcon color={settings?.color_app} />,
          action: 'navigation',
          enabled:
            nstatus !== N_STATUS && settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCourses,
        },
        {
          id: 7,
          text: lang('Календарь', localization),
          iconLeft: <CalendarIcon color={settings?.color_app} />,
          action: 'navigation',
          enabled:
            nstatus !== N_STATUS && settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCalendar,
        },
      ],
    },
    {
      section: lang('ПОМОЩЬ', localization),
      enabled: nstatus !== N_STATUS && settings?.phone?.length,
      data: [
        {
          id: 1,
          text: settings?.phone,
          iconLeft: <CallCenterIcon color={settings?.color_app} />,
          action: 'call',
          enabled: settings?.phone?.length,
        },
      ],
    },
  ];

  const onAction = item => {
    const { navigate } = navigation;
    switch (item?.action) {
      case 'navigation':
        if (item?.route == ROUTE_NAMES.settings) {
          global.reloadProfile = fetchProfile;
          navigate(item?.route, {
            userEmail: dataSource?.data?.email,
            notification_push_enable:
              dataSource?.data?.notification_push_enable,
          });
        } else {
          navigate(item?.route);
        }

        break;
      case 'call':
        if (item?.text?.length) {
          Linking.openURL(`tel:${item?.text}`);
        }
        break;
    }
  };

  const [fetchProfile, isLoading, error] = useFetching(async () => {
    const response = await ProfileService.fetchProfile();
    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
      refreshing: false,
    }));
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchProfile();
    }
  }, [profile]);

  useEffect(() => {
    if (dataSource?.refreshing) {
      fetchProfile();
    }
  }, [dataSource?.refreshing]);

  const onRefresh = useCallback(() => {
    setDataSource(prev => ({
      ...prev,
      refreshing: true,
    }));
  }, []);

  const onPressNotification = async () => {
    await storeObject(STORAGE.isRead, true);
    setIsRead(true);
    navigation.navigate(ROUTE_NAMES.notifications);
  };

  const renderHeaderRight = () => (
    <TouchableOpacity
      activeOpacity={0.65}
      onPress={onPressNotification}
      style={styles.iconNotifications}
    >
      <BellIcon isRead={isRead} color={APP_COLORS.gray} />
    </TouchableOpacity>
  );

  const getInitials = (name = '') => {
    const nameParts = name.trim().split(' ');

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase() + nameParts[0].charAt(0).toUpperCase();
    }

    console.log('Initials', nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase())

    return nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  };


  // const renderHeaderRight = () => (
  //   <TouchableOpacity
  //     activeOpacity={0.65}
  //     style={styles.iconSettings}
  //   >
  //     <SettingsIcon color={APP_COLORS.gray} />
  //   </TouchableOpacity>
  // );

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log('Data:::', dataSource)

  return (
    <UniversalView
      haveScroll
      refreshControl={
        <RefreshControl
          refreshing={dataSource?.refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <StatusBar backgroundColor={settings?.color_app} barStyle="light-content" />
      <View style={[styles.header, { backgroundColor: settings?.color_app }]} />
      <View style={styles.avatarContainer}>
        {dataSource?.data?.avatar ? (
          <FastImage
            source={{
              uri: dataSource?.data?.avatar,
              priority: 'high',
            }}
            style={styles.avatar}
          />) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(dataSource?.data?.name)}
            </Text>
          </View>
        )}
      </View>
      <View style={{ backgroundColor: settings?.color_app }}>
        <View style={styles.mainView}>

          <View style={styles.profileInfoContainer}>
            <Text style={styles.profileName}>
              {dataSource?.data?.name}
            </Text>
            <Text style={styles.profileEmailPhone}>
              {dataSource?.data?.email}
            </Text>
            <Text style={styles.profileEmailPhone}>
              {dataSource?.data?.phone}
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.setParams({ profile: false });
                navigation.navigate(ROUTE_NAMES.profileEdit, {
                  profileEdit: dataSource?.data,
                });
              }}
              activeOpacity={0.9}
              style={styles.editProfileButton}
            >
              <Text style={[styles.editProfileButtonText, { color: settings?.color_app }]}>
                {lang('Редактировать профиль', localization)}
              </Text>
            </TouchableOpacity>
          </View>

          {MENU.filter(m => m?.enabled).map((s, sKey) => (
            <View style={styles.mainView}>
              <Fragment key={sKey.toString()}>
                <SectionView label={s.section} />
                <View style={styles.niceCirclyView}>
                  {s.data
                    .filter(fd => fd?.enabled)
                    .map((d, dKey) => {
                      return (
                        <NavButtonRow
                          key={dKey.toString()}
                          leftIcon={d.iconLeft}
                          title={d.text}
                          style={styles.view}
                          item={d}
                          onPress={onAction}
                        />
                      );
                    })}
                </View>
              </Fragment>
            </View>
          ))}

        </View>
      </View>
      {nstatus !== N_STATUS && settings?.field_enabled_logo_buginsoft ? (
        <DevView />
      ) : null}
    </UniversalView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingBottom: 90,
    backgroundColor: APP_COLORS.primary,
  },
  view: {
    paddingLeft: 20,
    paddingRight: 16,
  },
  profileView: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  profileInfoView: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  name: {
    ...setFontStyle(17, '600'),
    marginBottom: 4,
  },
  email: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 4,
  },
  phone: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 8,
  },
  editButton: {
    width: 343,
    height: 44,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 10,
    borderRadius: 24,
    backgroundColor: APP_COLORS.lightgray,
  },
  editButtonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    lineHeight: 12,
    letterSpacing: 0.16,
    textAlign: 'center',
  },
  universalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: APP_COLORS.white,
    paddingBottom: 12,
  },
  primaryBackgroundView: {
    backgroundColor: APP_COLORS.primary,
  },
  avatarContainer: {
    position: 'absolute',
    top: 25,
    zIndex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    top: 12,
    left: WIDTH/2-60,
    paddingVertical: 40,
    paddingHorizontal: 22,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: APP_COLORS.gray,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
  },
  avatarText: {
    fontSize: 40,
    color: APP_COLORS.white,
    fontWeight: '500',
    lineHeight: 40,
    letterSpacing: 0.16,
    textAlign: 'center',
  },
  profileInfoContainer: {
    marginTop: 60, // Adjust according to the avatar height
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  profileName: {
    ...setFontStyle(18, '500', APP_COLORS.black),
    textAlign: 'center',
    letterSpacing: 0.8,
    marginTop: 10,
  },
  profileEmailPhone: {
    ...setFontStyle(12, '500', APP_COLORS.darkgray),
    marginTop: 5,
    textAlign: 'center',
    letterSpacing: 0.6,
  },
  editProfileButton: {
    width: 343,
    height: 46,
    marginTop: 15,
    paddingVertical: 16,
    paddingHorizontal: 12,
    gap: 10,
    borderRadius: 24,
    backgroundColor: APP_COLORS.lightgray,
  },
  editProfileButtonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    lineHeight: 14,
    letterSpacing: 0.25,
    textAlign: 'center',
  },
  niceCirclyView: {
    marginHorizontal: 16,
    gap: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: APP_COLORS.lightgray,
  },
  iconNotifications: {
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
  iconSettings: {
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




