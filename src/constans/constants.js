import { Dimensions } from 'react-native';

export const WIDTH = Dimensions.get('screen').width
export const HEIGHT = Dimensions.get("screen").height

export const APP_COLORS = {
  primary: '#5559F4',
  placeholder: '#808191',
  font: '#111621',
  input: '#F5F5F5',
};

export const DOMAIN = "https://demo.educenter.kz"
export const REQUEST_HEADERS = {
  'Accept': 'application/json'
}

export const URLS = {
  settings: "settings/mobile",
  languages: "languages"
}