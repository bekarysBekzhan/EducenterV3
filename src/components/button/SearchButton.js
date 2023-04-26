import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {search} from '../../assets/icons';
import {setFontStyle} from '../../utils/utils';
import {APP_COLORS, WIDTH} from '../../constans/constants';
import {ROUTE_NAMES} from '../navigation/routes';
import {lang} from '../../localization/lang';
import {useLocalization} from '../context/LocalizationProvider';

const SearchButton = ({navigation, type = 'course', filters = {}}) => {
  const {localization} = useLocalization();

  let route = ROUTE_NAMES.courseSearch;
  let placeholder = lang('Поиск курсов', localization);

  if (type === 'test') {
    route = ROUTE_NAMES.testSearch;
    placeholder = lang('Поиск тестов', localization);
  } else if (type === 'task') {
    route = ROUTE_NAMES.taskSearch;
    placeholder = lang('Поиск заданий', localization);
  } else if (type === 'offlineCourse') {
    placeholder = lang('Офлайн курсы', localization);
    route = ROUTE_NAMES.offlineCourseSearchScreen;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => navigation.navigate(route, {filters})}>
      {search()}
      <Text style={styles.text}>{placeholder}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WIDTH - 32,
    padding: 14,
    margin: 16,
    marginVertical: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: APP_COLORS.input,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {...setFontStyle(15, '400', APP_COLORS.placeholder), marginLeft: 15},
});

export default SearchButton;
