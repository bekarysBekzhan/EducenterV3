import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {Fragment} from 'react';
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
import {strings} from '../../../localization';
import SectionView from '../../../components/view/SectionView';
import NavButtonRow from '../../../components/view/NavButtonRow';
import RowView from '../../../components/view/RowView';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../../utils/utils';
import {APP_COLORS} from '../../../constans/constants';
import DevView from '../../../components/view/DevView';
import {useSettings} from '../../../components/context/Provider';
import {ROUTE_NAMES} from '../../../components/navigation/routes';

const MenuScreen = ({navigation}) => {
  const {settings} = useSettings();

  const MENU = [
    {
      section: 'Меню',
      enabled: true,
      data: [
        {
          id: 1,
          text: settings?.modules_enabled_ubt_title,
          iconLeft: <UbtIcon />,
          enabled: settings?.modules_enabled_ubt,
        },
        {
          id: 2,
          text: settings?.modules_enabled_journals_title,
          iconLeft: <JournalIcon />,
          enabled: settings?.modules_enabled_journals,
        },
        {
          id: 3,
          text: settings?.modules_enabled_schedules_title,
          iconLeft: <JournalIcon />,
          enabled: settings?.modules_enabled_schedules,
        },
        {
          id: 2,
          text: settings?.modules_enabled_rating_title,
          iconLeft: <RatingIcon />,
          enabled: settings?.modules_enabled_rating,
        },
        // {
        //     id: 3,
        //     text: strings['Реферальная программа'],
        //     iconLeft: <Referal />,
        //     enabled: settings?.
        // },
        {
          id: 4,
          text: settings?.modules_enabled_news_title,
          iconLeft: <NewsIcon />,
          enabled: settings?.modules_enabled_news,
          route: ROUTE_NAMES.news,
          action: 'navigation',
        },
        {
          id: 5,
          text: settings?.modules_enabled_offline_courses_title,
          iconLeft: <ReclamentIcon />,
          enabled: settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCourses,
          action: 'navigation',
        },
        {
          id: 6,
          text: strings.Календарь,
          iconLeft: <CalendarIcon />,
          enabled: settings?.modules_enabled_offline_courses,
          route: ROUTE_NAMES.offlineCalendar,
          action: 'navigation',
        },
        {
          id: 7,
          text: strings['Правила и соглашения'],
          iconLeft: <ReclamentIcon />,
          enabled: true,
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
          enabled: true,
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
        if (item?.route == ROUTE_NAMES.news) {
          navigate(item?.route);
        }
        if (item?.route == ROUTE_NAMES.offlineCourses) {
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
          <Text style={styles.profileText}>{strings['Ваш профиль']}</Text>
          <Text style={styles.profileLabel}>
            {strings['Войдите в профиль или создайте новый']}
          </Text>

          <Text style={styles.profileAction}>
            <Text onPress={authLoginNavigation}>{strings.Войти}</Text>
            <Text style={styles.or}> {strings.или} </Text>
            <Text onPress={authRegisterNavigation}>
              {strings['Создайте новый']}
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
      {settings?.field_enabled_logo_buginsoft ? <DevView /> : null}
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
