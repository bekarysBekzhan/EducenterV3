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
import Loader from '../../components/Loader';
import Empty from '../../components/Empty';

const CalendarScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    data: [],
    day: moment().format('YYYY-MM-DD'),
    backgroundColors: {},
    dayKey: null,
    loadMore: false,
    page: 1,
    lastPage: null,
  });

  const [fetchCalendar, loading] = useFetching(async () => {
    let params = {
      day: dataSource?.day,
    };

    const response = await CourseService.fetchOfflineCalendar(params);
    console.log('fetchOfflineCalendar: ', response);

    let dayData = {};
    let selectedDayBackgroundColors = {};

    let formatDays = moment(dataSource?.day).format('YYYY-MM');

    Object.entries(response?.data?.filters?.events)?.forEach(([k, v]) => {
      let splitDay = k?.split('day_')[1];

      let keyFormat = formatDays + '-' + splitDay;

      dayData[moment(keyFormat).format('YYYY-MM-DD')] = {
        selected: false,
        customStyles: {
          text: {
            color: v?.count ? (v?.color ? v?.color : '#000') : '#000',
          },
        },
      };

      selectedDayBackgroundColors[moment(keyFormat).format('YYYY-MM-DD')] =
        v?.count
          ? v?.color
            ? v?.color
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
    fetchCalendar();
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, [dataSource?.day]);

  const onEndReached = () => {
    if (!dataSource?.loadMore) {
      if (dataSource?.page < dataSource?.lastPage) {
        setDataSource(prev => ({
          ...prev,
          loadMore: true,
          page: prev?.page + 1,
        }));
      }
    }
  };

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

  const renderFooter = () => {
    if (dataSource?.loadMore) {
      return <Loader />;
    }
    return null;
  };

  const renderEmpty = () => <Empty />;

  return (
    <UniversalView haveLoader={loading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={styles.listHeader}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.01}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
