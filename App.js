import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import UniversalView from './src/components/view/UniversalView';
import OutlineButton from './src/components/button/OutlineButton';
import SimpleButton from './src/components/button/SimpleButton';
import TransactionButton from './src/components/button/TransactionButton';
import RowView from './src/components/view/RowView';
import HeaderView from './src/components/view/HeaderView';
import ReviewItem from './src/components/view/ReviewItem';
import RatingStar from './src/components/RatingStar';
import {left_icon, right_icon} from './src/assets/icons';
import NavButtonRow from './src/components/view/NavButtonRow';
import TopTab from './src/components/view/TopTab';
import HomeScreen from './src/HomeScreen';
import HomeScreen2 from './src/HomeScreen2';
import AnswerOption from './src/components/test/AnswerOption';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import Question from './src/components/test/Question';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CourseRow from './src/components/CourseRow';

const viewstyle = {padding: 16};
const Stack = createNativeStackNavigator();

const App = () => {
  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    } else if (event.type === Event.PlaybackState) {
      console.log('state : ', event.state);
    } else if (event.type === Event.PlaybackTrackChanged) {
      console.log('event : ', event);
    } else if (event.type === Event.PlaybackProgressUpdated) {
      console.log('PlaybackProgressUpdated : ', event);
    }
  });

  useEffect(() => {
    setupPlayer();

    return () => {
      destroyPlayer();
    };
  }, []);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      console.log('Player setup');
    } catch {
      console.log('Player setup failed');
    }
  };

  const destroyPlayer = async () => {
    await TrackPlayer.destroy();
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Audio" component={AudioView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Home = ({navigation}) => {
  const [rating, setRating] = useState(0);

  const screens = [
    { "name": "Мои курсы", "component": HomeScreen },
    { "name": "Мои тесты", "component": HomeScreen2 },
    { "name": "Мои задания", "component": HomeScreen }
  ]

  return (
    <UniversalView haveScroll>
      <HeaderView
        leftIcon={left_icon}
        onLeftPress={() => Alert.alert('onLeftPress')}
        rightIcon={right_icon}
        onRightPress={() => Alert.alert('onRightPress')}
        haveBottomLine
        // title or component
        // title={'titleText'}
        component={
          <TextInput
            style={{
              width: '100%',
              height: 36,
              borderRadius: 12,
              backgroundColor: '#F5F5F5',
            }}
          />
        }
      />


      <TopTab
        screens={screens}
        swipeEnabled={true}
      />

      <View style={viewstyle}>
        <OutlineButton text={'Outline Button'} />

        <View style={viewstyle} />

        <SimpleButton
          text={'Simple Button'}
          onPress={() => navigation.navigate('Audio')}
        />

        <View style={viewstyle} />

        <TransactionButton
          text={'Transaction Button'}
          price={990}
          oldPrice={1000}
        />

        <View style={viewstyle} />

        <RowView style={{justifyContent: 'space-between'}}>
          <Text>RowView text 1</Text>
          <Text>RowView text 2</Text>
        </RowView>

        <View style={viewstyle} />

        <ReviewItem
          avatar="https://edukey.kz/custom/img/illustration1.png"
          name="Devon Lane"
          date="25 августа"
          rating="4.5 из 5"
          startRating={4.5}
          review="As a developer, I really appreciated the chapter on Color Theory. It was just the right balance of theory combined with examples."
        />
        <View style={viewstyle} />

        {/* <RatingStar
        halfStarEnabled={true}
        maxStars={5}
        disabled={false}
        rating={rating}
        starSize={50}
        selectedStar={rating => setRating(rating)} /> */}
        <View style={viewstyle} />

        <NavButtonRow
          leftIcon={right_icon}
          title="Журнал"
          onPress={() => Alert.alert('fff')}
        />
        <CourseRow
          poster={"https://demo.educenter.kz/storage/poster/269232162262d79a449c52b4.08770484_i.jpg"}
          category_name="Реклама"
          title="Турецкий язык"
          old_price={500000}
          price={100000}
          rating="4.2"
          reviewCount={68}
        />
        <View style={{marginBottom: 15}} />
      </View>
    </UniversalView>

  );
};

const events = [
  Event.PlaybackError,
  Event.PlaybackMetadataReceived,
  Event.PlaybackProgressUpdated,
  Event.PlaybackTrackChanged,
  Event.PlaybackState,
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const questions = [
  '<div class="ckeditor-html5-audio" style="text-align:center">\r\n<audio controls="controls" controlslist="nodownload" src="https://demo.educenter.kz/storage/files/243573902162d8ffa8da5fa8.96197209_Audio - Steve Jobs - Stay Hung.mp3">&nbsp;</audio>\r\n</div>\r\n\r\n<p>&nbsp;</p>',
  '<div class="ckeditor-html5-audio" style="text-align:center">\r\n<audio controls="controls" controlslist="nodownload" src="https://demo.educenter.kz/storage/files/352707353262dfae818540b0.82868427_English_Speeches_Elon_Musk_Fut.mp3">&nbsp;</audio>\r\n</div>\r\n\r\n<p>&nbsp;</p>',
  '<p><span class="math-tex">\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)</span></p>',
  '<p><em>Что выведет данный код:<code>&lt;?php<br />\r\n&nbsp; echo&nbsp;&quot;1&quot;&nbsp;+&nbsp;&quot;2&quot;;<br />\r\n?&gt;</code></em></p>',
  '<p><em>Марина написала код:<code>&lt;?php<br />\r\n&nbsp;&nbsp;function&nbsp;myfunc(&amp;$a)&nbsp;{<br />\r\n&nbsp; &nbsp; $a++;<br />\r\n&nbsp;&nbsp;}<br />\r\n&nbsp; $b&nbsp;=&nbsp;5;<br />\r\n&nbsp; myfunc($b);<br />\r\n&nbsp; echo $b;<br />\r\n?&gt;</code>Что она увидит, когда запустит скрипт?</em></p>',
];

var is_multiple = false

const getMultiple = () => {
  console.log("is_multiple : " , is_multiple)
  is_multiple = !is_multiple
  return is_multiple
}

const DATA = Array(5)
  .fill(null)
  .map((_, index) => ({
    id: index,
    question: questions[getRandomInt(4)],
    is_multiple: getMultiple(),
    answers: [
      {
        id: 0,
        answer: 'Пользователю легко с интерфейсом',
      },
      {
        id: 1,
        answer:
          '<div class="ckeditor-html5-audio" style="text-align:center">\r\n<audio controls="controls" controlslist="nodownload" src="https://demo.educenter.kz/storage/files/243573902162d8ffa8da5fa8.96197209_Audio - Steve Jobs - Stay Hung.mp3">&nbsp;</audio>\r\n</div>\r\n\r\n<p>&nbsp;</p>',
      },
      {
        id: 2,
        answer:
          '<p><span class="math-tex">\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)</span></p>',
      },
    ],
  }));

const passing_answers = {
  0: {
    0: {
      selected: true,
    },
    1: {
      selected: false,
    },
    2: {
      selected: false,
    },
  },
  1: {
    0: {
      selected: false,
    },
    1: {
      selected: true,
    },
    2: {
      selected: false,
    },
  },
  2: {
    0: {
      selected: false,
    },
    1: {
      selected: false,
    },
    2: {
      selected: true,
    },
  },
  3: {
    0: {
      selected: false,
    },
    1: {
      selected: false,
    },
    2: {
      selected: false,
    },
  },
  4: {
    0: {
      selected: false,
    },
    1: {
      selected: false,
    },
    2: {
      selected: false,
    },
  },
};

const AudioView = () => {
  const currentSetPlaying = useRef(null);
  const currentSetDuration = useRef(null);
  const currentSetPosition = useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setLoading(false);

    return () => {
      resetAudio();
    };
  }, []);

  const resetAudio = async () => {
    await TrackPlayer.reset();
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

  const renderQuestion = ({item, index}) => {
    return (
      <Question
        questionItem={item}
        passing_answers={passing_answers}
        index={index}
        is_multiple={item.is_multiple}
        onTrackChange={onTrackChange}
      />
    );
  };

  return (
    <UniversalView>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={DATA}
          renderItem={renderQuestion}
          style={{padding: 16}}
          // maxToRenderPerBatch={10}
          keyExtractor={(item, index) => index.toString()}
          // initialNumToRender={12}
        />
      )}
    </UniversalView>
  );
};

export default App;
