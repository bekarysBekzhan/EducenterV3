import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import UniversalView from '../components/view/UniversalView';
import SectionView from '../components/view/SectionView';
import SettingItem from '../components/item/SettingItem';
import {strings} from '../localization';
import Empty from '../components/Empty';
import {ExitIcon} from '../assets/icons';
import RowView from '../components/view/RowView';
import {setFontStyle} from '../utils/utils';
import {API_V2} from '../services/axios';
import {N_STATUS, REQUEST_HEADERS, STORAGE} from '../constants/constants';
import {
  getObject,
  removeStorage,
  storeObject,
  storeString,
} from '../storage/AsyncStorage';
import {useFetching} from '../hooks/useFetching';
import {ProfileService, SettingsService} from '../services/API';
import SelectOption from '../components/SelectOption';
import {useSettings} from '../components/context/Provider';
import {ROUTE_NAMES} from '../components/navigation/routes';
import {CommonActions} from '@react-navigation/native';
import SimpleButton from '../components/button/SimpleButton';
import {useToggle} from '../hooks/useToggle';
import {useLocalization} from '../components/context/LocalizationProvider';
import {lang} from '../localization/lang';

const SettingsScreen = ({navigation, route}) => {
  const {localization} = useLocalization();

  const userEmail = route?.params?.userEmail;
  const notification_push_enable = route?.params?.notification_push_enable;

  const [dataSource, setDataSource] = useState({
    refreshing: false,
    list: [],
    isReminderCourse: false,
    currentKey: strings.getLanguage(),
  });

  const [isTogglePushAction, setIsTogglePushAction] = useToggle(
    notification_push_enable,
  );
  const {setIsAuth, settings, nstatus} = useSettings();

  const [fetchSettings, isLoading, error] = useFetching(async () => {
    const response = await SettingsService.fetchLanguage();
    setDataSource(prev => ({
      ...prev,
      list: Object.entries(response?.data?.data).map(([id, data]) => ({
        id,
        data,
        selected: false,
      })),
    }));
  });

  const [fetchSettingsPush] = useFetching(async () => {
    let params = {
      notification_push_enable: Number(isTogglePushAction),
      email: userEmail,
    };
    const res = await ProfileService.fetchProfileUpdate(params);
    if (global?.reloadProfile) {
      global?.reloadProfile();
    }
    console.log('fetchSettingsPush: ', res);
  });

  useEffect(() => {
    fetchSettings();
    (async () => {
      let value = await getObject(STORAGE.pushEnabled);
      setDataSource(prev => ({...prev, isTogglePushAction: value}));
    })();
  }, []);

  useEffect(() => {
    fetchSettingsPush();
    (async () => await storeObject(STORAGE.pushEnabled, isTogglePushAction))();
  }, [isTogglePushAction]);

  const onExit = async () => {
    await removeStorage(STORAGE.userToken);
    delete API_V2.defaults.headers[REQUEST_HEADERS.Authorization];
    setIsAuth(false);
    if (nstatus === N_STATUS) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: ROUTE_NAMES.bottomTab}],
        }),
      );
    } else {
      if (settings?.marketplace_enabled) {
        navigation.replace(ROUTE_NAMES.login);
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: ROUTE_NAMES.bottomTab}],
          }),
        );
      }
    }
  };

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const selectKeyPressed = async key => {
    if (dataSource?.currentKey !== key) {
      const langDB = await SettingsService.fetchLanguage();
      if (langDB?.data?.data) {
        localization.current = langDB?.data?.data[key];
      }
      await storeString(STORAGE.language, key);
      setDataSource(prev => ({
        ...prev,
        currentKey: key,
      }));
      strings.setLanguage(key);
      API_V2.defaults.headers[REQUEST_HEADERS.lang] = key;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: ROUTE_NAMES.bottomTab}],
        }),
      );
    }
  };

  const renderItem = useCallback(
    ({item, index}) => (
      <SelectOption
        label={item?.data?.name}
        value={item?.id}
        selectKeyPressed={selectKeyPressed}
        currentKey={dataSource?.currentKey}
      />
    ),
    [dataSource?.currentKey],
  );

  const renderEmpty = <Empty style={styles.empty} />;

  const renderHeader = dataSource?.list.length ? (
    <SectionView label={lang('Выберите язык', localization)} />
  ) : null;

  const navigationDeleteAccountScreen = () => {
    navigation.navigate(ROUTE_NAMES.deleteAccount);
  };

  const renderFooter = (
    <View>
      {nstatus === N_STATUS ? null : (
        <SectionView label={lang('Уведомление', localization)} />
      )}
      {nstatus === N_STATUS ? null : (
        <SettingItem
          text={lang('Уведомления о действиях', localization)}
          value={isTogglePushAction}
          onValueChange={setIsTogglePushAction}
          settings={settings}
        />
      )}
      <SimpleButton
        style={styles.navButton}
        text={lang('Удалить аккаунт', localization)}
        onPress={navigationDeleteAccountScreen}></SimpleButton>

      {/* <SettingItem
        text={strings['Напоминание о прохождении курса']}
        label={strings['Еженедельные напоминание о прохождения курса']}
        value={dataSource?.isReminderCourse}
        onValueChange={isReminderCourse =>
          setDataSource(prev => ({...prev, isReminderCourse}))
        }
      /> */}

      <TouchableOpacity activeOpacity={0.9} onPress={onExit}>
        <RowView style={styles.row}>
          <ExitIcon />
          <Text style={styles.exit}>
            {lang('Выход из аккаунта', localization)}
          </Text>
        </RowView>
      </TouchableOpacity>
    </View>
  );

  return (
    <UniversalView haveLoader={isLoading}>
      <FlatList
        data={dataSource?.list}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  row: {
    margin: 16,
  },
  exit: {
    ...setFontStyle(17, '400', '#FF3B30'),
    marginHorizontal: 18,
  },
  empty: {
    marginBottom: 16,
  },
  navButton: {
    paddingVertical: 16,
    marginHorizontal: 16,
  },
});

export default SettingsScreen;
