import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useFetching} from '../hooks/useFetching';
import {CourseService} from '../services/API';
import Overlay from '../components/view/Overlay';
import SimpleButton from '../components/button/SimpleButton';
import {setFontStyle} from '../utils/utils';
import RatingStar from '../components/RatingStar';
import {APP_COLORS} from '../constans/constants';
import {useLocalization} from './../components/context/LocalizationProvider';
import {lang} from './../localization/lang';

const WriteReviewScreen = props => {
  const {localization} = useLocalization();

  const id = props.route?.params?.id;

  const [buttonHeight, setButtonHeight] = useState(0);
  const [rateCourse, isSending, requestError] = useFetching(async () => {
    await CourseService.rateCourse(id, text, rating);
    alertSuccessful();
  });

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: lang('Оставить отзыв', localization),
    });
  }, []);

  useEffect(() => {
    if (requestError) {
      console.log(requestError);
      props.navigation.popToTop();
    }
  }, [requestError]);

  useEffect(() => {
    console.log('Current rating : ', rating);
  }, [rating]);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const onChangeText = value => {
    setText(value);
  };
  const onAlertButton = () => {
    props.navigation.popToTop();
  };

  const onButtonLayout = ({
    nativeEvent: {
      layout: {width, height},
    },
  }) => {
    console.log('button height : ', height);
    setButtonHeight(2 * height);
  };

  const alertSuccessful = () => {
    Alert.alert(
      lang('Спасибо!', localization),
      lang('Ваш отзыв принят!', localization),
      [
        {
          text: 'OK',
          onPress: onAlertButton,
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS == 'android' ? null : 'padding'}
      keyboardVerticalOffset={buttonHeight}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <RatingStar
          halfStarEnabled={false}
          starSize={54}
          rating={rating}
          selectedStar={setRating}
        />
        <TextInput
          value={text}
          placeholder={lang('Ваш отзыв', localization)}
          placeholderTextColor={APP_COLORS.placeholder}
          onChangeText={onChangeText}
          blurOnSubmit={false}
          style={styles.input}
          multiline
        />
        <View style={styles.spacer} />
        <SimpleButton
          text={lang('Оставить отзыв', localization)}
          onPress={rateCourse}
          onLayout={onButtonLayout}
        />
      </ScrollView>
      <Overlay visible={isSending} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 16,
  },
  input: {
    flex: 1,
    marginTop: 16,
    height: 200,
    ...setFontStyle(20, '400', undefined, 25),
  },
  spacer: {
    flex: 1,
  },
});

export default WriteReviewScreen;
