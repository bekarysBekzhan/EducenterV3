import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNRestart from 'react-native-restart';
import UniversalView from '../components/view/UniversalView';
import SectionView from '../components/view/SectionView';
import SettingItem from '../components/item/SettingItem';
import {strings} from '../localization';
import Empty from '../components/Empty';
import {ExitIcon} from '../assets/icons';
import RowView from '../components/view/RowView';
import {setFontStyle} from '../utils/utils';
import {API_V2} from '../services/axios';
import {REQUEST_HEADERS, STORAGE} from '../constans/constants';
import {removeStorage, storeString} from '../storage/AsyncStorage';
import {useFetching} from '../hooks/useFetching';
import {SettingsService} from '../services/API';
import SelectOption from '../components/SelectOption';
import {useSettings} from '../components/context/Provider';
import {ROUTE_NAMES} from '../components/navigation/routes';
import {CommonActions} from '@react-navigation/native';

const SettingsScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    refreshing: false,
    list: [],
    isPushAction: false,
    isReminderCourse: false,
    currentKey: strings.getLanguage(),
  });

  const {setIsAuth, settings} = useSettings();

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

  useEffect(() => {
    fetchSettings();
  }, []);

  const onExit = async () => {
    await removeStorage(STORAGE.userToken);
    delete API_V2.defaults.headers[REQUEST_HEADERS.Authorization];
    setIsAuth(false);
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
  };

  const keyExtractor = useCallback(item => item?.id?.toString(), []);

  const selectKeyPressed = async key => {
    if (dataSource?.currentKey !== key) {
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
    <SectionView label={strings['Выберите язык']} />
  ) : null;

  const renderFooter = (
    <View>
      <SectionView label={strings.Уведомление} />
      <SettingItem
        text={strings['Уведомления о действиях']}
        value={dataSource?.isPushAction}
        onValueChange={isPushAction =>
          setDataSource(prev => ({...prev, isPushAction}))
        }
      />
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
          <Text style={styles.exit}>{strings['Выход из аккаунта']}</Text>
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
    marginHorizontal: 16,
  },
  exit: {
    ...setFontStyle(17, '400', '#FF3B30'),
    marginHorizontal: 18,
  },
  empty: {
    marginBottom: 16,
  },
});

export default SettingsScreen;
