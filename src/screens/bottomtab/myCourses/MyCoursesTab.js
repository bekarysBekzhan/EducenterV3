import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import {MyCourseService} from '../../../services/API';
import {APP_COLORS, WIDTH} from '../../../constans/constants';
import LoadingScreen from '../../../components/LoadingScreen';
import {setFontStyle} from '../../../utils/utils';
import Empty from '../../../components/Empty';
import { MyCourseCard } from './designType/MyCourseCard';

const MyCoursesTab = props => {

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [data, setData] = useState([]);

  const [fetchCourses, isFetching, fetchingError] = useFetching(async () => {
    const response = await MyCourseService.fetchMyCourses();
    setData(response.data?.data);
    setLastPage(response.data?.last_page);
  });
  const [fetchNext, isFetchingNext, fetchingNextError] =
    useFetching(async () => {
      const response = await MyCourseService.fetchMyCourses('', page);
      setData(prev => prev.concat(response.data?.data));
    }, []);

  useEffect(() => {
    if (page === 1) {
      fetchCourses();
    } else {
      fetchNext();
    }
  }, [page]);

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1);
    }
  };

  const renderCourse = ({item, index}) => {
    return (
      <MyCourseCard item={item} index={index} navigation={props.navigation} />
    );
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  const onRefresh = () => {
    if (page === 1) {
      fetchCourses();
    }
    setPage(1);
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <FlatList
        data={data}
        renderItem={renderCourse}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<Empty />}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onEndReached={onEndReached}
        refreshing={isFetching}
        onRefresh={onRefresh}
      />
    </UniversalView>
  );
};

export const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  card: {
    paddingVertical: 16,
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.border,
  },
  poster: {
    flex: 1,
    borderRadius: 16,
    height: 220,
    marginBottom: 16,
  },
  posterOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 16,
    justifyContent: 'space-between',
  },
  position: {
    ...setFontStyle(16, '600', 'white'),
    textTransform: 'uppercase',
  },
  row1: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 7,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
  },
  actionText: {
    ...setFontStyle(12, '500', 'white'),
    marginLeft: 8,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginVertical: 8,
    ...setFontStyle(18, '600', 'white'),
  },
  description: {
    ...setFontStyle(14, '500', 'white'),
  },
});

export default MyCoursesTab;
