import {StyleSheet} from 'react-native';
import {
  APP_COLORS,
  CONFIG_TOKEN,
  PURE_DOMAIN,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
} from '../constans/constants';
import {strings} from '../localization';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {Alert} from 'react-native';
import { sha256 } from 'react-native-sha256';

export const getAudioUrl = html => {
  let pattern1 = new RegExp('src=');
  let pattern2 = null;
  let audioFormats = [
    '.mp3',
    '.aac',
    '.ogg',
    '.aa',
    '.wav',
    '.aiff',
    '.alac',
    '.wma',
  ];

  let start = pattern1.exec(html);
  if (start !== null) {
    let startIndex = start.index + 5;
    let finishIndex = null;
    if (
      audioFormats.filter(format => {
        if (html.includes(format)) {
          pattern2 = new RegExp(format);
          return true;
        }
        return false;
      }).length !== 0
    ) {
      let finish = pattern2.exec(html);
      finishIndex = finish.index + 4;
    }

    return html.slice(startIndex, finishIndex);
  }

  return null;
};

export const setFontStyle = (
  fontSize = 16,
  fontWeight = '400',
  color = APP_COLORS.font,
  lineHeight = fontSize + 3,
) => {
  const styles = StyleSheet.create({
    font: {
      fontSize,
      fontWeight,
      color,
      lineHeight,
    },
  });

  return styles.font;
};

export const getFormattedTime = time => {
  time = Math.round(time);
  let seconds = time % 60;
  let minutes = (time - seconds) / 60;
  seconds = seconds < 10 ? '0' + seconds : seconds.toString();
  return minutes + ':' + seconds;
};

export const selectComponent = (
  value,
  audioComponent,
  mathComponent,
  htmlComponent,
) => {
  if (value === null && value === undefined) {
    return null;
  }

  if (value?.includes('audio')) {
    // console.log("audio : " , value)
    return audioComponent;
  } else if (value?.includes('math-tex')) {
    // console.log("math : " , value)
    return mathComponent;
  }
  // console.log("html : " , value)
  return htmlComponent;
};

export const getCurrentTimeString = time => {
  let string = '';

  const hours = Math.floor(time / SECONDS_IN_HOUR);
  if (hours) {
    string += hours + ':';
    time -= hours * SECONDS_IN_HOUR;
  }

  const minutes = Math.floor(time / SECONDS_IN_MINUTE);
  if (minutes) {
    string += (minutes < 10 ? '0' + minutes : minutes) + ':';
    time -= minutes * SECONDS_IN_MINUTE;
  }

  const seconds = Math.floor(time);
  if (time) {
    string += seconds < 10 ? '0' + seconds : seconds;
  }

  return string;
};

export const getTimeString = seconds => {
  if (!(seconds > '-1')) {
    return '0' + strings.с;
  }

  let string = '';

  const hours = Math.floor(seconds / SECONDS_IN_HOUR);
  if (hours) {
    string += hours + ' ' + strings.ч + '.';
    seconds -= hours * SECONDS_IN_HOUR;
  }

  const minutes = Math.floor(seconds / SECONDS_IN_MINUTE);
  if (minutes) {
    string += minutes + ' ' + strings.мин + '.';
    seconds -= minutes * SECONDS_IN_MINUTE;
  }

  if (seconds) {
    string += seconds + ' ' + strings.с + '.';
  }

  return string;
};

export const wordLocalization = (word, args = {}, type = false) => {
  if (typeof strings[word] !== 'undefined') {
    if (!type) {
      word = strings[word];
    }
  }

  for (let [arg, value] of Object.entries(args)) {
    let reg = new RegExp(`:${arg}`, 'gi');
    word = word?.replace(reg, value);
  }
  return word;
};

export const fileDownloader = async (url, fileName, onDone, onProgress) => {
  console.log('url: ', url);
  console.log('fileName: ', fileName);

  if (url) {
    try {
      let localFile = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      let options = {
        fromUrl: encodeURI(url),
        toFile: localFile,
        background: false,
        discretionary: true,
        cacheable: true,
        progressInterval: 200,
        progressDivider: 20,
        begin: () => {},
        progress: onProgress,
      };

      let res = await RNFS.downloadFile(options).promise;

      console.log('res file downloader: ', res);

      if (res.statusCode == 200) {
        if (onDone) {
          onDone();
          onProgress(0);
        }
        let optionsFileView = {
          showAppsSuggestions: true,
          showOpenWithDialog: true,
        };
        setTimeout(
          async () => await FileViewer.open(localFile, optionsFileView),
          400,
        );
      } else {
        onDone();
        Alert.alert(strings['Внимание !!!'], strings['Ошибка !!!']);
      }
    } catch (e) {
      console.log('catch file downloader: ', e);
      if (onDone) {
        onDone();
      }
    }
  }
};

export const isValidText = (text = '') => {
  if (
    text.length > 0 &&
    text.length !== text.split('').filter(char => char === ' ').length
  ) {
    return true;
  }
  return false;
};

export const convertToIterable = object => {
  let array = [];
  for (const key in object) {
    array.push({
      key: key,
      value: object[key],
    });
  }
  console.log('convertToIterable result : ', array);
  return array;
};

export const getWhatsappNumber = phone => {
  let result = '';
  if (phone[0] === '8') {
    phone = phone.replace('8', '7');
  } else if (phone[0] === '+') {
    phone = phone.replace('+', '');
  }
  for (let index = 0; index < phone.length; index++) {
    if (isNumber(phone[index])) {
      result += phone[index];
    }
  }
  return result;
};

export const isNumber = str => {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); //
};

export const passedLessonCount = (chapter, data) => {
  if (chapter?.position < data?.progress?.last_chapter_position) {
    return chapter?.lessons_count;
  }
  if (chapter?.position > data?.progress?.last_chapter_position) {
    return 0;
  }

  return data?.progress?.last_lesson_position;
};

export const getProgressPercent = (chapter, data) => {
  return (passedLessonCount(chapter, data) / chapter?.lessons_count) * 100;
};

export const getHTML = str => {
  // open tag regular expression
  const re1 = /</;
  let startIndex;
  if (re1.exec(str) !== null) {
    console.log('start index: ', re1.lastIndex);
    startIndex = re1.lastIndex;
  } else {
    return null;
  }

  // closed tag regular expression
  const re2 = />/;

  let lastIndex;
  while (re2.exec(str) !== null) {
    lastIndex = re2.lastIndex;
  }

  if (lastIndex === undefined) {
    return null;
  }

  console.log('last index: ', lastIndex);
  return str.substring(startIndex, lastIndex + 1);
};

export const containsHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

export const generateHash = async() => {

  const hash = await sha256(PURE_DOMAIN + CONFIG_TOKEN);
  
  return hash;
};

export const getSeconds = (finishingTime) => {
  if (finishingTime === undefined || finishingTime === null) {
    return 0
  }

  const currentSeconds = new Date().getTime() / 1000
  const finishingSeconds = new Date(finishingTime).getTime() / 1000

  const diffSeconds = finishingSeconds - currentSeconds

  if (diffSeconds < 0) {
    return 0
  }

  return diffSeconds
}
