import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useSettings} from '../../components/context/Provider';
import {setFontStyle, wordLocalization} from '../../utils/utils';
import {APP_COLORS, N_STATUS, STORAGE} from '../../constans/constants';
import SimpleButton from '../../components/button/SimpleButton';
import OutlineButton from '../../components/button/OutlineButton';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import FastImage from 'react-native-fast-image';
import {storeObject} from '../../storage/AsyncStorage';
import HtmlView from '../../components/HtmlView';
import {useLocalization} from './../../components/context/LocalizationProvider';
import {lang} from './../../localization/lang';

const SplashScreen = ({navigation}) => {
  const {settings, initialStart, isAuth, nstatus} = useSettings();

  const {localization} = useLocalization();

  useEffect(() => {
    if (!initialStart) {
      setTimeout(() => {
        if (nstatus === N_STATUS) {
          navigation.replace(ROUTE_NAMES.bottomTab);
        } else {
          if (settings?.marketplace_enabled) {
            if (isAuth) {
              navigation.replace(ROUTE_NAMES.bottomTab);
            } else {
              navigation.replace(ROUTE_NAMES.login);
            }
          } else {
            navigation.replace(ROUTE_NAMES.bottomTab);
          }
        }
      }, 1300);
    }
  }, []);

  const onContinue = async () => {
    await storeObject(STORAGE.initialStart, false);
    if (nstatus === N_STATUS) {
      navigation.replace(ROUTE_NAMES.bottomTab);
    } else {
      if (settings?.marketplace_enabled) {
        navigation.replace(ROUTE_NAMES.login);
      } else {
        navigation.replace(ROUTE_NAMES.bottomTab);
      }
    }
  };

  const changeLanguagePressed = () => {
    console.log('changeLanguagePressed');
    navigation.navigate(ROUTE_NAMES.language);
  };

  const goTo = () => {
    navigation.navigate(ROUTE_NAMES.privacy);
  };

  if (initialStart) {
    return (
      <UniversalView style={styles.container}>
        <FastImage
          style={styles.logo}
          source={{uri: settings?.logo, priority: 'high'}}
        />
        <Text numberOfLines={3} style={styles.description}>
          {settings?.description}
        </Text>

        <View style={styles.bottom}>
          <SimpleButton
            text={lang('Продолжить на русском', localization)}
            onPress={onContinue}
          />
          <OutlineButton
            text={lang('Поменять язык', localization)}
            style={styles.outlineButton}
            onPress={changeLanguagePressed}
          />
          <TouchableOpacity onPress={goTo}>
            <HtmlView
              html={`<p>${wordLocalization(
                lang('Продолжая вы соглашаетесь с :word', localization),
                {
                  word: `<span style='color:${APP_COLORS.primary}'>${lang('Пользовательским соглашением', localization)}</span>`,
                },
              )}</p>`}
              tagsStyles={{p: {color: APP_COLORS.font}}}
            />
          </TouchableOpacity>
        </View>
      </UniversalView>
    );
  }

  return (
    <UniversalView style={styles.container}>
      <FastImage style={styles.logo} source={{uri: settings?.logo}} />
      <Text style={styles.description}>{settings?.description}</Text>
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  description: {
    ...setFontStyle(21, '700'),
    textAlign: 'center',
    marginTop: 15,
  },
  bottom: {
    position: 'absolute',
    bottom: 32,
  },
  outlineButton: {
    borderWidth: 0,
    marginTop: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});

export default SplashScreen;
