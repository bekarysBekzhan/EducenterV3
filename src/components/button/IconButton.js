import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

const IconButton = ({children, style, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={{...styles.iconButton, ...style}}>
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IconButton;
