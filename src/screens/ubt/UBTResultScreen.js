import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import UniversalView from '../../components/view/UniversalView'
import { useFetching } from '../../hooks/useFetching'
import { UBTService } from '../../services/API'
import Question from '../../components/test/Question'
import { APP_COLORS, RESULT_TYPES, WIDTH } from '../../constans/constants'
import { useHeaderHeight } from '@react-navigation/elements'
import { Modal } from 'react-native'
import { setFontStyle } from '../../utils/utils'
import { down, up } from '../../assets/icons'
import { strings } from '../../localization'
import LoadingScreen from '../../components/LoadingScreen'

const UBTResultScreen = (props) => {

  const id = props.route?.params?.id
  const resultType = props.route?.params?.resultType 

  const listRef = useRef(null);

  const [data, setData] = useState(null)
  const [visible, setVisible] = useState(false);
  const [navigationTitle, setNavigationTitle] = useState(null)

  const [fetchResult, isFetching, fetchingError] = useFetching(async() => {
    let response = await UBTService.fetchResult(id);
    let convertedArray = Object.values(response.data?.data?.variants)
    response.data.data.results = convertedArray
    setData(response.data?.data);
    setNavigationTitle(response.data?.data?.results[0]?.entity?.name)
  }, [])

  useLayoutEffect(() => {
    props.navigation.setOptions({
        title: strings['Результаты теста']
    })
    fetchResult()
  }, [])

  useEffect(() => {
    if (fetchingError) {
        console.log(fetchingError)
    }
  }, [fetchingError])

  const getSubjects = () => {
    return data?.results.map(value => value?.entity);
  };

  const onSelectSubject = (title, index) => {
    listRef.current?.scrollToIndex({index: index, animated: false});
    setVisible(false)
    setNavigationTitle(title)
  };

  const onOpenSubjectsModal = () => {
    setVisible(true);
  };

  const renderNavigationHeader = () => {
    return (
      <TouchableOpacity 
        onPress={onOpenSubjectsModal} 
        activeOpacity={0.75}
        style={styles.navigationHeader}
      >
        <Text style={styles.navigationHeaderTitle}>{navigationTitle}</Text>
        {visible ? up : down}
      </TouchableOpacity>
    );
  };

  const renderList = ({item, index}) => {
    return (
      <FlatList
        data={Object.values(item?.questions)}
        renderItem={renderQuestion}
        style={{ width: WIDTH }}
        contentContainerStyle={{ padding: 16 }}
        maxToRenderPerBatch={10}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={10}
      />
    );
  };

  const renderQuestion = ({ item, index }) => {
    return (
        <Question
            questionItem={item?.question}
            items={Object.values(item?.items)}
            index={index}
            is_multiple={item?.question?.is_multiple}
            resultType={resultType ? resultType : RESULT_TYPES.DEFAULT}
        />
    )
  }

  if (isFetching) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView style={styles.container}>
      {renderNavigationHeader()}
      <FlatList
        ref={listRef}
        data={data?.results}
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
    </UniversalView>
  )
}

const SubjectsModal = ({
  visible,
  subjects = [],
  onSelect = () => undefined,
}) => {
  
  const headerHeight = useHeaderHeight()

  const onSubject = (s, index) => {
    onSelect(s?.name, index);
  };

  const onBackDrop = () => {

  }

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView style={styles.modal}>
        <View style={{ height: headerHeight }}/>
        {subjects.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={styles.subject}
            activeOpacity={0.85}
            onPress={() => onSubject(s, i)}>
            <Text style={styles.subjectText}>{s?.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.backDrop} onPress={onBackDrop}/>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  timerContainer: {
    padding: 4,
    borderRadius: 4,
  },
  navigationHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12
  },
  navigationHeaderTitle: {
    ...setFontStyle(17, "500"),
  },
  list: {
    flex: 1,
    padding: 16,
  },
  modal: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  backDrop: {
    flex: 1,
    backgroundColor: "rgba(0.0, 0.0, 0.0, 0.2)"
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

export default UBTResultScreen