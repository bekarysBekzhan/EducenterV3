import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {UBTService} from '../../services/API';
import TrackPlayer from 'react-native-track-player';
import Question from '../../components/test/Question';
import SimpleButton from '../../components/button/SimpleButton';
import {strings} from '../../localization';
import Overlay from '../../components/view/Overlay';
import RowView from '../../components/view/RowView';
import {down, TimeIcon, up} from '../../assets/icons';
import Timer from '../../components/test/Timer';
import {APP_COLORS, WIDTH} from '../../constans/constants';
import {Modal} from 'react-native';
import {getSeconds, setFontStyle} from '../../utils/utils';
import LoadingScreen from '../../components/LoadingScreen';
import {useHeaderHeight} from '@react-navigation/elements';
import {ROUTE_NAMES} from '../../components/navigation/routes';

const UBTTestScreen = props => {
  const id = props.route?.params?.id;
  const again = props.route?.params?.again;

  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);
  const listRef = useRef(null);

  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [navigationTitle, setNavigationTitle] = useState(null);

  const [fetchTest, isLoading, testError] = useFetching(async () => {
    let response = await UBTService.startTest(id, again);
    let convertedArray = Object.values(response.data?.data?.ubt_tests);
    response.data.data.ubtTests = convertedArray;
    setData(response.data?.data);
    setNavigationTitle(response.data?.data?.ubtTests[0]?.entity?.entity?.name);
  });

  const [finishTest, isFinishLoading, finishError] = useFetching(async () => {
    const response = await UBTService.finishTest(data?.id);
    const finishedTestData = response.data?.data;
    props.navigation.replace(ROUTE_NAMES.ubtCompleted, {
      passed: finishedTestData?.passed,
      correct: finishedTestData?.score,
      total: finishedTestData?.tests_count,
      id: data?.id,
      entity: data?.entity,
      resultType: finishedTestData?.entity?.result_type,
      data: finishedTestData?.data,
    });
  });

  useEffect(() => {
    if (testError) {
      console.log(testError);
      props.navigation.goBack();
    }
  }, [testError]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: 'ҰБТ',
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
    console.log('finishing time : ', finishingTime);

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

  const getSubjects = () => {
    return data?.ubtTests.map(value => value?.entity);
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

  const onSelectSubject = (title, index) => {
    listRef.current?.scrollToIndex({index: index, animated: false});
    setVisible(false);
    setNavigationTitle(title);
  };

  const onOpenSubjectsModal = () => {
    setVisible(true);
  };

  const renderNavigationHeader = () => {
    return (
      <TouchableOpacity
        onPress={onOpenSubjectsModal}
        activeOpacity={0.75}
        style={styles.navigationHeader}>
        <Text style={styles.navigationHeaderTitle}>{navigationTitle}</Text>
        {visible ? up : down}
      </TouchableOpacity>
    );
  };

  const renderList = ({item, index}) => {
    return (
      <FlatList
        data={item?.questions}
        renderItem={renderQuestion}
        ListFooterComponent={renderFooter}
        style={{width: WIDTH}}
        contentContainerStyle={{padding: 16}}
        maxToRenderPerBatch={10}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={10}
      />
    );
  };

  const renderQuestion = ({item, index}) => {
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
        text={strings['Завершить тест']}
        onPress={finishTest}
        style={{marginBottom: 100}}
        loading={isFinishLoading}
      />
    </View>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView style={styles.container}>
      {renderNavigationHeader()}
      <FlatList
        ref={listRef}
        data={data?.ubtTests}
        renderItem={renderList}
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal
        getItemLayout={(data, index) => ({
          length: WIDTH,
          offset: WIDTH * index,
          index,
        })}
        scrollEnabled={false}
        windowSize={6}
        maxToRenderPerBatch={5}
        initialNumToRender={1}
        bounces={false}
      />
      <SubjectsModal
        visible={visible}
        subjects={getSubjects()}
        onSelect={onSelectSubject}
      />
      <Overlay visible={isFinishLoading} />
    </UniversalView>
  );
};

const TestTimer = ({finishingTime, finishTest, totalSeconds}) => {
  const [backgroundColor, setBackgroundColor] = useState('green');

  return (
    <RowView
      style={[
        styles.timerContainer,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{paddingRight: 4}}>
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

const SubjectsModal = ({
  visible,
  subjects = [],
  onSelect = () => undefined,
}) => {
  console.log('subjects : ', subjects);

  const headerHeight = useHeaderHeight();

  const onSubject = (s, index) => {
    onSelect(s?.entity?.name, index);
  };

  const onBackDrop = () => {};

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={styles.modal}>
        <View style={{height: headerHeight}} />
        {subjects.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.subject}
            activeOpacity={0.85}
            onPress={() => onSubject(s, i)}>
            <Text style={styles.subjectText}>{s?.entity?.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.backDrop} onPress={onBackDrop} />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
  timerContainer: {
    padding: 4,
    borderRadius: 4,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  navigationHeaderTitle: {
    ...setFontStyle(17, '500'),
  },
  list: {
    flex: 1,
    padding: 16,
  },
  modal: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backDrop: {
    flex: 1,
    backgroundColor: 'rgba(0.0, 0.0, 0.0, 0.2)',
  },
  subject: {
    width: '100%',
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderColor: APP_COLORS.border,
    padding: 16,
    justifyContent: 'center',
  },
  subjectText: {
    ...setFontStyle(17, '400'),
  },
});

export default UBTTestScreen;
