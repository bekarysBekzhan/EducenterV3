import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import Loader from '../Loader';

const UniversalView = ({
  children,
  style,
  haveLoader = false,
  haveSafe = false,
}) => {
  const memoStyle = useMemo(() => {
    if (haveSafe) {
      return [styles.safeView, style];
    }
    return [styles.view, style];
  }, [style]);

  if (haveLoader) {
    if (haveSafe) {
      return (
        <SafeAreaView style={memoStyle}>
          <Loader />
        </SafeAreaView>
      );
    }

    return (
      <View style={memoStyle}>
        <Loader />
      </View>
    );
  }

  if (haveSafe) {
    return <SafeAreaView style={memoStyle}>{children}</SafeAreaView>;
  }

  return <View style={memoStyle}>{children}</View>;
};

export default UniversalView;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeView: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
  },
});
