import {View, Text, StyleSheet} from 'react-native';
import React, {Fragment} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {strings} from '../../../localization';
import NavButtonRow from '../../../components/view/NavButtonRow';
import SectionView from '../../../components/view/SectionView';
import {
  Calendar,
  History,
  Journal,
  NewsIcon,
  Password,
  Rating,
  Reclament,
  Referal,
  Settings,
} from '../../../assets/icons';
import {useSettings} from '../../../components/context/Provider';

const ProfileScreen = () => {
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
          iconLeft: <Calendar />,
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
          iconLeft: <Journal />,
          enabled: settings?.modules_enabled_journals,
        },
        {
          id: 2,
          text: settings?.modules_enabled_rating_title,
          iconLeft: <Rating />,
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
        },
        {
          id: 5,
          text: strings['Правила и соглашения'],
          iconLeft: <Reclament />,
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
        },
      ],
    },
  ];

  return (
    <UniversalView haveLoader={false} haveScroll>
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
              />
            );
          })}
        </Fragment>
      ))}
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingLeft: 20,
    paddingRight: 16,
  },
});

export default ProfileScreen;
