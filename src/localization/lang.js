import {strings} from '.';

export const lang = (value, localization) => {
  
  if (localization?.current?.translates[value]?.text) {
    return localization.current.translates[value].text;
  }

  if (strings[`${[value]}`]) {
    return strings[`${[value]}`];
  }

  return value;
};
