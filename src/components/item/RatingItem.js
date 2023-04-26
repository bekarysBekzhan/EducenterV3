import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {APP_COLORS} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';
import Avatar from '../Avatar';
import Divider from '../Divider';
import RowView from '../view/RowView';
import {useLocalization} from '../context/LocalizationProvider';
import {lang} from '../../localization/lang';

const RaitingItem = ({count, avatar, category, name, title, score}) => {
  const {localization} = useLocalization();

  return (
    <RowView style={styles.row}>
      <Text style={styles.count}>{count}.</Text>
      <RowView style={styles.innerRow}>
        <Avatar source={avatar} style={styles.avatar} />
        <View style={styles.col}>
          {category ? <Text style={styles.category}>{category}</Text> : null}
          {name ? <Text style={styles.name}>{name}</Text> : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
        <Text style={styles.score}>
          {score ? score : 0}-{lang('БАЛЛ', localization)}
        </Text>
        <Divider />
      </RowView>
    </RowView>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 14,
  },
  innerRow: {
    paddingBottom: 10,
    paddingRight: 16,
  },
  count: {
    ...setFontStyle(12, '500', APP_COLORS.label),
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36,
    marginLeft: 4,
    marginRight: 8,
  },
  col: {
    flex: 1,
    marginRight: 16,
  },
  category: {
    ...setFontStyle(10, '500', APP_COLORS.primary),
  },
  name: {
    ...setFontStyle(15, '600'),
    marginTop: 2,
  },
  title: {
    ...setFontStyle(13),
  },
  score: {
    ...setFontStyle(13, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
});

export default memo(RaitingItem);
