import {Linking, StyleSheet} from 'react-native';
import React, {Fragment} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {strings} from '../../../localization';
import NavButtonRow from '../../../components/view/NavButtonRow';
import SectionView from '../../../components/view/SectionView';
import {
  CalendarIcon,
  CallCenterIcon,
  History,
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

const ProfileScreen = ({navigation}) => {
  const {settings} = useSettings();

  const MENU = [
    {
      section: strings['Мои профиль'],
      data: [
        {
          id: 1,
          text: strings['История оплаты'],
          iconLeft: <History />,
        },
        {
          id: 2,
          text: 'Расписание',
          iconLeft: <CalendarIcon />,
        },
        {
          id: 3,
          text: strings['Сменить пароль'],
          iconLeft: <Password />,
        },
        {
          id: 4,
          text: strings.Настройки,
          iconLeft: <Settings />,
        },
      ],
    },
    {
      section: 'Меню',
      data: [
        {
          id: 1,
          text: settings?.modules_enabled_journals_title,
          iconLeft: <JournalIcon />,
          enabled: settings?.modules_enabled_journals,
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
      ],
    },
    {
      section: strings.Помощь,
      data: [
        {
          id: 1,
          text: settings?.phone,
          iconLeft: <CallCenterIcon />,
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
        break;
      case 'call':
        if (item?.text?.length) {
          Linking.openURL(`tel:${item?.text}`);
        }
        break;
    }
  };

  return (
    <UniversalView haveScroll>
      {MENU.map((s, sKey) => (
        <Fragment key={sKey.toString()}>
          <SectionView label={s.section} />
          {s.data.map((d, dKey) => {
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
});
