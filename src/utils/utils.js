import {StyleSheet} from 'react-native';
import { APP_COLORS } from '../constans/constants';
import { strings } from '../localization';

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

export const selectComponent = (value, audioComponent, mathComponent, htmlComponent) => {

  if(value === null) {
    return null
  }

  if (value?.includes("audio")) {
    return audioComponent
  } else if(value?.includes("math-tex")) {
    return mathComponent
  } 

  return htmlComponent
}

export const wordLocalization = (word, args = {}, type = false) => {

  if (typeof strings[word] !== "undefined") {
      if (!type) {
          word = strings[word];
      }
  }

  for (let [arg, value] of Object.entries(args)) {
      let reg = new RegExp(`:${arg}`, "gi");
      word = word.replace(reg, value);
  }
  return word;
}
