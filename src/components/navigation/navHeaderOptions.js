import React from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../utils/utils';

export const navHeaderOptions = (image, title) => {
  return {
    headerLeft: () => <FastImage source={{uri: image}} style={styles.logo} />,
    headerTitle: title,
    headerTitleAlign: 'center',
    headerTitleStyle: styles.navigationTitle,
    headerLeftContainerStyle: styles.navigationHeader,
  };
};

const styles = StyleSheet.create({
  logo: {
    width: 38,
    height: 38,
    borderRadius: 6,
    marginRight: 12,
  },
  navigationHeader: {
    paddingLeft: 16,
  },
  navigationTitle: {
    ...setFontStyle(30, '700'),
  },
});
