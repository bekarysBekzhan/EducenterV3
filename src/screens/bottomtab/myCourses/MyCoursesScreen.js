import React from 'react';
import UniversalView from '../../../components/view/UniversalView';
import MyCoursesTab from './MyCoursesTab';
import MyTestsTab from './MyTestsTab';
import MyTasksTab from './MyTasksTab';
import TopTab from '../../../components/view/TopTab';
import WhatsappButton from '../../../components/button/WhatsappButton';
import {useSettings} from '../../../components/context/Provider';
import {N_STATUS} from '../../../constans/constants';
import {useLocalization} from '../../../components/context/LocalizationProvider';
import {lang} from '../../../localization/lang';

const MyCoursesScreen = props => {
  const {nstatus} = useSettings();
  const {localization} = useLocalization();

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
    <UniversalView>
      <TopTab screens={screens} swipeEnabled={true} />
      {nstatus === N_STATUS ? null : <WhatsappButton />}
    </UniversalView>
  );
};

export default MyCoursesScreen;
