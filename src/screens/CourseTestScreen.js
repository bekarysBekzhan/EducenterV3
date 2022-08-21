import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import TrackPlayer from 'react-native-track-player';
import {useFetching} from '../hooks/useFetching';
import Question from '../components/test/Question';
import { CourseService } from '../services/API';
import { FlatList } from 'react-native-gesture-handler';
import { APP_COLORS } from '../constans/constants';

const CourseTestScreen = props => {

  const id = props.route?.params?.id

  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);

  const [data, setData] = useState(null);
  const [fetchTest, isLoading, testError] = useFetching(async () => {
    const response = await CourseService.fetchTest(id)
    setData(response.data?.data)
  });

  useEffect(() => {
    fetchTest()
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
        passing_answers={data?.passing_answers}
        index={index}
        is_multiple={item?.is_multiple}
        onTrackChange={onTrackChange}
      />
    );
  };
  return (
    <UniversalView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginBottom: 120}} color={APP_COLORS.primary}/>
      ) : (
        <FlatList
          data={data?.tests}
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
