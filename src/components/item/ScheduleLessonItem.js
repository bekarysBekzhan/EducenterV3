import React, {memo} from 'react';
import {FlatList, Linking, StyleSheet, Text, View} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import {strings} from '../../localization';
import {setFontStyle} from '../../utils/utils';
import Avatar from '../Avatar';
import TextButton from '../button/TextButton';
import Empty from '../Empty';
import RowView from '../view/RowView';

const ScheduleLessonItem = ({name, category, avatar, item, link}) => {
  const open = () => {
    console.log(link);
    if (link) {
      Linking.openURL(link);
    }
  };

  const keyExtractor = item => item?.id?.toString();

  const renderItem = ({item, index}) => (
    <View
      style={
        item?.is_current ? {...styles.view, ...styles.today} : styles.view
      }>
      <Text style={styles.day}>{item?.days[item?.day]}</Text>
      <Text style={styles.time}>{item?.time ? item?.time : '-- : --'}</Text>
    </View>
  );

  const renderEmpty = <Empty />;

  return (
    <View style={styles.container}>
      <RowView style={styles.row}>
        <RowView>
          <Avatar source={avatar} style={styles.avatar} />

          <View style={styles.col}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.category}>{category}</Text>
          </View>

          <TextButton
            text={strings.Перейти}
            textStyle={styles.goTo}
            style={styles.button}
            onPress={open}
          />
        </RowView>
      </RowView>

      <FlatList
        item={item?.items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: APP_COLORS.border,
  },
  row: {
    paddingLeft: 16,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36,
  },
  col: {
    flex: 1,
    marginHorizontal: 8,
  },
  name: {
    ...setFontStyle(15, '600'),
  },
  category: {
    ...setFontStyle(13, '400', APP_COLORS.placeholder),
  },
  button: {
    marginTop: 0,
    marginRight: 16,
  },
  goTo: {
    ...setFontStyle(13, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
  view: {
    borderWidth: 1,
    borderColor: APP_COLORS.border,
    borderRadius: 8,
    marginLeft: 6,
    paddingVertical: 8,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
  },
  today: {
    backgroundColor: 'rgba(69, 142, 34, 0.12)',
  },
  list: {
    marginTop: 16,

    paddingLeft: 16,
  },
  day: {
    ...setFontStyle(10, '500', APP_COLORS.placeholder),
    marginBottom: 2,
  },
  time: {
    ...setFontStyle(10),
  },
});

export default memo(ScheduleLessonItem);
