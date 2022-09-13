import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';

const RowView = ({children, style, ...props}) => {
  const memoStyle = useMemo(() => [styles.row, style], [style]);

  return (
    <View style={memoStyle} {...props}>
      {children}
    </View>
  );
};

export default RowView;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: "center",
  },
});
