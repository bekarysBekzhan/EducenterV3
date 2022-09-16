import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import UniversalView from '../../components/view/UniversalView'
import { useFetching } from '../../hooks/useFetching';
import { UBTService } from '../../services/API';
import TrackPlayer from 'react-native-track-player';
import Question from '../../components/test/Question';
import SimpleButton from '../../components/button/SimpleButton';
import { strings } from '../../localization';
import Overlay from '../../components/view/Overlay';
import RowView from '../../components/view/RowView';
import { TimeIcon } from '../../assets/icons';
import Timer from '../../components/test/Timer';
import { APP_COLORS } from '../../constans/constants';
import { Modal } from 'react-native';
import { setFontStyle } from '../../utils/utils';

const UBTTestScreen = (props) => {

  const id = props.route?.params?.id

  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);
  const listRef = useRef(null)

  let subjects = []

  const [data, setData] = useState(null);
  const [fetchTest, isLoading, testError] = useFetching(async () => {
    const response = await UBTService.startTest(id)
    setData(response.data?.data)
    subjects = getSubjects(response.data?.data?.ubt_tests)
  });

  const [finishTest, isFinishLoading, finishError] = useFetching(async() => {
    const response = await UBTService.finishTest(data?.id)
    const finishedTestData = response.data?.data
    props.navigation.replace(ROUTE_NAMES.testCompleted, { 
      passed: finishedTestData?.passed, 
      correct: finishedTestData?.score, 
      total: finishedTestData?.tests_count, 
      id: data?.id,
      resultType: finishedTestData?.entity?.result_type,
      data: finishedTestData,
    })
  })

  useEffect(() => {
    if (testError) {
        console.log(testError)
        props.navigation.goBack()
    }
  }, [testError])

  useLayoutEffect(() => {
    if (data) {
      props.navigation.setOptions({
        headerRight: () => <TestTimer initialTime={getInitialSeconds(data?.finishing_time)} finishTest={finishTest}/>,
      })
    }
  }, [data])

  useEffect(() => {
    fetchTest()
    return () => {
      resetAudio();
    };
  }, []);

  const resetAudio = async () => {
    await TrackPlayer.reset();
  };

  const getInitialSeconds = (finishingTime) => {

    if (finishingTime === undefined || finishingTime === null) {
      return 0
    }

    const currentSeconds = new Date().getTime() / 1000
    const finishingSeconds = new Date(finishingTime).getTime() / 1000

    const diffSeconds = finishingSeconds - currentSeconds

    if (diffSeconds < 0) {
      return 0
    }

    return diffSeconds
  }

  const getSubjects = (ubtTests) => {
    return Object.values(ubtTests).map(value => value?.entity)
  }

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

  const onSelectSubject = () => {
    
  }

  const renderList = ({ item, index }) => {
    return (
      <FlatList
        data={item?.tests}
        renderItem={renderQuestion}
        ListFooterComponent={renderFooter}
        style={{padding: 16, flex: 1}}
        maxToRenderPerBatch={10}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={10}
      />
    )
  }

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
        style={{ marginBottom: 100}}
        loading={isFinishLoading}
      />
    </View>
  )

  return (
    <UniversalView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 120}} color={APP_COLORS.primary}/>
      ) : (
        <FlatList
          ref={listRef}
          data={Object.values(data?.ubt_tests)}
          renderItem={renderList}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
      <SubjectsModal visible={false} subjects={subjects}/>
      <Overlay visible={isFinishLoading}/>
    </UniversalView>
  );
};

const TestTimer = ({ initialTime, finishTest }) => {

  const [backgroundColor, setBackgroundColor] = useState("green")

  return(
    <RowView 
      style={[styles.timerContainer, { 
        backgroundColor: backgroundColor
      }]}
    >
      <View style={{ paddingRight: 4}}>
        <TimeIcon
          color='white'
        />
      </View>
      <Timer 
        initialValue={initialTime}
        onTimes={(time) => {
          if(time === 0) {
            finishTest()
          }
          else if(time < initialTime / 5) {
            setBackgroundColor("red")
          }
          else if(time < initialTime / 2) {
            setBackgroundColor("#FACC56")
          }
        }}
      />
    </RowView>
  )
}

const SubjectsModal = ({ visible, subjects = [], onSelect = () => undefined }) => {

  const onSubject = (s) => {

  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modal}>
        {
          subjects.map((s) => (
            <TouchableOpacity style={styles.subject} activeOpacity={0.85} onPress={() => onSubject(s)}>
              <Text style={styles.subjectText}>{s?.title}</Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {},
  timerContainer: {
    padding: 4,
    borderRadius: 4
  },
  modal: {
    flex: 1,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.2)"
  },
  subject: {
    width: "100%",
    padding: 16,
    justifyContent: "center",
  },
  subjectText: {
    ...setFontStyle(17, "400")
  }
});

export default UBTTestScreen