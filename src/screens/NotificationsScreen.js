import {View, Text, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import {strings} from '../localization';
import {useFetching} from '../hooks/useFetching';
import LoadingScreen from '../components/LoadingScreen';
import {NotificationService} from '../services/API';
import RowView from '../components/view/RowView';
import { NotificationItemIcon } from '../assets/icons';
import { setFontStyle } from '../utils/utils';
import { APP_COLORS } from '../constans/constants';
import Loader from '../components/Loader';
import Divider from '../components/Divider';
import Empty from '../components/Empty';

const NotificationsScreen = ({navigation}) => {
  const [notifications, setNotifications] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [fetchNotifications, isFetching, error] = useFetching(async () => {
    const response = await NotificationService.fetch();
    setNotifications(response.data?.data?.notifications?.data);
    setLastPage(response.data?.data?.notifications?.last_page);
  });

  const [fetchNextPage, isFetchingNext, errorNext] = useFetching(async () => {
    const response = await NotificationService.fetch(page);
    setNotifications(prev => prev.concat(response.data?.data?.notifications?.data))
  });

  useEffect(() => {
    if (page === 1) {
      fetchNotifications();
    } else {
      fetchNextPage();
    }
  }, [page]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: strings.Уведомления,
    });
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <NotificationItem 
        type={item?.type}
        message={item?.message}
        date={item?.added_at}
      />
    );
  };

  const renderFooter = () => {
    if (isFetchingNext) {
      return <Loader style={styles.loader} />;
    }
    return null;
  };

  const onEndReached = () => {
    if (!isFetchingNext) {
      if (page < lastPage) {
        setPage(prev => prev + 1);
      }
    }
  }

  const onRefresh = () => {
    if (page === 1) {
      fetchNotifications();
    } else {
      setPage(1);
    }
  }

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <FlatList 
        data={notifications} 
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Divider/>}
        // onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={isFetching}
        initialNumToRender={20}
        ListFooterComponent={renderFooter}
      />
    </UniversalView>
  );
};

const NotificationItem = ({ message, date, type }) => {
  return (
    <RowView style={notification.container}>
      <NotificationItemIcon type={type}/>
      <View style={notification.view}>
        <Text style={notification.message} numberOfLines={3}>{message}</Text>
        <Text style={notification.date}>{date}</Text>
      </View>
    </RowView>
  );
};

const styles = StyleSheet.create({
  loader: {
    marginVertical: 16,
  },
});

const notification = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "flex-start"
  },
  view: {
    flex: 1,
    marginLeft: 16,
  },
  message: {
    flex: 1,
    ...setFontStyle(15, "600"),
    marginBottom: 8
  },
  date: {
    ...setFontStyle(13, "500", APP_COLORS.placeholder)
  }
})

export default NotificationsScreen;
