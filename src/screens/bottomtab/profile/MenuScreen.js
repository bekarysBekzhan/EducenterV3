import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {Fragment, useLayoutEffect} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {
  CalendarIcon,
  CallCenterIcon,
  JournalIcon,
  NewsIcon,
  RatingIcon,
  ReclamentIcon,
  UbtIcon,
} from '../../../assets/icons';
import SectionView from '../../../components/view/SectionView';
import NavButtonRow from '../../../components/view/NavButtonRow';
import RowView from '../../../components/view/RowView';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../../utils/utils';
import {APP_COLORS, N_STATUS} from '../../../constans/constants';
import DevView from '../../../components/view/DevView';
import {useSettings} from '../../../components/context/Provider';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import {navHeaderOptions} from '../../../components/navigation/navHeaderOptions';
import {useLocalization} from '../../../components/context/LocalizationProvider';
import {lang} from '../../../localization/lang';

const MenuScreen = ({navigation}) => {
  const {settings, nstatus, isAuth} = useSettings();
  const {localization} = useLocalization();

  useLayoutEffect(() => {
    navigation.setOptions(
      navHeaderOptions(settings?.logo, lang('Меню', localization)),
    );
  }, []);

  const MENU = [
    {
      section: lang('Меню', localization),
      enabled: true,
      data: [
        {
          id: 1,
          text: lang('ЕНТ', localization),
          iconLeft: <UbtIcon />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_ubt,
          route: ROUTE_NAMES.selectSubjects,
          action: 'navigation',
        },
        {
          id: 2,
          text: lang('Журнал', localization),
          iconLeft: <JournalIcon />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_journals,
          route: ROUTE_NAMES.journalNavigator,
          action: 'navigation',
        },
        {
          id: 3,
          text: lang('Расписания', localization),
          iconLeft: <JournalIcon />,
          enabled: nstatus !== N_STATUS && settings?.modules_enabled_schedules,
          route: ROUTE_NAMES.login,
          action: 'navigation',
        },
        {
          id: 2,
          text: lang('Рейтинг', localization),
          iconLeft: <RatingIcon />,
          enabled: isAuth && settings?.modules_enabled_rating,
          route: ROUTE_NAMES.rating,
          action: 'navigation',
        },
        // {
        //     id: 3,
        //     text: strings['Реферальная программа'],
        //     iconLeft: <Referal />,
        //     enabled: settings?.
        // },
        {
          id: 4,
          text: lang('Новости', localization),
          iconLeft: <NewsIcon />,
          enabled: settings?.modules_enabled_news,
          route: ROUTE_NAMES.news,
          action: 'navigation',
        },
        {
          id: 5,
          text: lang('Офлайн курсы', localization),
          iconLeft: <ReclamentIcon />,
          enabled:
            nstatus !== N_STATUS && settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCourses,
          action: 'navigation',
        },
        {
          id: 6,
          text: lang('Календарь', localization),
          iconLeft: <CalendarIcon />,
          enabled:
            nstatus !== N_STATUS && settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCalendar,
          action: 'navigation',
        },
        {
          id: 7,
          text: lang('Правила и соглашения', localization),
          iconLeft: <ReclamentIcon />,
          enabled: true,
          route: ROUTE_NAMES.privacy,
          action: 'navigation',
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
          enabled: nstatus !== N_STATUS,
          action: 'call',
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
        // if (item?.route == ROUTE_NAMES.news) {
        //   navigate(item?.route);
        // }
        // if (item?.route == ROUTE_NAMES.offlineCourses) {
        //   navigate(item?.route);
        // }
        break;
      case 'call':
        if (item?.text?.length) {
          Linking.openURL(`tel:${item?.text}`);
        }
        break;
    }
  };

  const authLoginNavigation = () => {
    navigation.navigate(ROUTE_NAMES.login);
  };

  const authRegisterNavigation = () => {
    navigation.navigate(ROUTE_NAMES.register);
  };

  console.log('-----', settings);

  return (
    <UniversalView haveScroll>
      <RowView style={styles.row}>
        <FastImage
          source={require('../../../assets/images/profile.png')}
          style={styles.profile}
        />
        <View style={styles.infoView}>
          <Text style={styles.profileText}>
            {lang('Ваш профиль', localization)}
          </Text>
          <Text style={styles.profileLabel}>
            {lang('Войдите в профиль или создайте новый', localization)}
          </Text>

          <Text style={styles.profileAction}>
            <Text onPress={authLoginNavigation}>
              {lang('Войти', localization)}
            </Text>
            <Text style={styles.or}> {lang('или', localization)} </Text>
            <Text onPress={authRegisterNavigation}>
              {lang('Создайте новый', localization)}
            </Text>
          </Text>
        </View>
      </RowView>

      {MENU.filter(m => m.enabled).map((s, sKey) => (
        <Fragment key={sKey.toString()}>
          <SectionView label={s.section} />
          {s.data
            .filter(fd => fd.enabled)
            .map((d, dKey) => (
              <NavButtonRow
                item={d}
                leftIcon={d.iconLeft}
                style={styles.view}
                key={dKey.toString()}
                title={d.text}
                onPress={onAction}
              />
            ))}
        </Fragment>
      ))}
      {nstatus !== N_STATUS && settings?.field_enabled_logo_buginsoft ? (
        <DevView />
      ) : null}
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 16,
  },
  row: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  profile: {
    alignSelf: 'flex-start',
    width: 56,
    height: 56,
  },
  infoView: {
    flex: 1,
    alignSelf: 'stretch',
    marginLeft: 12,
  },
  profileText: {
    ...setFontStyle(17, '600'),
    marginBottom: 4,
  },
  profileLabel: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
    marginBottom: 12,
  },
  profileAction: {
    ...setFontStyle(15, '400', APP_COLORS.primary),
  },
  or: {
    color: APP_COLORS.placeholder,
  },
});

export default MenuScreen;
