import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {setFontStyle} from '../../utils/utils';

const PrivacyItem = ({title, item = {}, onPress = () => undefined}) => {
  return (
    <TouchableOpacity
      style={styles.view}
      onPress={() => onPress(item)}
      activeOpacity={0.9}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrivacyItem;

const styles = StyleSheet.create({
  view: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    ...setFontStyle(16, '500'),
  },
});
