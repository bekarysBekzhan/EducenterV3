import React, {memo} from 'react';
import {FlatList, StyleSheet, Text} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import {strings} from '../../localization';
import {setFontStyle} from '../../utils/utils';
import Empty from '../Empty';
import RowView from '../view/RowView';

const ScheduleVisitItem = ({data = []}) => {
  const keyExtractor = item => item?.id?.toString();

  const renderItem = ({item, index}) => (
    <RowView style={index % 2 == 0 ? styles.row : styles.inRow}>
      <Text style={styles.count}>{index + 1}.</Text>
      <Text style={styles.date}>{item?.date_at_format}</Text>
      <Text style={item?.attendant ? styles.activ : styles.inActiv}>
        {item?.attendant ? strings.Присутствовал : strings.Отсутствовал}
      </Text>
    </RowView>
  );

  const renderEmpty = <Empty />;

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderEmpty}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      bounces={false}
      initialNumToRender={50}
      windowSize={50}
      maxToRenderPerBatch={50}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(85, 89, 244, 0.04)',
    padding: 16,
    borderRadius: 8,
  },
  inRow: {
    backgroundColor: '#fff',
    padding: 16,
  },
  count: {
    ...setFontStyle(10, '500', APP_COLORS.placeholder),
    flex: 1,
  },
  date: {
    ...setFontStyle(15),
    flex: 3,
    marginHorizontal: 4,
  },
  activ: {
    ...setFontStyle(13, '600', '#458E22'),
    textTransform: 'uppercase',
  },
  inActiv: {
    ...setFontStyle(13, '600', 'red'),
    textTransform: 'uppercase',
  },
});

export default memo(ScheduleVisitItem);
