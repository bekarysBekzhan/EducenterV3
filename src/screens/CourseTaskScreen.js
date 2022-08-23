import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect} from 'react';
import UniversalView from '../components/view/UniversalView';
import {useState} from 'react';
import {useFetching} from '../hooks/useFetching';
import {CourseService} from '../services/API';
import LoadingScreen from '../components/LoadingScreen';
import {strings} from '../localization';
import {setFontStyle} from '../utils/utils';
import HtmlView from '../components/HtmlView';
import Person from '../components/Person';
import RowView from '../components/view/RowView';
import {AttachIcon, SendIcon} from '../assets/icons';
import Input from '../components/Input';
import {APP_COLORS} from '../constans/constants';
import Divider from '../components/Divider';
import FastImage from 'react-native-fast-image';

const CourseTaskScreen = props => {
  const id = props.route?.params?.id;

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [fetchTask, isLoading, fetchingError] = useFetching(async () => {
    const response = await CourseService.fetchTask(id);
    setData(response.data?.data);
  });

  useEffect(() => {
    fetchTask();
  }, []);

  const renderHeader = () => (
    <View>
      <Text style={styles.onlineTask}>{strings['Онлайн задание']}</Text>
      <Text style={styles.tips}>
        {
          strings[
            'Выполните онлайн задание, чтобы закрепить материалы курса и получить сертификат.'
          ]
        }
      </Text>
      <HtmlView html={data?.task?.question} />
      <Divider isAbsolute={false} style={{marginBottom: 24}} />
      <Person
        status={strings.Преподаватель}
        image={data?.author?.avatar}
        name={data?.author?.name + ' ' + data?.author?.surname}
        description={data?.author?.description}
      />
      <Text style={styles.taskResult}>{strings['Результаты задания']}</Text>
    </View>
  );

  const renderItem = ({item, index}) => {
    return <TaskResult item={item} index={index} />;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={keyboardOffset}>
      <FlatList
        style={styles.listContainer}
        data={data?.passing_answers}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
      <View
        style={styles.replySection}
        onLayout={({
          nativeEvent: {
            layout: {width, height},
          },
        }) => {
          setKeyboardOffset(height);
        }}>
        <TouchableOpacity>
          <AttachIcon />
        </TouchableOpacity>
        <Input
          extraStyle={styles.input}
          multiline
          value={answer}
          onChangeText={value => setAnswer(value)}
          placeholder={strings['Напишите результаты задания']}
        />
        <TouchableOpacity style={styles.sendIcon}>
          <SendIcon />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const TaskResult = ({item, index}) => {
  return (
    <RowView style={taskResult.container}>
      <FastImage source={{uri: item?.user?.avatar}} style={taskResult.image} />
      <View>
        <Text style={taskResult.user}>
          {item?.user?.name} {item?.user?.surname}
        </Text>
        <Text style={taskResult.answer}>{item?.answer}</Text>
        {item?.file ? <View /> : null}
      </View>
    </RowView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listContainer: {
    padding: 16,
  },
  title: {
    ...setFontStyle(24, '700'),
  },
  tips: {
    ...setFontStyle(16),
    marginBottom: 16,
  },
  onlineTask: {
    ...setFontStyle(21, '700'),
    marginBottom: 7,
  },
  replySection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    paddingTop: 8,
    justifyContent: 'space-between',
    borderTopWidth: 0.75,
    borderColor: APP_COLORS.border,
  },
  input: {
    flex: 1,
    marginHorizontal: 16,
    height: 38,
    borderRadius: 14,
    borderWidth: 0.25,
    borderColor: APP_COLORS.border,
  },
  sendIcon: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskResult: {
    ...setFontStyle(21, '700'),
    marginBottom: 8,
    marginTop: 24,
  },
});

const taskResult = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    borderBottomWidth: 0.5,
    paddingTop: 16,
    borderColor: APP_COLORS.border,
  },
  image: {
    width: 42,
    height: 42,
    borderRadius: 100,
    marginRight: 12,
  },
  user: {
    ...setFontStyle(16, '600'),
    marginBottom: 6,
  },
  answer: {
    ...setFontStyle(13, '400'),
    marginBottom: 12,
  },
});

export default CourseTaskScreen;
