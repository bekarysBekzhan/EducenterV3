import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useMemo, useState} from 'react';
import {TextInputMask} from 'react-native-masked-text';
import RowView from './view/RowView';
import {APP_COLORS} from '../constants/constants';
import {setFontStyle} from '../utils/utils';
import { useSettings } from './context/Provider';

const Input = ({
  placeholder = '',
  placeholderTextColor = APP_COLORS.white,
  _focus = false,
  mask,
  keyboardType = 'default',
  right,
  value = '',
  onLayout = () => undefined,
  onChangeText = () => undefined,
  onChange = () => undefined,
  onContentSizeChange = () => undefined,
  left,
  extraStyle,
  extraInputStyle,
  onPressRightIcon,
  ...props
}) => {

  const [focus, setFocus] = useState(_focus);
  const { settings } = useSettings();

  const memoStyles = useMemo(
    () => [styles.container, focus ? {...styles.focus, borderColor: settings?.color_app} : {}, extraStyle],
    [focus, extraStyle],
  );
  const memoInputStyles = useMemo(
    () => [styles.input, extraInputStyle],
    [extraInputStyle],
  );

  return (
    <RowView style={memoStyles}>
      {left}
      {mask === undefined ? (
        <TextInput
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          style={memoInputStyles}
          value={value}
          onLayout={onLayout}
          onChange={onChange}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onContentSizeChange={onContentSizeChange}
          autoFocus={focus}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...props}
        />
      ) : (
        <TextInputMask
          placeholderTextColor={placeholderTextColor}
          placeholder={placeholder}
          style={memoInputStyles}
          type="custom"
          options={{mask}}
          onLayout={onLayout}
          onChange={onChange}
          onChangeText={onChangeText}
          onContentSizeChange={onContentSizeChange}
          autoFocus={focus}
          keyboardType={keyboardType}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          {...props}
        />
      )}
      {right ? (
        <TouchableOpacity onPress={onPressRightIcon}>{right}</TouchableOpacity>
      ) : null}
    </RowView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.gray3,
    borderRadius: 25,
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    ...setFontStyle(17),
  },
  focus: {
    borderWidth: 1,
    borderColor: APP_COLORS.primary,
  },
});

export default Input;
