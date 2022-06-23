import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import Loader from '../Loader';

const UniversalView = ({children, style, haveLoader = false, haveSafe=false}) => {
  const memoStyle = useMemo(() => [styles.view, style], [style]);

  if (haveLoader) {

    if(haveSafe){
        return (
            <SafeAreaView>
                {children}
            </SafeAreaView>
        )
    }

    return (
      <View style={memoStyle}>
        <Loader />
      </View>
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
});
