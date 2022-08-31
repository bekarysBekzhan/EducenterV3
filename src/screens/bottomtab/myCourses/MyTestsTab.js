import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import LoadingScreen from '../../../components/LoadingScreen';
import {MyCourseService} from '../../../services/API';
import {APP_COLORS, WIDTH} from '../../../constans/constants';
import {ROUTE_NAMES} from '../../../components/navigation/routes';
import { TimeIcon } from '../../../assets/icons';
import RowView from '../../../components/view/RowView';
import { setFontStyle } from '../../../utils/utils';
import { strings } from '../../../localization';

const MyTestsTab = props => {

  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [fetchTests, isFetching, fetchingError] = useFetching(async () => {
    const response = await MyCourseService.fetchMyTests();
    setData(response.data?.data);
    setLastPage(response.data?.last_page);
  });
  const [fetchNext, isFetchingNext, fetchingNextError] = useFetching(
    async () => {
      const response = await MyCourseService.fetchMyTests('', page);
      setData(prev => prev.concat(response.data?.data));
    },
  );

  // fetchTest error handler
  useEffect(() => {
    if (fetchingError) {
      console.log(fetchingError);
    }
  }, [fetchingError]);

  // fetchNext error handler
  useEffect(() => {
    if (fetchingNextError) {
      console.log(fetchingNextError);
    }
  });

  useEffect(() => {
    if (page === 1) {
      fetchTests();
    } else {
      fetchNext();
    }
  }, [page]);

  const renderTest = ({item, index}) => {
    return <View/>;

  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  const onEndReached = () => {
    if (page < lastPage && !isFetchingNext) {
      setPage(prev => prev + 1);
    }
  };

  const onRefresh = () => {
    if (page === 1) {
      fetchTests();
    }
    setPage(1);
  }

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <FlatList
        data={data}
        contentContainerStyle={styles.container}
        renderItem={renderTest}
        ListFooterComponent={renderFooter}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        refreshing={isFetching}
        onRefresh={onRefresh}
      />
    </UniversalView>
  );
};

const ModuleMyTestItem = ({
  id,
  index,
  categoryName,
  time,
  title,
  attempts,
  onPress = () => undefined,
}) => {
  const testItemTapped = () => {
    console.log('test : ', id);
    props.navigation.navigate(ROUTE_NAMES.myTestDetail, {id});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={testItemTapped}
      style={item.container}>
      <RowView style={styles.row1}>
        <Text style={styles.title}>{title}</Text>
        <RowView>
          <TimeIcon color={APP_COLORS.placeholder} size={16} />
          <Text style={styles.time}>
            {time ? time : 30} {strings.мин}
          </Text>
        </RowView>
      </RowView>
      <Text></Text>
      {
        
      }


    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const item = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    borderBottomWidth: 0.45,
    borderColor: APP_COLORS.border,
  },
  row1: {
    justifyContent: 'space-between',
  },
  category: {
    ...setFontStyle(11, '600', APP_COLORS.placeholder),
    textTransform: 'uppercase',
  },
  time: {
    ...setFontStyle(10, '600', APP_COLORS.placeholder),
    marginLeft: 4,
  },
  title: {
    ...setFontStyle(17, '600'),
    marginVertical: 5,
  },
  attempts: {
    ...setFontStyle(12, '500', APP_COLORS.placeholder),
  },
  row2: {
    justifyContent: 'space-between',
  },
  button: {
    marginTop: 5,
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
});

export default MyTestsTab;
