import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import TrackPlayer from 'react-native-track-player';
import {useFetching} from '../hooks/useFetching';
import Question from '../components/test/Question';

const CourseTestScreen = props => {
  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);

  const [data, setData] = useState(null);
  const [fetchTest, isLoading, testError] = useFetching(async () => {
    // const response = await
  });

  useEffect(() => {
    return () => {
      resetAudio();
    };
  }, []);

  const resetAudio = async () => {
    await TrackPlayer.reset();
  };

  const onTrackChange = (duration, setDuration, setPosition, setPlaying) => {
    if (currentSetDuration.current) {
      currentSetDuration.current(duration);
      currentSetPosition.current(0);
    }
    currentSetDuration.current = setDuration;
    currentSetPosition.current = setPosition;

    if (currentSetPlaying.current) {
      currentSetPlaying.current(false);
    }
    currentSetPlaying.current = setPlaying;
  };

  const renderQuestion = ({item, index}) => {
    return (
      <Question
        questionItem={item}
        passing_answers={passing_answers}
        index={index}
        is_multiple={item.is_multiple}
        onTrackChange={onTrackChange}
      />
    );
  };
  return (
    <UniversalView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          renderItem={renderQuestion}
          style={{padding: 16}}
          maxToRenderPerBatch={10}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={12}
          windowSize={10}
        />
      )}
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CourseTestScreen;
