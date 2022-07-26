import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo} from 'react';
import {setFontStyle} from '../../utils/utils';
import {ColorApp} from '../../constans/ColorApp';

const OutlineButton = ({
  text,
  textStyle,
  loading = false,
  onPress = () => undefined,
  style,
  colorIndicator = ColorApp.primary,
  ...props
}) => {
  const memoStyle = useMemo(() => [styles.button, style], [style]);
  const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={loading}
      style={memoStyle}
      {...props}>
      {loading ? (
        <ActivityIndicator color={colorIndicator} />
      ) : (
        <Text numberOfLines={2} style={memoTextStyle}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default OutlineButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 64,
  },
  text: {
    ...setFontStyle(17, '600', ColorApp.primary),
    textAlign: 'center',
  },
});
