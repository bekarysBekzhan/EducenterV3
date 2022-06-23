import {ActivityIndicator} from 'react-native';
import React from 'react';
import {ColorApp} from '../constans/ColorApp';

const Loader = ({color = ColorApp.primary, ...props}) => {
  return <ActivityIndicator color={color} {...props} />;
};

export default Loader;
