import {strings} from '../localization';

export const checkPrice = (price, showZero = false, currency = "₸") => {
  let _price = parseFloat(price);
  if (_price > 0) {
    return _price?.toLocaleString('ru-Ru') + ' ' + currency;
  } else {
    if (showZero) {
      return 0;
    } else {
      return strings.Бесплатно;
    }
  }
};
