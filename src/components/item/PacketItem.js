import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {setFontStyle} from '../../utils/utils';
import {check, x} from '../../assets/icons';
import {APP_COLORS} from '../../constans/constants';

const PacketItem = ({style, name, nameStyle, selected = false, onPress}) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
    <View style={{...styles.view, ...style}}>
      {selected ? check() : x()}
      {name ? <Text style={{...styles.name, ...nameStyle}}>{name}</Text> : null}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  view: {
    backgroundColor: APP_COLORS.white,
    borderWidth: 2,
    borderColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  name: {
    marginTop: 8,
    ...setFontStyle(15, '600'),
  },
});

export default memo(PacketItem);
