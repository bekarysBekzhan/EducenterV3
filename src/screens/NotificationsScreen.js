import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import UniversalView from '../components/view/UniversalView';
import {strings} from '../localization';
import {useFetching} from '../hooks/useFetching';
import LoadingScreen from '../components/LoadingScreen';
import {NotificationService} from '../services/API';
import RowView from '../components/view/RowView';
import {NotificationItemIcon} from '../assets/icons';
import {containsHTML, getHTML, setFontStyle} from '../utils/utils';
import {APP_COLORS, NOTIFICATION_TYPE} from '../constans/constants';
import Loader from '../components/Loader';
import Divider from '../components/Divider';
import Empty from '../components/Empty';
import HtmlView from '../components/HtmlView';
import {ROUTE_NAMES} from '../components/navigation/routes';

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
    setNotifications(prev =>
      prev.concat(response.data?.data?.notifications?.data),
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
      title: strings.Уведомления,
    });
  }, []);

  const renderItem = ({item, index}) => {
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
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <Divider />}
        onEndReached={onEndReached}
        onRefresh={onRefresh}
        refreshing={isFetching}
        initialNumToRender={20}
        ListFooterComponent={renderFooter}
      />
    </UniversalView>
  );
};

const NotificationItem = ({message, date, type, modelID, navigation}) => {
  const onPress = () => {
    switch (type) {
      case NOTIFICATION_TYPE.course:
        navigation.navigate(ROUTE_NAMES.myCourseDetail, {courseID: modelID});
        break;
      case NOTIFICATION_TYPE.news:
        navigation.navigate(ROUTE_NAMES.newsDetail, {newsId: modelID});
        break;
      case NOTIFICATION_TYPE.task:
        navigation.navigate(ROUTE_NAMES.moduleTask, {id: modelID});
        break;
      case NOTIFICATION_TYPE.test:
        navigation.navigate(ROUTE_NAMES.testPreview, {id: modelID});
        break;
      default:
        break;
    }
  };

  const renderButton = ({TDefaultRenderer, ...props}) => {
    return (
      <Text style={notification.highlight} onPress={onPress}>
        {props.tnode?.data}
      </Text>
    );
  };

  let messageComponent = (
    <Text style={notification.message} numberOfLines={3}>
      {message}
    </Text>
  );

  if (containsHTML(message)) {
    messageComponent = (
      <HtmlView html={"<p>" + message + "</p>"} renderers={{span: renderButton}} tagsStyles={{ p: {...setFontStyle(15, '500', APP_COLORS.font), marginTop: 0} }}/>
    );
  }

  return (
    <RowView style={notification.container}>
      <NotificationItemIcon type={type} />
      <View style={notification.view}>
        {messageComponent}
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
