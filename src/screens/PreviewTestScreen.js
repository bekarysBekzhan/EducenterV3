import {View, Text, StyleSheet} from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import UniversalView from '../components/view/UniversalView';
import {strings} from '../localization';
import {setFontStyle, wordLocalization} from '../utils/utils';
import RowView from '../components/view/RowView';
import {APP_COLORS} from '../constans/constants';
import OutlineButton from '../components/button/OutlineButton';
import { ROUTE_NAMES } from '../components/navigation/routes';
import { useFetching } from '../hooks/useFetching';
import { CourseService, TestService, UBTService } from '../services/API';
import LoadingScreen from '../components/LoadingScreen';

const PreviewTestScreen = props => {

  const id = props.route?.params?.id
  const again = props.route?.params?.again
  const lessonTitle = props.route?.params?.title
  const type = props.route?.params?.type

  const [data, setData] = useState(null)
  const [fetchTestInfo, isLoading, fetchingError] = useFetching(async() => {
    let response
    if (type === "module") {
      response = await TestService.fetchTestInfo(id)
    } else if (type === "ubt") {
      response = await UBTService.fetchTestInfo(id)
    } else {
      response = await CourseService.fetchTestInfo(id)
    }
    setData(response.data?.data)
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: lessonTitle ? lessonTitle : strings['Онлайн тест']
    })
    fetchTestInfo()
  }, [])

  const onStartTest = () => {
    if (type === "module") {
      props.navigation.navigate(ROUTE_NAMES.myTestPass, {id: id, title: lessonTitle, again})
    } else if (type === "ubt") {
      props.navigation.navigate(ROUTE_NAMES.ubtTest, { id: id, title: lessonTitle, again})
    } else {
      props.navigation.navigate(ROUTE_NAMES.testPass, {id: id, title: lessonTitle, again})
    }
  }

  if (isLoading) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView style={styles.container}>
      <Text style={styles.onlineTest}>{strings['Онлайн тест']}</Text>
      <Text style={styles.tips}>
        {
          strings[
            'Пройдите онлайн тест, чтобы закрепить материалы курса и получить сертификат.'
          ]
        }
      </Text>
      <RowView>
        <View style={styles.dot} />
        <Text style={styles.label}>
          {wordLocalization(strings['Прохождения теста занимает :num минут.'], {
            num: Number(data?.minutes) ,
          })}
        </Text>
      </RowView>
      <RowView>
        <View style={styles.dot} />
        <Text style={styles.label}>
          {wordLocalization(strings['Тест состоит из :num вопросов'], {
            num: Number(data?.tests_count) ,
          })}
        </Text>
      </RowView>
      <RowView>
        <View style={styles.dot} />
        <Text style={styles.label}>
          {
            strings[
              'Чтобы пройти тест вам нужно ответить правильно на 50% и более вопросов.'
            ]
          }
        </Text>
      </RowView>
      <OutlineButton
        text={strings['Начать тестирование']}
        onPress={onStartTest}
        style={{marginTop: 30}}
      />
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  activityContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  onlineTest: {
    ...setFontStyle(21, '700'),
    marginBottom: 7,
  },
  tips: {
    ...setFontStyle(16),
    marginBottom: 16,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 100,
    backgroundColor: APP_COLORS.placeholder,
    marginRight: 8,
  },
  label: {
    flex:1,
    ...setFontStyle(14),
    marginVertical: 3.5,
  },
});

export default PreviewTestScreen;
