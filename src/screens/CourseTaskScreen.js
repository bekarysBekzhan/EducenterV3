import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
  Keyboard,
} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
import {useState} from 'react';
import {useFetching} from '../hooks/useFetching';
import {CourseService} from '../services/API';
import LoadingScreen from '../components/LoadingScreen';
import {strings} from '../localization';
import {isValidText, setFontStyle} from '../utils/utils';
import HtmlView from '../components/HtmlView';
import Person from '../components/Person';
import RowView from '../components/view/RowView';
import {AttachIcon, SendIcon, x} from '../assets/icons';
import Input from '../components/Input';
import {APP_COLORS, WIDTH} from '../constans/constants';
import Divider from '../components/Divider';
import FastImage from 'react-native-fast-image';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRef} from 'react';
import FileItem from '../components/FileItem';
import Overlay from '../components/view/Overlay';

const CourseTaskScreen = props => {
  const lessonTitle = props.route?.params?.title;
  const id = props.route?.params?.id;

  const controller = useRef(new AbortController());

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [data, setData] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [height, setHeight] = useState(48);
  const [inputHeight, setInputHeight] = useState(0);

  const [fetchTask, isLoading, fetchingError] = useFetching(async () => {
    const response = await CourseService.fetchTask(id);
    setData(response.data?.data);
  });

  const [sendAnswer, isSending, sendingError] = useFetching(async () => {
    await CourseService.sendTaskAnswer(
      data?.id,
      answer,
      attachedFile,
      controller.current,
      setProgress,
    );
    setAnswer('');
    setAttachedFile(null);
    setProgress(0);
    fetchTask();
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: lessonTitle ? lessonTitle : strings.Задание,
    });
  }, []);

  useEffect(() => {
    fetchTask();
    return () => {
      if (controller.current) {
        controller.current.abort();
      }
    };
  }, []);

  // fetchTask error handler
  useEffect(() => {
    if (fetchingError) {
      console.log(fetchingError);
    }
  }, [fetchingError]);

  // sendAnswer error handler
  useEffect(() => {
    if (sendingError) {
      console.log(sendingError);
      setProgress(0);
      setAttachedFile(null);
      setAnswer('');
    }
  }, [sendingError]);

  const selectFile = async () => {
    Keyboard.dismiss();
    try {
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
          DocumentPicker.types.pdf,
          DocumentPicker.types.plainText,
          DocumentPicker.types.xls,
          DocumentPicker.types.xlsx,
          DocumentPicker.types.ppt,
          DocumentPicker.types.pptx,
        ],
        copyTo: 'documentDirectory',
      });
      setAttachedFile(res);
    } catch (e) {
      if (DocumentPicker.isCancel()) {
        Keyboard.dismiss();
      } else {
        throw e;
      }
    }
  };

  const selectPhoto = () => {
    const options = {
      quality: 0.2,
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      console.log(' Image Library Response : ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName,
        };

        setAttachedFile(source);
      }
    });
  };

  const attachFilesTapped = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [strings.Отмена, strings.Файл, strings.Фото],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            selectFile();
          } else if (buttonIndex === 2) {
            selectPhoto();
          }
        },
      );
    } else {
      selectFile();
    }
  };

  const sendAnswerTapped = () => {
    if (isValidText(answer)) {
      Keyboard.dismiss();
      sendAnswer();
    }
  };

  const onRefresh = () => {
    if (controller.current) {
      controller.current.abort();
    }
    fetchTask();
  };

  const onContentSizeChange = ({nativeEvent: {contentSize}}) => {
    if (inputHeight === 0) {
      console.log('initial set ', contentSize.height);
      setInputHeight(contentSize.height);
    } else if (inputHeight !== contentSize.height) {
      console.log('next line : ', inputHeight, contentSize.height);
      setHeight(prev => prev + contentSize.height - inputHeight);
      setInputHeight(contentSize.height);
    }
  };

  const renderHeader = () => <ListHeader data={data} />;

  const renderItem = ({item, index}) => {
    return <TaskResult item={item} index={index} />;
  };

  if (data === null) {
    return <LoadingScreen />;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'android' ? null : 'padding'}
      style={styles.container}
      keyboardVerticalOffset={keyboardOffset}>
      <FlatList
        style={styles.listContainer}
        data={data?.passing_answers}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={isLoading}
        contentContainerStyle={styles.listContent}
      />
      {attachedFile ? (
        <RowView style={styles.attachedFile}>
          <Text style={styles.attachedFileName} numberOfLines={1}>
            {attachedFile?.name}
          </Text>
          <TouchableOpacity onPress={() => setAttachedFile(null)}>
            {x(11, APP_COLORS.primary)}
          </TouchableOpacity>
        </RowView>
      ) : null}
      <View
        style={styles.replySection}
        onLayout={({
          nativeEvent: {
            layout: {width, height},
          },
        }) => {
          console.log('height: ', height);
          setKeyboardOffset(height);
        }}>
        <TouchableOpacity
          onPress={attachFilesTapped}
          activeOpacity={0.9}
          disabled={attachedFile}>
          <AttachIcon />
        </TouchableOpacity>
        <Input
          extraStyle={[styles.input, {height: height}]}
          multiline
          value={answer}
          onContentSizeChange={onContentSizeChange}
          onChangeText={value => setAnswer(value)}
          placeholder={strings['Напишите результаты задания']}
        />
        <TouchableOpacity
          style={styles.sendIcon}
          onPress={sendAnswerTapped}
          disabled={!isValidText(answer)}
          activeOpacity={0.9}>
          <SendIcon />
        </TouchableOpacity>
      </View>
      <Overlay visible={isSending} />
    </KeyboardAvoidingView>
  );
};

const ListHeader = ({data}) => {
  return (
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
};

const TaskResult = ({item, index}) => {
  return (
    <RowView style={taskResult.container}>
      <FastImage source={{uri: item?.user?.avatar}} style={taskResult.image} />
      <View style={taskResult.info}>
        <Text style={taskResult.user}>
          {item?.user?.name} {item?.user?.surname}
        </Text>
        <Text style={taskResult.answer}>{item?.answer}</Text>
        {item?.file ? (
          <FileItem urlFile={item?.file} fileName={item?.file_name} />
        ) : null}
        <Text style={taskResult.date}>
          {item?.created_time?.date} {item?.created_time?.time}
        </Text>
      </View>
    </RowView>
  );
};

const styles = StyleSheet.create({
  listContent:{
    paddingBottom:50
  },
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
    borderRadius: 14,
    backgroundColor: APP_COLORS.input,
    maxHeight: 120,
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
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
  cancelIcon: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachedFile: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1.2,
    borderColor: APP_COLORS.border,
  },
  attachedFileName: {
    ...setFontStyle(12, '300'),
    marginRight: 8,
    width: WIDTH / 3,
  },
});

const taskResult = StyleSheet.create({
  container: {
    flex: 1,
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
  info: {
    flex: 1,
  },
  user: {
    ...setFontStyle(16, '600'),
    marginBottom: 6,
  },
  answer: {
    ...setFontStyle(13, '400'),
    marginBottom: 12,
  },
  date: {
    marginBottom: 10,
  },
});

export default CourseTaskScreen;
