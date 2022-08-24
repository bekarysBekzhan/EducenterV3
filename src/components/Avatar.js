import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

const Avatar = ({source, style}) => {
  const memoSource = useMemo(
    () => ({
      uri: source,
      priority: 'high',
    }),
    [],
  );

  const memoAvatarStyle = useMemo(() => [styles.avatar, style], []);

  return <FastImage source={memoSource} style={memoAvatarStyle} />;
};

const styles = StyleSheet.create({
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default Avatar;
