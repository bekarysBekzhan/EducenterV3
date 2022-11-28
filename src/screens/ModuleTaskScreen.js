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
import React, {useEffect, useLayoutEffect, useMemo} from 'react';
import {useState} from 'react';
import {useFetching} from '../hooks/useFetching';
import {CourseService, TaskService} from '../services/API';
import LoadingScreen from '../components/LoadingScreen';
import {strings} from '../localization';
import {isValidText, setFontStyle} from '../utils/utils';
import HtmlView from '../components/HtmlView';
import Person from '../components/Person';
import RowView from '../components/view/RowView';
import {AttachIcon, MicrophoneIcon, SendIcon, x} from '../assets/icons';
import Input from '../components/Input';
import {APP_COLORS, WIDTH} from '../constans/constants';
import Divider from '../components/Divider';
import FastImage from 'react-native-fast-image';
import DocumentPicker from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRef} from 'react';
import FileItem from '../components/FileItem';
import Overlay from '../components/view/Overlay';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import TrackPlayer, {
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import AnswerAudio from '../components/AnswerAudio';
import RNFetchBlob from 'rn-fetch-blob';
import {useSettings} from '../components/context/Provider';

const audioRecorder = new AudioRecorderPlayer();

const audioFormats = {
  m4a: true,
  aac: true,
  mp3: true,
  amr: true,
  flac: true,
  wav: true,
};

const dirs = RNFetchBlob.fs.dirs;
const AUDIO_PATH = Platform.select({
  ios: 'audio.aac',
  android: `${dirs.CacheDir}/audio.aac`,
});

const ModuleTaskScreen = props => {
  // props passed down from parent
  const id = props.route?.params?.id;

  const {settings} = useSettings();
  const controller = useRef(new AbortController());

  // use refs
  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);

  // screen states
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [data, setData] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [height, setHeight] = useState(48);
  const [inputHeight, setInputHeight] = useState(0);
  const [audioObject, setAudioObject] = useState(null);

  /*
    Below animation properties of react-native-reanimted library
  */
  // shared values for animating audio recording button
  const recordButtonWidth = useSharedValue(styles.sendIcon.width);
  const recordButtonHeight = useSharedValue(styles.sendIcon.height);
  // animated style for audio recording button container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: recordButtonWidth.value,
      height: recordButtonHeight.value,
    };
  });

  // service for fetching task from server
  const [fetchTask, isLoading, fetchingError] = useFetching(async () => {
    const response = await TaskService.showTaskByID(id);

    let exe;

    let counter = 0;

    for (let i = 0; i < response.data?.data?.passing_answers?.length; i++) {
      exe = response.data?.data?.passing_answers[i]?.file_name?.split('.');
      if (audioFormats.hasOwnProperty(exe[exe.length - 1])) {
        response.data.data.passing_answers[i].isAudio = true;
        response.data.data.passing_answers[i].index = counter;
        counter += 1;
      } else {
        response.data.data.passing_answers[i].isAudio = false;
      }
    }

    setData(response.data?.data);
  });

  // service for sending task results to server
  const [sendAnswer, isSending, sendingError] = useFetching(async () => {
    const file = attachedFile ? attachedFile : audioObject;

    await CourseService.sendTaskAnswer(
      data?.id,
      answer,
      file,
      controller.current,
      setProgress,
    );
    setAnswer('');
    setAttachedFile(null);
    onRemoveAudio();
    setProgress(0);
    fetchTask();
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: strings.Задание,
    });
  }, []);

  useEffect(() => {
    fetchTask();
    return async () => {
      if (controller.current) {
        controller.current.abort();
      }
      await TrackPlayer.reset();
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

  useEffect(() => {
    console.log('audio', audioObject);
  }, [audioObject]);

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

      if (audioObject) {
        setAudioObject(null);
      }
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

        if (audioObject) {
          setAudioObject(null);
        }

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

  const sendAnswerTapped = async () => {
    const audioState = await TrackPlayer.getState();
    if (State.Playing == audioState) {
      await TrackPlayer.pause();
      currentSetPlaying.current(false);
    }
    if (isValidText(answer) || attachedFile || audioObject) {
      Keyboard.dismiss();
      sendAnswer();
    }
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

  const pauseCurrentTrack = async () => {
    const state = await TrackPlayer.getState();
    console.log(state);
    if (state === State.Playing) {
      TrackPlayer.pause()
        .then(() => {
          currentSetPlaying.current(false);
          onStartRecording();
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      onStartRecording();
    }
  };

  const onStartRecording = async () => {
    if (attachedFile) {
      setAttachedFile(null);
    } else if (audioObject) {
      setAudioObject(null);
    }

    recordButtonWidth.value = withSpring(recordButtonWidth.value * 1.5); // increasing record button width with spring animation
    recordButtonHeight.value = withSpring(recordButtonHeight.value * 1.5); // increasing record button height with spring animation

    try {
      const result = await audioRecorder.startRecorder(AUDIO_PATH, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
        AVModeIOS: AVModeIOSOption.voicechat,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVModeIOS: AVModeIOSOption.measurement,
        AVNumberOfChannelsKeyIOS: 2,
      });
      audioRecorder.addRecordBackListener(e => {
        console.log('addRecordBackListener', e);
        return;
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onStopRecording = async () => {
    recordButtonWidth.value = withSpring(styles.sendIcon.width); // decreasing record button width to initial value
    recordButtonHeight.value = withSpring(styles.sendIcon.height); // decreasing record button height to initial value
    try {
      const result = await audioRecorder.stopRecorder();
      audioRecorder.removeRecordBackListener();
      console.log('recorded audio result', result);
      setAudioObject({
        uri: result,
        name: 'audio.aac',
        type: 'audio/aac',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onRemoveAudio = async () => {
    const audioIndex = (await TrackPlayer.getQueue()).length - 1;

    TrackPlayer.pause()
      .then(() => {
        TrackPlayer.remove([audioIndex])
          .then(async value => {
            console.log(
              'Audio ' + audioIndex + ' successfully removed from queue!',
            );
            let tracks = await TrackPlayer.getQueue();
            console.log('tracks', tracks);
          })
          .catch(err => {
            console.log(
              'Error while removing audio ' + audioIndex + ' from queue.',
            );
          });
        setAudioObject(null);
      })
      .catch(err => {
        console.log('error while pausing recorded audio!', err);
      });
  };

  const _renderHeader = useMemo(() => <ListHeader data={data} />, [isLoading]);

  const renderHeader = () => <ListHeader data={data} />;

  const renderItem = ({item, index}) => {
    return (
      <TaskResult item={item} index={index} onTrackChange={onTrackChange} />
    );
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
        ListHeaderComponent={_renderHeader}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={isLoading}
        contentContainerStyle={styles.contentList}
        overScrollMode="never"
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
      {audioObject ? (
        // <Animated.View entering={"FadeIn"} style={styles.audioRecorded} exiting={"FadeOut"}>
        //   <TouchableOpacity style={styles.removeAudioButton} activeOpacity={0.5} onPress={onRemoveAudio}>
        //     {x(11, APP_COLORS.primary)}
        //   </TouchableOpacity>
        //   <AnswerAudio url={audioObject?.uri} _index={data?.passing_answers.filter(a => a.isAudio).length} onTrackChange={onTrackChange}/>
        // </Animated.View>
        <View style={styles.audioRecorded}>
          <TouchableOpacity
            style={styles.removeAudioButton}
            activeOpacity={0.5}
            onPress={onRemoveAudio}>
            {x(11, APP_COLORS.primary)}
          </TouchableOpacity>
          <AnswerAudio
            url={audioObject?.uri}
            _index={data?.passing_answers?.filter(a => a.isAudio).length}
            onTrackChange={onTrackChange}
          />
        </View>
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
          activeOpacity={0.9}>
          <SendIcon />
        </TouchableOpacity>
        {settings?.audio_record ? (
          <Animated.View
            style={[styles.sendIcon, {marginLeft: 10}, animatedStyle]}>
            <TouchableOpacity
              onPressIn={pauseCurrentTrack}
              onPressOut={onStopRecording}
              activeOpacity={0.9}>
              <MicrophoneIcon width={20} height={20} />
            </TouchableOpacity>
          </Animated.View>
        ) : null}
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
      <Text style={styles.onlineTask}>{data?.task?.title}</Text>
      <HtmlView html={data?.task?.question} />
      <Divider isAbsolute={false} style={{marginBottom: 24}} />
      <Person
        status={strings.Преподаватель}
        image={data?.author?.avatar}
        name={data?.author?.name}
        description={data?.author?.description}
      />
      <Text style={styles.taskResult}>{strings['Результаты задания']}</Text>
    </View>
  );
};

const TaskResult = ({item, index, onTrackChange = () => undefined}) => {
  return (
    <RowView style={taskResult.container}>
      <FastImage source={{uri: item?.user?.avatar}} style={taskResult.image} />
      <View style={taskResult.info}>
        <Text style={taskResult.user}>
          {item?.user?.name} {item?.user?.surname}
        </Text>
        <Text style={taskResult.answer}>{item?.answer}</Text>
        {item?.file ? (
          item?.isAudio ? (
            <AnswerAudio
              url={item?.file}
              _index={item?.index}
              onTrackChange={onTrackChange}
            />
          ) : (
            <FileItem urlFile={item?.file} fileName={item?.file_name} />
          )
        ) : null}
        <Text style={taskResult.date}>
          {item?.created_time?.date} {item?.created_time?.time}
        </Text>
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
  contentList: {
    paddingBottom: 50,
  },
  audioRecorded: {
    backgroundColor: APP_COLORS.white,
    width: WIDTH,
    padding: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: APP_COLORS.border,
  },
  removeAudioButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
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

export default ModuleTaskScreen;
