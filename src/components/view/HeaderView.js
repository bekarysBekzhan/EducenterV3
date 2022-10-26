import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import {setFontStyle} from '../../utils/utils';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);

const HeaderView = ({
  title,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  component,
  haveBottomLine,
  ...props
}) => {
  return (
    <View>
      <MyStatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.appBar} {...props}>
        {title && <Text style={styles.title}>{title}</Text>}
        {component && <View style={styles.component}>{component}</View>}
        {leftIcon && (
          <TouchableOpacity onPress={onLeftPress} style={styles.button}>
            {leftIcon}
          </TouchableOpacity>
        )}
        {rightIcon && (
          <TouchableOpacity onPress={onRightPress} style={styles.button}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {haveBottomLine && (
        <View
          style={{height: 0.5, width: '100%', backgroundColor: '#F5F5F5'}}
        />
      )}
    </View>
  );
};

export default HeaderView;

const styles = StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    height: APPBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    position: 'absolute',
    right: 0,
    left: 0,
    zIndex: 0,
    textAlign: 'center',
    ...setFontStyle(17, '600', '#111621'),
  },
  component: {
    position: 'absolute',
    right: APPBAR_HEIGHT,
    left: APPBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: APPBAR_HEIGHT,
    height: APPBAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
