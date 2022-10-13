import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {useRef} from 'react';
import {
  getCurrentTimeString,
  getSeconds,
  setFontStyle,
} from '../../utils/utils';
import {useMemo} from 'react';

const Timer = ({
  finishingTime,
  autoStart = true,
  textStyle = {},
  onTimes = () => undefined,
}) => {
  const [seconds, setSeconds] = useState(getSeconds(finishingTime));
  const intervalID = useRef(null);
  const memoTextStyle = useMemo(
    () => [styles.timerText, textStyle],
    [textStyle],
  );

  useEffect(() => {
    if (autoStart) {
      intervalID.current = start();
    }
    return () => {
      clearInterval(intervalID.current);
    };
  }, []);

  useEffect(() => {
    onTimes(seconds);
    if (seconds === 0) {
      clearInterval(intervalID.current);
    }
  }, [seconds]);

  const start = () => {
    return setInterval(() => {
      console.log('setInterval');
      setSeconds(getSeconds(finishingTime));
    }, 1000);
  };

  return (
    <View>
      <Text style={memoTextStyle}>{getCurrentTimeString(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    ...setFontStyle(13, '500', 'white'),
  },
});

export default Timer;
