import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';

const SimpleButton = ({onPress, loading, style, text, textStyle}) => {
  const memoStyle = useMemo(() => []);

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

export default SimpleButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '',
  },
});
