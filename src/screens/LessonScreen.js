import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import React, {useLayoutEffect} from 'react';
import UniversalView from '../components/view/UniversalView';
import {useEffect} from 'react';
import {useFetching} from '../hooks/useFetching';
import {CourseService} from '../services/API';
import {useState} from 'react';
import {APP_COLORS, WIDTH} from '../constans/constants';
import HtmlView from '../components/HtmlView';
import {isValidText, setFontStyle} from '../utils/utils';
import RowView from '../components/view/RowView';
import OutlineButton from '../components/button/OutlineButton';
import {strings} from '../localization';
import {LeftIcon, RightIcon} from '../assets/icons';
import {ROUTE_NAMES} from '../components/navigation/routes';
import {useIsCaptured} from 'react-native-is-screen-captured-ios';
import AudioPlayer from '../components/AudioPlayer';
import TrackPlayer from 'react-native-track-player';
import Overlay from '../components/view/Overlay';
import FileItem from '../components/FileItem';
import SimpleButton from '../components/button/SimpleButton';
import Empty from '../components/Empty';
import LoadingScreen from '../components/LoadingScreen';
import TextButton from '../components/button/TextButton';
import Divider from '../components/Divider';

const LessonScreen = props => {
  const id = props.route?.params?.id;
  const chapterTitle = props.route?.params?.title;

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const isCaptured = useIsCaptured();
  const [fetchLesson, isLoading, lessonError] = useFetching(async () => {
    const response = await CourseService.fetchLesson(id);
    setData(response.data?.data);
    setComments(response.data?.data?.comments);
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: chapterTitle ? chapterTitle : strings.урок,
    });
  }, []);

  useEffect(() => {
    if (lessonError) {
      if (lessonError?.status !== 200) {
        props.navigation.goBack();
        return;
      }
    }
  }, [lessonError]);

  useEffect(() => {
    fetchLesson();

    return async () => {
      await TrackPlayer.reset();
    };
  }, []);

  const submitCommentTapped = (replyID, comment) => {
    if (replyID) {

    } else {
        setComments(prev => prev.concat(comment))
    }
  }

  const nextLessonTapped = async () => {
    if (data?.isLast) {
      props.navigation.navigate(ROUTE_NAMES.courseFinish, {
        id: data?.course?.id,
      });
      return;
    }

    setIsModal(true);

    try {
      const response = await CourseService.fetchLesson(data?.next_lesson_id);
      if (response.status === 200) {
        if (data?.isLast) {
          props.navigation.navigate('');
          return;
        }
        props.navigation.replace(ROUTE_NAMES.lesson, {
          id: data?.next_lesson_id,
        });
      }
    } catch (e) {
      console.log(e);
    }

    setIsModal(false);
  };

  const previousLessonTapped = () => {
    if (data?.isFirst) {
      return;
    }

    props.navigation.replace(ROUTE_NAMES.lesson, {
      id: data?.previous_lesson_id,
    });
  };

  const renderHeader = () => {
    return (
      <View>
        <View>
          <View style={styles.video}>
            <HtmlView html={data?.video} />
          </View>
          <Text style={styles.title}>{data?.title}</Text>
          {data?.audio ? (
            <AudioPlayer
              _index={1}
              url={data?.audio}
              onTrackChange={() => undefined}
              style={{padding: 0}}
            />
          ) : null}
          {data?.files.map((file, index) => (
            <FileItem
              fileName={file?.file_name}
              urlFile={file?.link}
              style={{marginVertical: 16}}
              key={index}
            />
          ))}
          <View style={styles.descriptionContainer}>
            <HtmlView html={data?.description} />
          </View>
          {data?.test_enabled ? (
            <OutlineButton
              text={strings['Пройти тест']}
              onPress={() =>
                props.navigation.navigate(ROUTE_NAMES.testPreview, {
                  id: data?.id,
                  title: data?.title,
                })
              }
              style={styles.testButton}
            />
          ) : null}
          {data?.task_enabled ? (
            <OutlineButton
              text={strings['Пройти задание']}
              onPress={() =>
                props.navigation.navigate(ROUTE_NAMES.courseTask, {
                  id: data?.id,
                  title: data?.title,
                })
              }
              style={styles.taskButton}
            />
          ) : null}
          <WriteComment lessonId={id} />
          <Text style={styles.commentsCount}>{comments.length} {strings.Комментарий}</Text>
          <Divider isAbsolute={false}/>
        </View>
      </View>
    );
  };

  const renderComment = ({item, index}) => {

    return (
        <Comment
            name={item?.user?.name}
            date={item?.added_at}
            text={item?.text}
            replies={item?.comment_lists}
        />
    )
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isCaptured) {
    return <UniversalView style={styles.isCapturedContainer}></UniversalView>;
  }

  return (
    <UniversalView>
      <FlatList
        data={comments}
        style={styles.container}
        renderItem={renderComment}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <Divider isAbsolute={false}/>}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => <Empty text={strings['Нет комментариев']}/>}
      />
      <RowView style={styles.switchBar}>
        {data?.isFirst ? (
          <View />
        ) : (
          <TouchableOpacity
            style={styles.switchButton}
            onPress={previousLessonTapped}>
            <LeftIcon color={APP_COLORS.placeholder} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={nextLessonTapped}
          disabled={isModal}>
          <RightIcon color={APP_COLORS.placeholder} />
        </TouchableOpacity>
      </RowView>
      <Overlay visible={isModal} />
    </UniversalView>
  );
};

const WriteComment = ({lessonId, submitCommentTapped = () => undefined}) => {
  const [text, setText] = useState('');
  const [sendComment, isLoading, sendingError] = useFetching(async () => {
    const response = await CourseService.sendComment(lessonId, null, text);
    submitCommentTapped(null, response.data?.data)
  });

  const onChangeText = value => {
    setText(value);
  };

  const onPress = () => {
    if (isValidText(text)) {
      sendComment();
    } else {
      setText('');
    }
  };

  useEffect(() => {
    if (sendingError) {
      console.log(sendingError);
    }
  }, [sendingError]);

  return (
    <View>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        placeholder={strings.Комментарий}
        placeholderTextColor={APP_COLORS.placeholder}
        multiline
        blurOnSubmit={false}
        style={styles.input}
      />
      <SimpleButton
        text={strings.Отправить}
        onPress={onPress}
        loading={isLoading}
      />
    </View>
  );
};

const Comment = ({ 
    name,
    date,
    text,
    submitCommentTapped = () => undefined,
    replies = [],
 }) => {

    const renderHeader = () => {
        return (
            <View style={comment.container}>
                <Text style={comment.name}>{name}</Text>
                <Text style={comment.date}>{date}</Text>
                <Text style={comment.text}>{text}</Text>
                <TouchableOpacity style={comment.button} activeOpacity={0.65}>
                  <Text style={comment.buttonText}>{strings.Ответить}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const renderReply = ({ item, index }) => {
        return (
            <View style={comment.reply}>
              <Text style={comment.name}>{item?.user?.name}</Text>
              <Text style={comment.date}>{item?.added_at}</Text>
              <Text style={comment.text}>{item?.text}</Text>
              <TouchableOpacity style={comment.button} activeOpacity={0.65}>
                <Text style={comment.buttonText}>{strings.Ответить}</Text>
              </TouchableOpacity>
            </View>
        )
    }

    return (
        <FlatList
            data={replies}
            renderItem={renderReply}
            ListHeaderComponent={renderHeader}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
        />
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  isCapturedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginTop: 130,
  },
  video: {
    width: WIDTH - 32,
    alignItems: 'center',
  },
  title: {
    ...setFontStyle(21, '700'),
    marginVertical: 16,
  },
  descriptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  taskButton: {},
  switchBar: {
    position: 'absolute',
    bottom: 0,
    width: WIDTH,
    padding: 16,
    paddingTop: 7,
    paddingBottom: 50,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderTopWidth: 0.75,
    borderColor: APP_COLORS.border,
  },
  switchButton: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: APP_COLORS.input,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 120,
    ...setFontStyle(16, '400', undefined, 25),
    marginVertical: 16,
    padding: 12,
    borderWidth: 0.4,
    borderColor: APP_COLORS.border,
    borderRadius: 6,
  },
  commentsCount: {
    ...setFontStyle(19, "600"),
    marginTop: 48,
    marginBottom: 12
  }
});

const comment = StyleSheet.create({
    container: {
      paddingVertical: 12,
      flex: 1,
    },
    name: {
      marginBottom: 5,
      ...setFontStyle(16, "600")
    },
    date: {
      marginBottom: 8,
      ...setFontStyle(15, "500", APP_COLORS.placeholder)
    },
    text: {
      marginBottom: 8,
    },
    button: {
      alignSelf: "flex-end",
    },
    buttonText: {
      ...setFontStyle(13, "600", APP_COLORS.placeholder),
      textTransform: "uppercase",
    },
    reply: {
      width: "80%",
      backgroundColor: APP_COLORS.gray,
      borderRadius: 6,
      padding: 12,
      alignSelf: "flex-end",
      marginBottom: 16,
    }
})

export default LessonScreen;
