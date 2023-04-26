import {
  Linking,
  RefreshControl,
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
  Password,
  RatingIcon,
  ReclamentIcon,
  Settings,
  UbtIcon,
} from '../../../assets/icons';
import {useSettings} from '../../../components/context/Provider';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import DevView from '../../../components/view/DevView';
import FastImage from 'react-native-fast-image';
import RowView from '../../../components/view/RowView';
import {useFetching} from '../../../hooks/useFetching';
import {ProfileService} from '../../../services/API';
import {setFontStyle} from '../../../utils/utils';
import {APP_COLORS, N_STATUS, STORAGE} from '../../../constans/constants';
import {navHeaderOptions} from '../../../components/navigation/navHeaderOptions';
import LoadingScreen from '../../../components/LoadingScreen';
import {storeObject} from '../../../storage/AsyncStorage';
import {lang} from '../../../localization/lang';
import {useLocalization} from '../../../components/context/LocalizationProvider';

const ProfileScreen = ({navigation, route}) => {
  const {profile} = route.params;
  const {localization} = useLocalization();

  const {settings, isRead, setIsRead, nstatus} = useSettings();
  const [dataSource, setDataSource] = useState({
    data: null,
    refreshing: false,
  });

  useLayoutEffect(() => {
    let navigationOptions = navHeaderOptions(
      settings?.logo,
      lang('Меню', localization),
    );
    if (nstatus !== N_STATUS) {
      navigationOptions.headerRight = renderHeaderRight;
    }
    navigation.setOptions(navigationOptions);
  }, [isRead]);

  const MENU = [
    {
      section: lang('Мои профиль', localization),
      enabled: true,
      data: [
        {
          id: 1,
          text: lang('История оплаты', localization),
          iconLeft: <History />,
          enabled: nstatus !== N_STATUS,
          action: 'navigation',
          route: ROUTE_NAMES.history,
        },
        {
          id: 2,
          text: lang('Расписание', localization),
          iconLeft: <CalendarIcon />,
          enabled: nstatus !== N_STATUS,
          route: ROUTE_NAMES.scheduleNavigator,
          action: 'navigation',
        },
        {
          id: 3,
          text: lang('Сменить пароль', localization),
          iconLeft: <Password />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.changePassword,
        },
        {
          id: 4,
          text: lang('Настройки', localization),
          iconLeft: <Settings />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.settings,
        },
      ],
    },
    {
      section: lang('Меню', localization),
      enabled: true,
      data: [
        {
          id: 0,
          text: lang('ЕНТ', localization),
          iconLeft: <UbtIcon />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_ubt,
          action: 'navigation',
          route: ROUTE_NAMES.selectSubjects,
        },
        {
          id: 1,
          text: lang('Журнал', localization),
          iconLeft: <JournalIcon />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_journals,
          action: 'navigation',
          route: ROUTE_NAMES.journalNavigator,
        },
        {
          id: 2,
          text: lang('Рейтинг', localization),
          iconLeft: <RatingIcon />,
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
          iconLeft: <NewsIcon />,
          enabled: settings?.modules_enabled_news,
          action: 'navigation',
          route: ROUTE_NAMES?.news,
        },
        {
          id: 5,
          text: lang('Правила и соглашения', localization),
          iconLeft: <ReclamentIcon />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES?.privacy,
        },
        {
          id: 6,
          text: lang('Офлайн курсы', localization),
          iconLeft: <ReclamentIcon />,
          action: 'navigation',
          enabled:
            nstatus !== N_STATUS && settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCourses,
        },
        {
          id: 7,
          text: lang('Календарь', localization),
          iconLeft: <CalendarIcon />,
          action: 'navigation',
          enabled:
            nstatus !== N_STATUS && settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCalendar,
        },
      ],
    },
    {
      section: lang('Помощь', localization),
      enabled: nstatus !== N_STATUS && settings?.phone?.length,
      data: [
        {
          id: 1,
          text: settings?.phone,
          iconLeft: <CallCenterIcon />,
          action: 'call',
          enabled: settings?.phone?.length,
        },
      ],
    },
  ];

  const onAction = item => {
    const {navigate} = navigation;
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
    <TouchableOpacity activeOpacity={0.65} onPress={onPressNotification}>
      <BellIcon isRead={isRead} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView
      haveScroll
      refreshControl={
        <RefreshControl
          refreshing={dataSource?.refreshing}
          onRefresh={onRefresh}
        />
      }>
      <TouchableOpacity
        onPress={() => {
          navigation.setParams({profile: false});
          navigation.navigate(ROUTE_NAMES.profileEdit, {
            profileEdit: dataSource?.data,
          });
        }}
        activeOpacity={0.9}>
        <RowView style={styles.profileView}>
          <FastImage
            source={{
              uri: dataSource?.data?.avatar,
              priority: 'high',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfoView}>
            <Text numberOfLines={2} style={styles.name}>
              {dataSource?.data?.name}
            </Text>
            <Text numberOfLines={1} style={styles.email}>
              {dataSource?.data?.email}
            </Text>
            <Text numberOfLines={1} style={styles.phone}>
              {dataSource?.data?.phone}
            </Text>
            <Text style={styles.editButton}>
              {lang('Редактировать профиль', localization)}
            </Text>
          </View>
          {iconNext}
        </RowView>
      </TouchableOpacity>
      {MENU.filter(m => m?.enabled).map((s, sKey) => (
        <Fragment key={sKey.toString()}>
          <SectionView label={s.section} />
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
        </Fragment>
      ))}
      {nstatus !== N_STATUS && settings?.field_enabled_logo_buginsoft ? (
        <DevView />
      ) : null}
    </UniversalView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
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
  avatar: {
    alignSelf: 'flex-start',
    width: 56,
    height: 56,
    borderRadius: 56,
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
    ...setFontStyle(15, '400', APP_COLORS.primary),
  },
});
