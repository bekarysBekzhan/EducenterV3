import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, { useLayoutEffect, useRef } from 'react';
import UniversalView from '../components/view/UniversalView';
import { useEffect } from 'react';
import { useFetching } from '../hooks/useFetching';
import { CourseService } from '../services/API';
import { useState } from 'react';
import { APP_COLORS, N_STATUS, SHOW_TYPE, WIDTH } from '../constants/constants';
import HtmlView from '../components/HtmlView';
import {
  generateHash,
  getProgressPercent,
  isValidText,
  passedLessonCount,
  setFontStyle,
} from '../utils/utils';
import RowView from '../components/view/RowView';
import OutlineButton from '../components/button/OutlineButton';
import { CourseProgramIcon, LeftIcon, RightIcon, x } from '../assets/icons';
import { ROUTE_NAMES } from '../components/navigation/routes';
import { useIsCaptured } from 'react-native-is-screen-captured-ios';
import AudioPlayer from '../components/AudioPlayer';
import TrackPlayer from 'react-native-track-player';
import Overlay from '../components/view/Overlay';
import FileItem from '../components/FileItem';
import SimpleButton from '../components/button/SimpleButton';
import Empty from '../components/Empty';
import LoadingScreen from '../components/LoadingScreen';
import Divider from '../components/Divider';
import { Modal } from 'react-native';
import MyCourseChapter from '../components/course/MyCourseChapter';
import CourseChapter from '../components/course/CourseChapter';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSettings } from '../components/context/Provider';
import ShowType from '../components/test/ShowType';
import { useLocalization } from '../components/context/LocalizationProvider';
import { lang } from '../localization/lang';
import SmallHeaderBar from '../components/SmallHeaderBar';

const LessonScreen = props => {
  const { localization } = useLocalization();

  const id = props.route?.params?.id;
  const chapterTitle = props.route?.params?.title;

  const { nstatus, settings } = useSettings();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [course, setCourse] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [isCourseProgram, setIsCourseProgram] = useState(false);
  const [padding, setPadding] = useState(0);
  const [isShowType, setIsShowType] = useState(false);
  const isCaptured = Platform.OS == 'ios' ? useIsCaptured() : false;

  const navigationHeight = useHeaderHeight();

  const [fetchLesson, isLoading, lessonError] = useFetching(async () => {
    let params = {};
    if (nstatus === N_STATUS) {
      params.publication_app = await generateHash();
    }
    const response = await CourseService.fetchLesson(id, params);
    const courseID = response.data?.data?.chapter?.course.id;
    const courseData = (await CourseService.fetchCourseByID(courseID)).data
      ?.data;
    setCourse(courseData);
    setData(response.data?.data);
    setComments(response.data?.data?.comments);
  });

  useLayoutEffect(() => {
    const MAX_TITLE_LENGTH = 20;
    props.navigation.setOptions({
      title: chapterTitle 
      ? (chapterTitle.length > MAX_TITLE_LENGTH 
          ? `${chapterTitle.substring(0, MAX_TITLE_LENGTH)}...` 
          : chapterTitle) 
      : lang('Урок', localization),
      headerTitleAlign: 'center',
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

  const submitCommentTapped = (commentId, comment) => {
    if (commentId) {
      let commentsChanged = comments;
      commentsChanged.forEach((cmnt, index) => {
        if (cmnt.id === commentId) {
          commentsChanged[index].comment_lists.push(comment);
        }
      });
      setComments(commentsChanged);
    } else {
      setComments(prev => prev.concat(comment));
    }
  };

  const onPressNextLesson = async () => {
    if (data?.isLast) {
      props.navigation.navigate(ROUTE_NAMES.courseFinish, {
        id: data?.course?.id,
      });
      return;
    }
    setIsModal(true);
    try {
      let params = {};
      if (nstatus === N_STATUS) {
        params.publication_app = await generateHash();
      }
      const response = await CourseService.fetchLesson(
        data?.next_lesson_id,
        params,
      );
      if (response.status === 200) {
        props.navigation.replace(ROUTE_NAMES.lesson, {
          id: data?.next_lesson_id,
        });
      }
    } catch (e) {
      console.log(e);
    }
    setIsModal(false);
  };

  const onPressPreviousLesson = async () => {
    await TrackPlayer.reset();
    props.navigation.replace(ROUTE_NAMES.lesson, {
      id: data?.previous_lesson_id,
    });
  };

  const onLayoutSwitchBar = ({
    nativeEvent: {
      layout: { height },
    },
  }) => {
    setPadding(height + 16);
  };

  const onExitCourseProgram = () => setIsCourseProgram(false);

  const onShowTypeBackDrop = () => setIsShowType(false);

  const onShowTypeSelect = showType => {
    switch (showType) {
      case SHOW_TYPE.test:
        props.navigation.navigate(ROUTE_NAMES.testPreview, {
          id: data?.id,
          title: data?.title,
          again: true,
        });
        break;
      case SHOW_TYPE.result:
        props.navigation.navigate(ROUTE_NAMES.testResult, {
          id: data?.show_id,
          resultType: data?.result_type,
        });
        break;
      default:
        return;
    }
  };

  const onPressTest = async () => {
    if (data?.show_type === SHOW_TYPE.result) {
      setIsShowType(true);
    } else {
      await TrackPlayer.reset();
      props.navigation.navigate(ROUTE_NAMES.testPreview, {
        id: data?.id,
        title: data?.title,
      });
    }
  };

  const onPressTask = async () => {
    await TrackPlayer.reset();
    props.navigation.navigate(ROUTE_NAMES.courseTask, {
      id: data?.id,
      title: data?.title,
      fetchLesson: fetchLesson,
    });
  };

  const renderHeader = () => {
    return (
      <View>
        <TouchableOpacity
          style={styles.programmButton}
          activeOpacity={0.65}
          onPress={() => {
            setIsCourseProgram(true);
          }}>
          <CourseProgramIcon />
          <Text style={styles.programText}>
            {lang('Программа курса', localization)}
          </Text>
        </TouchableOpacity>
        <View style={styles.video}>
          <HtmlView html={data?.video} />
        </View>
        <Text style={styles.title}>{data?.title}</Text>
        {data?.audio ? (
          <AudioPlayer
            _index={1}
            url={data?.audio}
            onTrackChange={() => undefined}
            style={{ padding: 0 }}
          />
        ) : null}
        {data?.files.map((file, index) => (
          <FileItem
            fileName={file?.file_name}
            urlFile={file?.link}
            style={{ marginVertical: 16 }}
            key={index}
          />
        ))}
        <View style={styles.descriptionContainer}>
          <HtmlView html={data?.description} />
        </View>
        {data?.test_enabled ? (
          <OutlineButton
            text={lang('Пройти тест', localization)}
            onPress={onPressTest}
            style={[styles.testButton, {backgroundColor: settings?.color_app}]}
          />
        ) : null}
        {data?.task_enabled ? (
          <OutlineButton
            text={lang('Пройти задание', localization)}
            onPress={onPressTask}
            style={[styles.taskButton, {backgroundColor: settings?.color_app}]}
          />
        ) : null}
        {settings?.modules_enable_comments_lesson ? (
          <WriteComment
            lessonId={id}
            submitCommentTapped={submitCommentTapped}
            localization={localization}
          />
        ) : null}
        {settings?.modules_enable_comments_lesson ? (
          <Text style={styles.commentsCount}>
            {comments.length} {lang('Комментарий', localization)}
          </Text>
        ) : null}
        {settings?.modules_enable_comments_lesson ? (
          <Divider isAbsolute={false} />
        ) : null}
      </View>
    );
  };

  const renderComment = ({ item, index }) => {
    if (!settings?.modules_enable_comments_lesson) return null;
    return (
      <Comment
        id={item?.id}
        name={item?.user?.name}
        date={item?.added_at}
        localization={localization}
        text={item?.text}
        replies={item?.comment_lists}
        lessonId={id}
        submitCommentTapped={submitCommentTapped}
      />
    );
  };

  const renderBottomPadding = () => <View style={{ height: padding }} />;

  const renderEmptyComponent = () => {
    if (!settings?.modules_enable_comments_lesson) return null;
    return <Empty text={lang('Нет комментариев', localization)} />;
  };

  const renderModalHeader = () => {
    return (
      <RowView style={modal.header}>
        <Text style={modal.text}>{lang('Программа курса', localization)}</Text>
        <TouchableOpacity onPress={() => setIsCourseProgram(false)}>
          {x(16, settings?.color_app)}
        </TouchableOpacity>
      </RowView>
    );
  };

  const renderChapter = ({ item, index }) => {
    if (course?.has_subscribed) {
      return (
        <MyCourseChapter
          item={item}
          index={index}
          hasSubscribed={course?.has_subscribed}
          navigation={props.navigation}
          passedLessonsCount={passedLessonCount(item, course)}
          totalLessonsCount={item?.lessons_count}
          percent={getProgressPercent(item, course)}
          onPress={onExitCourseProgram}
          from="lesson"
        />
      );
    }

    return (
      <CourseChapter
        item={item}
        index={index}
        hasSubscribed={course?.has_subscribed}
        navigation={props.navigation}
        onPress={onExitCourseProgram}
        from="lesson"
      />
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isCaptured) {
    return <UniversalView style={styles.isCapturedContainer} />;
  }

  console.log('Data: ', data)

  return (
    <UniversalView>
      <FlatList
        data={comments}
        style={styles.container}
        renderItem={renderComment}
        keyExtractor={(_, index) => index.toString()}
        ItemSeparatorComponent={() => <Divider isAbsolute={false} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderBottomPadding}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        overScrollMode="never"
      />
      <View style={[styles.switchBar, {backgroundColor: settings?.color_app}]} onLayout={onLayoutSwitchBar}>
        {data?.isFirst ? (
          <View />
        ) : (
          <TouchableOpacity
            style={styles.switchButton}
            onPress={onPressPreviousLesson}>
            <LeftIcon color={APP_COLORS.white} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.switchButton}
          onPress={onPressNextLesson}
          disabled={isModal}>
          <RightIcon color={APP_COLORS.white} />
        </TouchableOpacity>
      </View>
      <Overlay visible={isModal} />
      <Modal transparent={true} animationType="fade" visible={isCourseProgram}>
        <View style={modal.container}>
          <View style={{ height: navigationHeight }} />
          <View style={modal.listContainer}>
            <FlatList
              data={course?.chapters}
              ListHeaderComponent={renderModalHeader}
              renderItem={renderChapter}
              ListFooterComponent={() => <View style={{ height: 50 }} />}
              ItemSeparatorComponent={() => <Divider />}
              keyExtractor={(_, index) => index.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
      <ShowType
        visible={isShowType}
        onHide={onShowTypeBackDrop}
        onSelect={onShowTypeSelect}
      />
    </UniversalView>
  );
};

const WriteComment = ({
  lessonId,
  submitCommentTapped = () => undefined,
  localization,
}) => {
  const [text, setText] = useState('');
  const [sendComment, isLoading, sendingError] = useFetching(async () => {
    const response = await CourseService.sendComment(lessonId, null, text);
    const commentSent = response.data?.data?.[response.data?.data?.length - 1];
    submitCommentTapped(null, commentSent);
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
        placeholder={lang('Комментарий', localization)}
        placeholderTextColor={APP_COLORS.placeholder}
        multiline
        blurOnSubmit={false}
        style={styles.input}
      />
      <SimpleButton
        text={lang('Отправить', localization)}
        onPress={onPress}
        loading={isLoading}
      />
      <Overlay visible={isLoading} />
    </View>
  );
};

const Comment = ({
  lessonId,
  id,
  name,
  date,
  text,
  submitCommentTapped = () => undefined,
  localization,
  replies = [],
}) => {
  const [reply, setReply] = useState('');
  const [isModal, setIsModal] = useState(false);
  const replyID = useRef(null);

  const [sendReply, isLoading, sendingError] = useFetching(async () => {
    const response = await CourseService.sendComment(
      lessonId,
      replyID.current,
      reply,
    );
    setReply('');
    const comments = response.data?.data;
    const commentLists = comments.filter(cmnt => cmnt?.id === id)[0]
      ?.comment_lists;
    const replySent = commentLists[commentLists.length - 1];
    submitCommentTapped(id, replySent);
  });

  const onPress = () => {
    setIsModal(false);
    if (isValidText(reply)) {
      sendReply();
    } else {
      setReply('');
    }
  };

  const onChangeReply = value => {
    setReply(value);
  };

  const onReply = replyId => {
    replyID.current = replyId;
    setIsModal(true);
  };

  useEffect(() => {
    if (sendingError) {
      console.log(sendingError);
    }
  }, [sendingError]);

  const renderHeader = () => {
    return (
      <View style={comment.container}>
        <Text style={comment.name}>{name}</Text>
        <Text style={comment.date}>{date}</Text>
        <Text style={comment.text}>{text}</Text>
        <TouchableOpacity
          style={comment.button}
          activeOpacity={0.65}
          onPress={() => onReply(id)}>
          <Text style={comment.buttonText}>
            {lang('Ответить', localization)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderReply = ({ item, index }) => {
    return (
      <View style={comment.reply}>
        <Text style={comment.name}>{item?.user?.name}</Text>
        <Text style={comment.date}>{item?.added_at}</Text>
        <Text style={comment.text}>{item?.text}</Text>
        <TouchableOpacity
          style={comment.button}
          activeOpacity={0.65}
          onPress={() => onReply(item?.id)}>
          <Text style={comment.buttonText}>
            {lang('Ответить', localization)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={replies}
        renderItem={renderReply}
        ListHeaderComponent={renderHeader}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        bounces={false}
      />
      <Modal visible={isModal} transparent={true} animationType="fade">
        <TouchableOpacity
          activeOpacity={0}
          style={comment.backDrop}
          onPress={() => setIsModal(false)}>
          <View style={comment.modal}>
            <Text style={comment.name}>{lang('Ответить', localization)}</Text>
            <Divider isAbsolute />
            <TextInput
              value={reply}
              onChangeText={onChangeReply}
              placeholder={lang('Комментарий', localization)}
              placeholderTextColor={APP_COLORS.placeholder}
              multiline
              blurOnSubmit={false}
              style={styles.input}
            />
            <SimpleButton
              text={lang('Отправить', localization)}
              onPress={() => onPress()}
              loading={isLoading}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 50,
  },
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
    marginVertical: 4,
  },
  taskButton: {
    marginVertical: 4,
  },
  switchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: WIDTH,
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: APP_COLORS.primary,
    borderTopWidth: 0.75,
    borderColor: APP_COLORS.border,
  },
  switchButton: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor: APP_COLORS.gray3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    // flex: 1,
    height: 120,
    ...setFontStyle(16, '400', undefined, 25),
    marginVertical: 16,
    padding: 12,
    borderWidth: 0.4,
    borderColor: APP_COLORS.border,
    borderRadius: 6,
  },
  commentsCount: {
    ...setFontStyle(19, '600'),
    marginTop: 48,
    marginBottom: 12,
  },
  programmButton: {
    padding: 14,
    backgroundColor: APP_COLORS.input,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  programText: {
    marginLeft: 16,
    color: APP_COLORS.font,
  },
});

const comment = StyleSheet.create({
  container: {
    paddingVertical: 12,
    flex: 1,
  },
  name: {
    marginBottom: 5,
    ...setFontStyle(16, '600'),
  },
  date: {
    marginBottom: 8,
    ...setFontStyle(15, '500', APP_COLORS.placeholder),
  },
  text: {
    marginBottom: 8,
  },
  button: {
    alignSelf: 'flex-end',
  },
  buttonText: {
    ...setFontStyle(13, '600', APP_COLORS.placeholder),
    textTransform: 'uppercase',
  },
  reply: {
    width: '80%',
    backgroundColor: APP_COLORS.gray,
    borderRadius: 6,
    padding: 12,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  backDrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: WIDTH - 36,
    borderRadius: 12,
    backgroundColor: APP_COLORS.white,
    padding: 12,
  },
});

const modal = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.transparent,
  },
  listContainer: {
    flex: 1,
    backgroundColor: APP_COLORS.white,
  },
  header: {
    justifyContent: 'space-between',
    margin: 16,
  },
  text: {
    ...setFontStyle(18, '600'),
  },
});

export default LessonScreen;
