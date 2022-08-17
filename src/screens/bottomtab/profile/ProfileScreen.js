import {View, Text} from 'react-native';
import React, {Fragment} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {strings} from '../../../localization';
import NavButtonRow from '../../../components/view/NavButtonRow';
import SectionView from '../../../components/view/SectionView';
import {Calendar, History, Password} from '../../../assets/icons';

const ProfileScreen = () => {
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
        },
      ],
    },
    {
      section: 'Меню',
      data: [
        {
          id: 1,
          text: 'Журнал',
        },
        {
          id: 2,
          text: strings.Рейтинг,
        },
        {
          id: 3,
          text: strings['Реферальная программа'],
        },
        {
          id: 4,
          text: strings.Новости,
        },
        {
          id: 5,
          text: strings['Правила и соглашения'],
        },
      ],
    },
    {
      section: 'Помощ',
      data: [
        {
          id: 1,
          text: '',
        },
        {
          id: 2,
          text: 'О сервисе ',
        },
      ],
    },
  ];

  return (
    <UniversalView haveLoader={false} haveScroll>
      {MENU.map(s => (
        <Fragment>
          <SectionView label={s.section} />
          {s.data.map(d => {
            return <NavButtonRow leftIcon={d.iconLeft} title={d.text} />;
          })}
        </Fragment>
      ))}
    </UniversalView>
  );
};

export default ProfileScreen;
