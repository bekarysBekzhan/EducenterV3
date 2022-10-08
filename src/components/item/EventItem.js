import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RowView from '../view/RowView';
import {time} from '../../assets/icons';
import {setFontStyle} from '../../utils/utils';

const EventItem = ({date, address}) => {
  return (
    <View style={styles.view}>
      <RowView style={styles.row}>
        {time(20, 'grey')}
        <Text style={styles.date}>{date}</Text>
      </RowView>
      <Text style={styles.address}>{address}</Text>
    </View>
  );
};

export default EventItem;

const styles = StyleSheet.create({
  view: {
    marginHorizontal: 16,
  },
  row: {
    marginBottom: 4,
  },
  date: {
    marginHorizontal: 6,
    ...setFontStyle(15),
  },
  address: {
    marginBottom: 8,
    ...setFontStyle(15, '400', '#808191'),
  },
});
