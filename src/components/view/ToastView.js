import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constans/constants';
import {ToastInfoIcon} from '../../assets/icons';
import RowView from './RowView';

const ToastView = ({text}) => (
  <RowView style={styles.row}>
    <ToastInfoIcon />
    <View style={styles.col}>
      <Text style={styles.text}>{text}</Text>
    </View>
  </RowView>
);

const styles = StyleSheet.create({
  row: {
    backgroundColor: APP_COLORS.toast,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 1,
  },
  col: {
    flex: 1,
    marginLeft: 10,
  },
  text: {
    ...setFontStyle(15, '400', '#fff'),
  },
});

export default ToastView;
