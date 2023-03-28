import {StyleSheet} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {APP_COLORS, STORAGE} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import {storeString} from '../../storage/AsyncStorage';
import {useFetching} from '../../hooks/useFetching';
import SelectOption from '../../components/SelectOption';
import SectionView from '../../components/view/SectionView';
import {strings} from '../../localization';
import { useSettings } from '../../components/context/Provider';
import { SettingsService } from '../../services/API';
import { useLocalization } from '../../components/context/LocalizationProvider';

const languages = [
  {label: 'Русский', key: 'ru'},
  {label: 'Қазақша', key: 'kz'},
  {label: 'English', key: 'en'},
];

const LanguageScreen = ({navigation, route}) => {

  const {localization} = useLocalization()

  const {setLanguage, language} = useSettings();
  const [currentKey, setCurrentKey] = useState(strings.getLanguage());
  const [selectKeyPressed, isLoading, keyError] = useFetching(async key => {
    if (currentKey !== key) {
      const langDB = await SettingsService.fetchLanguage();
      if (langDB?.data?.data) {
        localization.current = langDB?.data?.data[key];
      }
      await storeString(STORAGE.language, key);
      strings.setLanguage(key);
      setCurrentKey(key);
      setLanguage(key);
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: strings['Поменять язык'],
    })
  }, [language])

  return (
    <UniversalView style={styles.container}>
      <SectionView label={strings['Выберите язык']} />
      {languages.map((value, index) => (
        <SelectOption
          selectKeyPressed={selectKeyPressed}
          value={value.key}
          _key={value.key}
          label={value.label}
          currentKey={currentKey}
          isLoading={isLoading}
          key={index}
        />
      ))}
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  label: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.input,
  },
  labelText: [setFontStyle(16, '400')],
  box: {
    padding: 6,
    paddingVertical: 7,
    borderRadius: 100,
  },
});

export default LanguageScreen;
