import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../utils/utils';
import DateFormat from '../DateFormat';
import RowView from '../view/RowView';

const NewsCard = ({title, onPress, source, date, isLast, item}) => {
  const handlerOnPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlerOnPress}>
      <RowView style={isLast ? styles.rowLast : styles.row}>
        <FastImage
          source={{uri: source, priority: 'high'}}
          style={styles.image}
        />
        <View style={styles.col}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {date ? <DateFormat date={date} showIcon /> : null}
        </View>
      </RowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  title: {
    ...setFontStyle(15, '600'),
    marginBottom: 2,
  },
  col: {
    flex: 1,
    marginLeft: 12,
    borderBottomWidth: 1,
    borderColor: '#F5F5F5',
    paddingBottom: 16,
  },
  row: {
    marginBottom: 0,
  },
  rowLast: {
    marginBottom: 16,
  },
});

export default memo(NewsCard);
