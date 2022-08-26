import React, {useMemo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {CopyIcon} from '../../assets/icons';
import {APP_COLORS} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import RowView from './RowView';

const CardDetail = ({
  title,
  titleStyle,
  value,
  valueStyle,
  showIconRight = true,
  iconRight,
  style,
  onPress,
}) => {
  const memoRowStyle = useMemo(() => [styles.row, style], []);

  const memoTitleStyle = useMemo(() => [styles.title, titleStyle], []);

  const memoValueStyle = useMemo(() => [styles.value, valueStyle], []);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <RowView style={memoRowStyle}>
        <RowView style={styles.rtv}>
          <Text style={memoTitleStyle}>{title}</Text>
          <Text style={memoValueStyle}>{value}</Text>
        </RowView>
        {showIconRight ? iconRight ? iconRight : <CopyIcon /> : null}
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: APP_COLORS.transparent,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  rtv: {
    flex: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: APP_COLORS.transparent,
  },
  title: {
    ...setFontStyle(15, '400', APP_COLORS.label),
    marginRight: 12,
  },
  value: {
    ...setFontStyle(),
  },
});

export default CardDetail;
