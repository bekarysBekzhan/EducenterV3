import {FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import UniversalView from '../../components/view/UniversalView';
import {useFetching} from '../../hooks/useFetching';
import {CourseService} from '../../services/API';
import CalendarCourseItem from '../../components/item/CalendarCourseItem';

const CalendarScreen = ({navigation}) => {
  const [dataSource, setDataSource] = useState({
    data: [],
  });

  const [fetchCalendar, loading] = useFetching(async () => {
    let params = {};

    const response = await CourseService.fetchOfflineCalendar(params);
    console.log('fetchOfflineCalendar: ', response);

    setDataSource(prev => ({
      ...prev,
      data: response?.data?.data,
    }));
  }, []);

  useEffect(() => {
    fetchCalendar();
  }, []);

  const renderItem = useCallback(() => <CalendarCourseItem />, []);

  const keyExtractor = useCallback((_, index) => index, []);

  return (
    <UniversalView haveLoader={loading}>
      <FlatList
        data={dataSource?.data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </UniversalView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({});
