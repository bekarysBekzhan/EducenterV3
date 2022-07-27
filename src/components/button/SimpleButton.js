import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ColorApp} from '../../constans/constants';
import {setFontStyle} from '../../utils/utils';

const SimpleButton = ({
  onPress = () => undefined,
  loading = false,
  style,
  text,
  textStyle,
  ...buttonProps
}) => {
  const memoStyle = useMemo(() => [styles.button, style], [style]);
  const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);

  return (
    <TouchableOpacity
      style={memoStyle}
      activeOpacity={0.9}
      onPress={onPress}
      disabled={loading}
      {...buttonProps}>
      {loading ? (
        <ActivityIndicator color={'#fff'} />
      ) : (
        <Text style={memoTextStyle} numberOfLines={2}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SimpleButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: ColorApp.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    maxHeight: 72,
    borderRadius: 10,
  },
  text: {
    ...setFontStyle(17, '600', '#fff'),
    textAlign: 'center',
  },
});
