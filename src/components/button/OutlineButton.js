import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useMemo} from 'react';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS} from '../../constants/constants';
import { useSettings } from '../context/Provider';

const OutlineButton = ({
  text,
  textStyle,
  loading = false,
  onPress = () => undefined,
  style,
  colorIndicator = APP_COLORS.primary,
  ...props
}) => {
  const {settings} = useSettings();
  const memoStyle = useMemo(() => [styles.buttonStyle, style], [style]);
  const memoTextStyle = useMemo(() => [{...styles.text, color: settings?.color_app}, textStyle], [textStyle]);

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
        <Text numberOfLines={2} style={styles.textStyle}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default OutlineButton;

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: APP_COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 64,
    elevation: 4,
    // shadowColor: '#0001531A',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 92,
  },
  textStyle: {
    ...setFontStyle(14, '600', APP_COLORS.white),
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
