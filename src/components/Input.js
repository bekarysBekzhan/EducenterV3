import {StyleSheet, TextInput} from 'react-native';
import React, {useMemo, useState} from 'react';
import {TextInputMask} from 'react-native-masked-text';
import RowView from './view/RowView';
import {APP_COLORS} from '../constans/constants';
import {setFontStyle} from '../utils/utils';

const Input = ({
  placeholder = '',
  _focus = false,
  mask,
  keyboardType = 'phone-pad',
  right,
  value = '',
  onChangeText,
  left,
  extraStyle,
  extraInputStyle,
  ...props
}) => {
  const [focus, setFocus] = useState(_focus);

  const memoStyles = useMemo(
    () => [styles.container, focus ? styles.focus : {}, extraStyle],
    [focus],
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
          placeholderTextColor={APP_COLORS.placeholder}
          placeholder={placeholder}
          style={memoInputStyles}
          value={value}
          onChangeText={onChangeText}
          autoFocus={focus}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...props}
        />
      ) : (
        <TextInputMask
          placeholderTextColor={APP_COLORS.placeholder}
          placeholder={placeholder}
          style={memoInputStyles}
          type="custom"
          options={{mask}}
          onChangeText={onChangeText}
          autoFocus={focus}
          keyboardType={keyboardType}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          value={value}
          {...props}
        />
      )}
      {right}
    </RowView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_COLORS.input,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: APP_COLORS.input,
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
