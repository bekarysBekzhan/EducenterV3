import { Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import UniversalView from '../components/view/UniversalView';

import { useFetching } from '../hooks/useFetching';
import LoadingScreen from '../components/LoadingScreen';
import { NotificationService } from '../services/API';
import RowView from '../components/view/RowView';
import { NotificationItemIcon } from '../assets/icons';
import { containsHTML, setFontStyle } from '../utils/utils';
import { APP_COLORS, NOTIFICATION_TYPE } from '../constants/constants';
import Loader from '../components/Loader';
import Divider from '../components/Divider';
import HtmlView from '../components/HtmlView';
import { ROUTE_NAMES } from '../components/navigation/routes';
import Empty from '../components/Empty';
import { useLocalization } from '../components/context/LocalizationProvider';
import { lang } from '../localization/lang';
import SmallHeaderBar from '../components/SmallHeaderBar';

const NotificationsScreen = ({ navigation }) => {
  const { localization } = useLocalization();

  const [notifications, setNotifications] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [readNotifications, isReading, readingError] = useFetching(
    async ids => {
      await NotificationService.read(ids);
    },
  );

  const [fetchNotifications, isFetching, error] = useFetching(async () => {
    const response = await NotificationService.fetch();
    const notificationList = response.data?.data?.notifications?.data;
    setNotifications(notificationList);
    setLastPage(response.data?.data?.notifications?.last_page);

    await readNotifications(
      notificationList
        .filter(notification => !notification?.readed_at)
        .map(notification => notification?.id),
    );
  });

  const [fetchNextPage, isFetchingNext, errorNext] = useFetching(async () => {
    const response = await NotificationService.fetch(page);
    const notificationList = response.data?.data?.notifications?.data;
    setNotifications(prev => prev.concat(notificationList));

    await readNotifications(
      notificationList
        .filter(notification => !notification?.readed_at)
        .map(notification => notification?.id),
    );
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
      title: lang('Уведомления', localization),
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <NotificationItem
        type={item?.type}
        message={item?.message}
        date={item?.added_at}
        modelID={item?.data?.model_id}
        navigation={navigation}
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
  };

  const onRefresh = () => {
    if (page === 1) {
      fetchNotifications();
    } else {
      setPage(1);
    }
  };

  if (isFetching) {
    return <LoadingScreen />;
  }

  return (
    <UniversalView>
      <SafeAreaView>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          ListEmptyComponent={() => <Empty />}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.2}
          ItemSeparatorComponent={() => <Divider />}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={isFetching}
          initialNumToRender={20}
          ListFooterComponent={renderFooter}
        />
      </SafeAreaView>
    </UniversalView>
  );
};

const NotificationItem = ({ message, date, type, modelID, navigation }) => {
  const onPress = () => {
    switch (type) {
      case NOTIFICATION_TYPE.course:
        navigation.navigate(ROUTE_NAMES.myCourseDetail, { courseID: modelID });
        break;
      case NOTIFICATION_TYPE.buy:
        navigation.navigate(ROUTE_NAMES.myCourseDetail, { courseID: modelID });
        break;
      case NOTIFICATION_TYPE.news:
        navigation.navigate(ROUTE_NAMES.newsDetail, { newsId: modelID });
        break;
      case NOTIFICATION_TYPE.task:
        navigation.navigate(ROUTE_NAMES.moduleTask, { id: 19 });
        break;
      case NOTIFICATION_TYPE.test:
        navigation.navigate(ROUTE_NAMES.testResult, { id: modelID });
        break;
      case NOTIFICATION_TYPE.complete:
        navigation.navigate(ROUTE_NAMES.courseFinish, { id: modelID });
        break;
      default:
        break;
    }
  };

  const renderButton = ({ TDefaultRenderer, ...props }) => {
    return <Text style={notification.highlight}>{props.tnode?.data}</Text>;
  };

  let messageComponent = (
    <Text style={notification.message} numberOfLines={3}>
      {message}
    </Text>
  );

  if (containsHTML(message)) {
    messageComponent = (
      <HtmlView
        html={'<p>' + message + '</p>'}
        renderers={{ span: renderButton }}
        tagsStyles={{
          p: { ...setFontStyle(15, '500', APP_COLORS.font), marginTop: 0 },
        }}
      />
    );
  }

  return (
    <RowView style={notification.container}>
      <NotificationItemIcon type={type} />
      <TouchableOpacity
        style={notification.view}
        activeOpacity={0.7}
        onPress={onPress}>
        {messageComponent}
        <Text style={notification.date}>{date}</Text>
      </TouchableOpacity>
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
    alignItems: 'flex-start',
  },
  view: {
    flex: 1,
    marginLeft: 16,
  },
  message: {
    flex: 1,
    ...setFontStyle(15, '500'),
    marginBottom: 8,
  },
  highlight: {
    ...setFontStyle(15, '600', '#007AFF'),
  },
  date: {
    ...setFontStyle(13, '500', APP_COLORS.placeholder),
  },
});

export default NotificationsScreen;
