import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import Loader from '../Loader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const UniversalView = ({
  children,
  style,
  haveLoader = false,
  haveScroll = false,
  ...scrollProps
}) => {
  const memoStyle = useMemo(() => {
    if (haveScroll) {
      return [styles.scrollView, style];
    }

    return [styles.view, style];
  }, [style]);

  if (haveScroll) {
    return (
      <KeyboardAwareScrollView style={memoStyle} {...scrollProps}>
        {haveLoader ? <Loader /> : children}
      </KeyboardAwareScrollView>
    );
  }

  return <View style={memoStyle}>{haveLoader ? <Loader /> : children}</View>;
};

export default UniversalView;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#fff',
  },
});
