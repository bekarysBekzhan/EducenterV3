import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DateIcon} from '../assets/icons';
import {APP_COLORS} from '../constans/constants';
import {setFontStyle} from '../utils/utils';
import RowView from './view/RowView';

const DateFormat = ({date, dateStyle, showIcon}) => {
  const memoStyle = useMemo(() => [styles.date, dateStyle], [dateStyle]);

  return (
    <RowView>
      {showIcon ? (
        <View style={styles.icon}>
          <DateIcon />
        </View>
      ) : null}

      {date ? <Text style={memoStyle}>{date}</Text> : null}
    </RowView>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 6,
  },
  date: {
    ...setFontStyle(15, '400', APP_COLORS.placeholder),
  },
});

export default DateFormat;
