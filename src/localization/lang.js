import {strings} from '.';
import {useLocalization} from '../components/context/LocalizationProvider';

export const lang = value => {
  const {localization} = useLocalization();

  if (localization?.current?.translates[value]?.text) {
    return localization?.current?.translates[value]?.text;
  } else if (strings[`${[value]}`]) {
    return strings[`${[value]}`];
  } else {
    return value;
  }
};
