import {FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {CourseService} from '../../services/API';
import CalendarCourseItem from '../../components/item/CalendarCourseItem';
import {strings} from '../../localization';
import {ROUTE_NAMES} from '../../components/navigation/routes';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {APP_COLORS} from '../../constans/constants';
import moment from 'moment';
import 'moment';
import 'moment/min/locales';
import {API_V2} from '../../services/axios';

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }

  if (day.length < 2) {
    day = '0' + day;
  }

  return [year, month, day].join('-');
}

const CalendarScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    data: [],
    day: moment().format('YYYY-MM-DD'),
    backgroundColors: {},
    dayKey: null,
  });

  const [fetchCalendar, loading] = useFetching(async () => {
    let params = {};

    const response = await CourseService.fetchOfflineCalendar(params);
    console.log('fetchOfflineCalendar: ', response);

    let dayData = {};
    let selectedDayBackgroundColors = {};

    let year = new Date(dataSource?.day).getFullYear();
    let month = new Date(dataSource?.day).getMonth() + 1;
    if (month?.toString()?.length < 2) {
      month = '0' + month;
    }
    let formatDays = year + '-';

    Object.entries(response?.data?.filters?.events)?.forEach(([i, k]) => {
      let f =
        formatDays +
        (k?.month?.toString().length < 2 ? '0' + k?.month : k?.month) +
        '-' +
        (i.split('day_')[1].length < 2
          ? '0' + i.split('day_')[1]
          : i.split('day_')[1]);

      dayData[formatDate(f)] = {
        selected: false,
        customStyles: {
          text: {
            color: k?.count ? (k?.color ? k?.color : '#000') : '#000',
          },
        },
      };

      selectedDayBackgroundColors[formatDate(f)] = k?.count
        ? k?.color
          ? k?.color
          : APP_COLORS.primary
        : APP_COLORS.primary;

      dayData[dataSource?.day] = {
        selected: true,
        customStyles: {
          text: {
            color: '#fff',
          },
        },
      };
    });

    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
      dayKey: dayData,
      backgroundColors: selectedDayBackgroundColors,
    }));
  }, []);

  useLayoutEffect(() => {
    LocaleConfig.locales['ru'] = {
      monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
      ],
      monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
      ],
      dayNames: [
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
        'Воскресенье',
      ],
      dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    };
    LocaleConfig.locales['en'] = {
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      monthNamesShort: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      dayNames: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      dayNamesShort: ['Mn', 'Ts', 'Wn', 'Thr', 'Fr', 'Sa', 'Su'],
    };
    LocaleConfig.locales['kz'] = {
      monthNames: [
        'Қаңтар',
        'Ақпан',
        'Наурыз',
        'Сәуір',
        'Мамыр',
        'Маусым',
        'Шілде',
        'Тамыз',
        'Қыркүйек',
        'Қазан',
        'Қараша',
        'Желтоқсан',
      ],
      monthNamesShort: [
        'Қаң',
        'Ақп',
        'Нау',
        'Сәуір',
        'Мам',
        'Мау',
        'Шіл',
        'Тамыз',
        'Қыр',
        'Қаз',
        'Қар',
        'Жел',
      ],
      dayNames: [
        'Дүйсенбі',
        'Сейсенбі',
        'Сәрсенбі',
        'Бейсенбі',
        'Жұма',
        'Сенбі',
        'Жексенбі',
      ],
      dayNamesShort: ['Дүй', 'Сей', 'Сәр', 'Бей', 'Жұма', 'Сен', 'Жек'],
    };
    LocaleConfig.defaultLocale = API_V2.defaults.headers?.lang;
    navigation.setOptions({
      title: strings.Календарь,
      headerTitleAlign: 'center',
    });
  }, []);

  useEffect(() => {
    console.log('THIS', dataSource?.day);
    fetchCalendar();
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <CalendarCourseItem
        item={item}
        onPress={() =>
          navigation.navigate(ROUTE_NAMES.offlineCourseDetailsScreen, {
            courseID: item?.id,
          })
        }
      />
    ),
    [],
  );

  const keyExtractor = useCallback((_, index) => index, []);

  const onDayPress = day => {
    console.log('onDayPress: ', day);
    setDataSource(prev => ({
      ...prev,
      day: day?.dateString,
    }));
  };

  const renderHeader = () => (
    <Calendar
      current={dataSource?.day}
      markingType="custom"
      enableSwipeMonths={false}
      theme={{
        calendarBackground: '#fff',
        selectedDayBackgroundColor:
          dataSource?.backgroundColors?.hasOwnProperty(dataSource?.day)
            ? dataSource?.backgroundColors[dataSource?.day]
            : APP_COLORS.primary,
        todayTextColor: '#000',
        arrowColor: '#ACB4BE',
        textMonthFontSize: 15,
        textMonthFontWeight: '600',
        monthTextColor: APP_COLORS.primary,
      }}
      onDayPress={onDayPress}
      firstDay={1}
      minDate={'2000-01-01'}
      marking
      markedDates={dataSource?.dayKey}
    />
  );

  return (
    <UniversalView haveLoader={loading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeader}
      />
    </UniversalView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  listHeader: {
    marginBottom: 16,
  },
});
