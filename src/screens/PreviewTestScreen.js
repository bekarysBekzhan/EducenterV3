import { View, Text, StyleSheet } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';
import UniversalView from '../components/view/UniversalView';
import { setFontStyle, wordLocalization } from '../utils/utils';
import RowView from '../components/view/RowView';
import { APP_COLORS, WIDTH } from '../constants/constants';
import OutlineButton from '../components/button/OutlineButton';
import { ROUTE_NAMES } from '../components/navigation/routes';
import { useFetching } from '../hooks/useFetching';
import { CourseService, TestService, UBTService } from '../services/API';
import LoadingScreen from '../components/LoadingScreen';
import { useLocalization } from '../components/context/LocalizationProvider';
import { lang } from '../localization/lang';
import SmallHeaderBar from '../components/SmallHeaderBar';
import { ClockIcon, DoneBoxIcon, ExclamationCircle } from '../assets/icons';

const PreviewTestScreen = props => {
  const { localization } = useLocalization();

  const id = props.route?.params?.id;
  const again = props.route?.params?.again;
  const lessonTitle = props.route?.params?.title;
  const type = props.route?.params?.type;

  const [data, setData] = useState(null);
  const [fetchTestInfo, isLoading] = useFetching(async () => {
    let response;
    if (type === 'module') {
      response = await TestService.fetchTestInfo(id);
    } else if (type === 'ubt') {
      response = await UBTService.fetchTestInfo(id);
    } else {
      response = await CourseService.fetchTestInfo(id);
    }
    setData(response.data?.data);
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: lessonTitle ? lessonTitle : lang('Онлайн тест', localization),
    });
    fetchTestInfo();
  }, []);

  const onStartTest = () => {
    if (type === 'module') {
      props.navigation.navigate(ROUTE_NAMES.myTestPass, {
        id: id,
        title: lessonTitle,
        again,
      });
    } else if (type === 'ubt') {
      props.navigation.navigate(ROUTE_NAMES.ubtTest, {
        id: id,
        title: lessonTitle,
        again,
      });
    } else {
      props.navigation.navigate(ROUTE_NAMES.testPass, {
        id: id,
        title: lessonTitle,
        again,
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log('Data in PreviewTestScreen: ', data)

  return (
    <UniversalView>
      <View style={styles.primaryView}>
        <SmallHeaderBar title={lessonTitle} />
        <View style={styles.container}>
          <View style={styles.testInfoCard}>
            <Text style={styles.onlineTest}>{lang('Онлайн тест', localization)}</Text>
            <Text style={styles.tips}>
              {lang(
                'Пройдите онлайн тест, чтобы закрепить материалы курса и получить сертификат.',
                localization,
              )}
            </Text>
            <RowView style={styles.rowView}>
              <ClockIcon />
              <Text style={styles.label}>
                {wordLocalization(
                  lang(':num минут', localization),
                  {
                    num: Number(data?.minutes),
                  },
                )}
              </Text>
            </RowView>
            <RowView>
              <DoneBoxIcon />
              <Text style={styles.label}>
                {wordLocalization(
                  lang(':num вопросов', localization),
                  {
                    num: Number(data?.tests_count),
                  },
                )}
              </Text>
            </RowView>
            <RowView>
              <ExclamationCircle />
              <Text style={styles.label}>
                {lang(
                  'Чтобы пройти тест вам нужно ответить правильно на 50% и более вопросов.',
                  localization,
                )}
              </Text>
            </RowView>
          </View>
          <OutlineButton
            text={lang('Начать тестирование', localization)}
            onPress={onStartTest}
            style={{ marginTop: 30 }}
          />
        </View>
      </View>
    </UniversalView>
  );
};

const styles = StyleSheet.create({
  primaryView: {
    backgroundColor: APP_COLORS.primary,
  },
  container: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: APP_COLORS.white,
  },
  testInfoCard: {
    height: 200,
    padding: 16,
    borderRadius: 16,
    backgroundColor: APP_COLORS.white,
    marginBottom: 16,
    elevation: 4,
    // shadowColor: '#0001531A',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.1,
    // shadowRadius: 92,
  },
  activityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  onlineTest: {
    ...setFontStyle(18, '600', APP_COLORS.black),
    marginBottom: 8,
    letterSpacing: 0.4,
    textAlign: 'left',
  },
  tips: {
    ...setFontStyle(16),
    marginBottom: 8,
  },
  rowView: {
  },
  label: {
    flex: 1,
    ...setFontStyle(14, '400', APP_COLORS.darkgray),
    textAlign: 'left',
    margin: 4,
  },

});

export default PreviewTestScreen;
