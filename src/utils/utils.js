import {StyleSheet} from 'react-native';
import {APP_COLORS} from '../constans/constants';
import {strings} from '../localization';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import {Alert} from 'react-native';

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
  if (value === null) {
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
  const whole = Math.floor(time);
  let seconds = whole % 60;
  let minutes = (whole - seconds) / 60;
  let secondString = seconds < 10 ? '0' + seconds : seconds;
  let minuteString = minutes < 10 ? '0' + minutes : minutes;
  return minuteString + ':' + secondString;
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
