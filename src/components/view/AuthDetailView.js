import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import FastImage from 'react-native-fast-image';
import {useSettings} from '../context/Provider';
import {setFontStyle} from '../../utils/utils';

const AuthDetailView = ({haveLogo = true, title, titleStyle}) => {
  const {settings} = useSettings();

  const memoTitleStyle = useMemo(
    () => [styles.title, titleStyle],
    [titleStyle],
  );

  return (
    <View>
      {haveLogo ? (
        <FastImage
          style={styles.logo}
          source={{uri: settings?.logo, priority: 'high'}}
        />
      ) : null}

      {title ? <Text style={memoTitleStyle}>{title}</Text> : null}
    </View>
  );
};

export default AuthDetailView;

const styles = StyleSheet.create({
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
  title: {
    ...setFontStyle(20, '700'),
    textAlign: 'center',
    marginBottom: 8,
  },
});
