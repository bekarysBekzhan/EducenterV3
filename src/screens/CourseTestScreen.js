import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import UniversalView from '../components/view/UniversalView';
import TrackPlayer from 'react-native-track-player';
import { useFetching } from '../hooks/useFetching';
import Question from '../components/test/Question';
import { CourseService } from '../services/API';
import { APP_COLORS } from '../constants/constants';
import SimpleButton from '../components/button/SimpleButton';
import RowView from '../components/view/RowView';
import { TimeIcon } from '../assets/icons';
import Timer from '../components/test/Timer';
import Overlay from '../components/view/Overlay';
import { ROUTE_NAMES } from '../components/navigation/routes';
import { getSeconds } from '../utils/utils';
import { useLocalization } from '../components/context/LocalizationProvider';
import { lang } from '../localization/lang';

const CourseTestScreen = props => {
  const { localization } = useLocalization();

  const id = props.route?.params?.id;
  const again = props.route?.params?.again;
  const lessonTitle = props.route?.params?.title;

  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);

  const [data, setData] = useState(null);
  const [fetchTest, isLoading, testError] = useFetching(async () => {
    const response = await CourseService.fetchTest(id, again);
    setData(response.data?.data);
  });
  const [finishTest, isFinishLoading, finishError] = useFetching(async () => {
    const response = await CourseService.finishTest(data?.id);
    const finishedTestData = response.data?.data;
    props.navigation.replace(ROUTE_NAMES.testCompleted, {
      passed: finishedTestData?.passed,
      correct: finishedTestData?.score,
      total: finishedTestData?.tests_count,
      id: data?.id,
      entity: data?.entity,
      resultType: finishedTestData?.entity?.result_type,
    });
  });

  useEffect(() => {
    if (testError) {
      console.log('test error : ', testError);
    }
  }, [testError]);

  useLayoutEffect(() => {
    const MAX_TITLE_LENGTH = 20;
    props.navigation.setOptions({
      title: lessonTitle
        ? (lessonTitle.length > MAX_TITLE_LENGTH
          ? `${lessonTitle.substring(0, MAX_TITLE_LENGTH)}...`
          : lessonTitle)
        : lang('Тест', localization),
      headerTitleAlign: 'center',
    });
    if (data) {
      props.navigation.setOptions({
        headerRight: () => (
          <TestTimer
            finishingTime={data?.finishing_time}
            finishTest={finishTest}
            totalSeconds={getSeconds(data?.finishing_time)}
          />
        ),
      });
    }
  }, [data]);

  useEffect(() => {
    fetchTest();
    return () => {
      resetAudio();
    };
  }, []);

  const resetAudio = async () => {
    await TrackPlayer.reset();
  };

  const getInitialSeconds = finishingTime => {
    if (finishingTime === undefined || finishingTime === null) {
      return 0;
    }

    const currentSeconds = new Date().getTime() / 1000;
    const finishingSeconds = new Date(finishingTime).getTime() / 1000;

    const diffSeconds = finishingSeconds - currentSeconds;

    if (diffSeconds < 0) {
      return 0;
    }

    return diffSeconds;
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

  const renderQuestion = ({ item, index }) => {
    return (
      <Question
        questionItem={item}
        items={item?.answers}
        passing_answers={data?.passing_answers}
        index={index}
        is_multiple={item?.is_multiple}
        onTrackChange={onTrackChange}
      />
    );
  };

  const renderFooter = () => (
    <View>
      <SimpleButton
        text={lang('Завершить тест', localization)}
        onPress={finishTest}
        style={{ marginBottom: 100 }}
        loading={isFinishLoading}
      />
    </View>
  );

  return (
    <UniversalView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 120 }}
          color={APP_COLORS.primary}
        />
      ) : (
        <FlatList
          data={data?.tests}
          renderItem={renderQuestion}
          ListFooterComponent={renderFooter}
          style={{ padding: 16 }}
          maxToRenderPerBatch={10}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          windowSize={10}
        />
      )}
      <Overlay visible={isFinishLoading} />
    </UniversalView>
  );
};

const TestTimer = ({ finishingTime, finishTest, totalSeconds }) => {
  const [backgroundColor, setBackgroundColor] = useState('green');
  return (
    <RowView
      style={[
        styles.timerContainer,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{ paddingRight: 4 }}>
        <TimeIcon color="white" />
      </View>
      <Timer
        finishingTime={finishingTime}
        onTimes={time => {
          if (time === 0) {
            finishTest();
          } else if (time < totalSeconds / 5) {
            setBackgroundColor('red');
          } else if (time < totalSeconds / 2) {
            setBackgroundColor('#FACC56');
          }
        }}
      />
    </RowView>
  );
};

const styles = StyleSheet.create({
  container: {},
  timerContainer: {
    padding: 4,
    borderRadius: 4,
  },
});

export default CourseTestScreen;
