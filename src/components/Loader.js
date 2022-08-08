import {ActivityIndicator} from 'react-native';
import React from 'react';
import {APP_COLORS} from '../constans/constants';

const Loader = ({color = APP_COLORS.primary, ...props}) => {
  return <ActivityIndicator color={color} {...props} />;
};

export default Loader;
