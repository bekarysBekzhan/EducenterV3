import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {setFontStyle} from '../utils/utils';
import {APP_COLORS} from '../constans/constants';
import {check} from '../assets/icons';

const SelectOption = ({
  selectKeyPressed,
  isLoading = false,
  label,
  value,
  currentKey,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => selectKeyPressed(value)}
      activeOpacity={0.78}
      disabled={isLoading}>
      <Text style={styles.text}>{label}</Text>
      <View
        style={[
          styles.box,
          {
            backgroundColor:
              value === currentKey ? APP_COLORS.primary : APP_COLORS.input,
          },
        ]}>
        {check(1.3, value === currentKey ? 'white' : APP_COLORS.input)}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.input,
  },
  text: {
    flex: 1,
    marginRight: 12,
    ...setFontStyle(16, '400'),
  },
  box: {
    padding: 6,
    paddingVertical: 7,
    borderRadius: 100,
  },
});

export default SelectOption;
