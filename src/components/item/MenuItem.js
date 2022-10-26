import React, {memo} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {setFontStyle} from '../../utils/utils';
import RowView from '../view/RowView';
import Divider from '../Divider';
import {iconNext} from '../../assets/icons';

const MenuItem = ({
  style,
  onPress,
  text,
  iconLeft,
  iconLeftShow = true,
  poster,
  posterStyle,
}) => {
  const TypeButton =
    Platform.OS == 'android' ? TouchableOpacity : TouchableWithoutFeedback;

  return (
    <TypeButton activOpacity={0.9} onPress={onPress}>
      <View>
        <RowView style={{...styles.row, ...style}}>
          {iconLeftShow && iconLeft}
          {poster ? (
            <FastImage
              source={{
                uri: poster,
                priority: 'high',
              }}
              style={{...styles.poster, ...posterStyle}}
            />
          ) : null}
          <RowView style={styles.innerRow}>
            <Text style={styles.text}>{text}</Text>
            {iconNext}
            <Divider />
          </RowView>
        </RowView>
        <View />
      </View>
    </TypeButton>
  );
};

const styles = StyleSheet.create({
  row: {
    paddingLeft: 20,
  },
  innerRow: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 24,
    marginLeft: 16,
  },
  text: {
    flex: 1,
    ...setFontStyle(17),
  },
  poster: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
});

export default memo(MenuItem);
