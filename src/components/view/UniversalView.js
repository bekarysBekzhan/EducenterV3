import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import Loader from '../Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const UniversalView = ({
  children,
  style,
  haveLoader = false,
  haveSafe = false,
  haveScroll = false,
  ...scrollProps
}) => {
  const memoStyle = useMemo(() => {
    if (haveSafe) {
      return [styles.safeView, style];
    }

    if (haveScroll) {
      return [styles.scrollView, style];
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

    if (haveScroll) {
      return (
        <KeyboardAwareScrollView style={memoStyle} {...scrollProps}>
          <Loader />
        </KeyboardAwareScrollView>
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

  if (haveScroll) {
    return (
      <KeyboardAwareScrollView style={memoStyle} {...scrollProps}>
        {children}
      </KeyboardAwareScrollView>
    );
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
  scrollView: {
    backgroundColor: '#fff',
  },
});
