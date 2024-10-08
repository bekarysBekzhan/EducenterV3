import React, {memo, useMemo} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {APP_COLORS} from '../../constants/constants';
import {setFontStyle} from '../../utils/utils';
import Divider from '../Divider';
import RowView from '../view/RowView';

const SettingItem = ({text, label, value, style, onValueChange, settings}) => {
  const memoStyle = useMemo(() => [styles.view, style], [style]);
  const memoTrackColor = useMemo(() => ({true: 'rgba(85, 89, 244,0.12)',false:'#eee'}), []);
  return (
    <View style={memoStyle}>
      <RowView style={styles.row}>
        <Text style={styles.text}>{text}</Text>
        <Switch
          value={value}
          thumbColor={value ? settings?.color_app : APP_COLORS.placeholder}
          trackColor={memoTrackColor}
          onValueChange={onValueChange}
        />
        <Divider />
      </RowView>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  row: {
    paddingBottom: 12,
    marginBottom: 4,
  },
  text: {
    flex: 1,
    ...setFontStyle(17),
    marginRight: 12,
  },
  label: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
  },
});

export default memo(SettingItem);
