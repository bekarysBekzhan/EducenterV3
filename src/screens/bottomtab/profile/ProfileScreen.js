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
import {strings} from '../../../localization';
import NavButtonRow from '../../../components/view/NavButtonRow';
import SectionView from '../../../components/view/SectionView';
import {
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
} from '../../../assets/icons';
import {useSettings} from '../../../components/context/Provider';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import DevView from '../../../components/view/DevView';
import FastImage from 'react-native-fast-image';
import RowView from '../../../components/view/RowView';
import {useFetching} from '../../../hooks/useFetching';
import {ProfileService} from '../../../services/API';
import {setFontStyle} from '../../../utils/utils';
import {APP_COLORS} from '../../../constans/constants';
import {navHeaderOptions} from '../../../components/navigation/navHeaderOptions';
import LoadingScreen from '../../../components/LoadingScreen';

const ProfileScreen = ({navigation, route}) => {
  const {profile} = route.params;
  const {settings} = useSettings();
  const [dataSource, setDataSource] = useState({
    data: null,
    refreshing: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions(navHeaderOptions(settings?.logo, strings.Меню));
  }, []);

  const MENU = [
    {
      section: strings['Мои профиль'],
      enabled: true,
      data: [
        {
          id: 1,
          text: strings['История оплаты'],
          iconLeft: <History />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.history,
        },
        {
          id: 2,
          text: 'Расписание',
          iconLeft: <CalendarIcon />,
          enabled: true,
          route: ROUTE_NAMES.scheduleNavigator,
          action: 'navigation',
        },
        {
          id: 3,
          text: strings['Сменить пароль'],
          iconLeft: <Password />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.changePassword,
        },
        {
          id: 4,
          text: strings.Настройки,
          iconLeft: <Settings />,
          enabled: true,
          action: 'navigation',
          route: ROUTE_NAMES.settings,
        },
      ],
    },
    {
      section: 'Меню',
      enabled: true,
      data: [
        {
          id: 1,
          text: settings?.modules_enabled_journals_title,
          iconLeft: <JournalIcon />,
          enabled: settings?.modules_enabled_journals,
          action: 'navigation',
          route: ROUTE_NAMES.journalNavigator,
        },
        {
          id: 2,
          text: settings?.modules_enabled_rating_title,
          iconLeft: <RatingIcon />,
          enabled: settings?.modules_enabled_rating,
        },
        // {
        //   id: 3,
        //   text: strings['Реферальная программа'],
        //   iconLeft: <Referal />,
        // },
        {
          id: 4,
          text: settings?.modules_enabled_news_title,
          iconLeft: <NewsIcon />,
          enabled: settings?.modules_enabled_news,
          action: 'navigation',
          route: ROUTE_NAMES?.news,
        },
        {
          id: 5,
          text: strings['Правила и соглашения'],
          iconLeft: <ReclamentIcon />,
          enabled: true,
        },

        {
          id: 6,
          text: settings?.modules_enabled_offline_courses_title,
          iconLeft: <ReclamentIcon />,
          action: 'navigation',
          enabled: settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCourses,
        },
      ],
    },
    {
      section: strings.Помощь,
      enabled: settings?.phone?.length,
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
    console.log('item', item);
    switch (item?.action) {
      case 'navigation':
        navigate(item?.route);
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
              {strings['Редактировать профиль']}
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
      {settings?.field_enabled_logo_buginsoft ? <DevView /> : null}
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
