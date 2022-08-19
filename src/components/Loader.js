import {ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../constans/constants';
import {useMemo} from 'react';

const Loader = ({color = APP_COLORS.primary, style, ...props}) => {
  const memoStyle = useMemo(() => [styles.view, style], [style]);
  return <ActivityIndicator style={memoStyle} color={color} {...props} />;
};

export default Loader;

const styles = StyleSheet.create({
  view: {
    marginTop: 16,
  },
});
