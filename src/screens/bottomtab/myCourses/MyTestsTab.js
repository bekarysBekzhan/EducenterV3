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
import {check, down, PlayIcon, TimeIcon, up} from '../../../assets/icons';
import RowView from '../../../components/view/RowView';
import {getCurrentTimeString, getTimeString, setFontStyle, wordLocalization} from '../../../utils/utils';
import {strings} from '../../../localization';
import TextButton from '../../../components/button/TextButton';
import Divider from '../../../components/Divider';
import Collapsible from 'react-native-collapsible';
import { useSettings } from '../../../components/context/Provider';

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

  const testItemTapped = id => {
    props.navigation.navigate(ROUTE_NAMES.myTestDetail, {id});
  };

  const renderTest = ({item, index}) => {
    return (
      <ModuleMyTestItem
        id={item?.id}
        index={index}
        title={item?.title}
        attempts={item?.attempts}
        attemptHistory={item?.all_passings}
        certificate={item?.user_certificate}
        onPress={testItemTapped}
        finished={item?.passing_user?.finished}
      />
    );
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
  };

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
  title,
  attempts,
  finished = false,
  certificate,
  attemptHistory,
  onPress = () => undefined,
}) => {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const { settings } = useSettings()

  useEffect(() => {
    console.log("attempts : " , attempts)
    console.log("used attempts : " , usedAttempts())
  }, [])

  const usedAttempts = () => {
    return attemptHistory?.filter(item => item?.finished).length - 1;
  };

  const onDownload = () => {};

  const renderItem = ({ item, index }) => {

    if (!item) {
      return(
        <RowView style={testItem.attemptRow}>

        </RowView>
      )
    }

    return (
      <TouchableOpacity
        style={[testItem.attempt, {
          borderTopWidth: index ? 0.35 : 0,
        }]}
        onPress={() => undefined}
        activeOpacity={0.88}
      >
        <RowView style={[ testItem.attemptRow, { marginBottom: 10 } ]}>
          <RowView>
            <View style={[ testItem.icon, { backgroundColor: APP_COLORS.input } ]}>
              <PlayIcon size={0.6} color={APP_COLORS.primary}/>
            </View>
            <Text style={testItem.attemptText}>{ item?.finished ? strings.Попытка + " " + item?.attempts : strings.Пройти + ". " + strings.Попытка + " " + item?.attempts}</Text>
          </RowView>
          <RowView>
            <TimeIcon color={APP_COLORS.placeholder}/>
            <Text style={testItem.time}>{getTimeString(item?.time_score)}</Text>
          </RowView>
        </RowView>
        <Text style={testItem.time}>{strings.БАЛЛ} {item?.percent}%・{wordLocalization(strings[':num из :count'], { num: item?.score, count: item?.tests_count })}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={testItem.container}>
      <Text style={testItem.title}>{title}</Text>
      <Text style={testItem.attempts}>
        {wordLocalization(strings['Пройдено: :num1 из :num2 тестов'], {
          num1: usedAttempts(),
          num2: attempts,
        })}
      </Text>
      {certificate && settings?.modules_enabled_certificates ?  (
        <TextButton
          onPress={onDownload}
          style={testItem.button}
          textStyle={testItem.buttonText}
          text={strings['Скачать сертификат']}
        />
      ) : null}
      <Divider isAbsolute={false} style={testItem.divider}/>
      <RowView style={testItem.row}>
        <RowView style={testItem.row1}>
          {
            finished ?
            <View style={[testItem.icon, { backgroundColor: "green", paddingHorizontal: 5 }]}>
              {check()}
            </View> :
            <View style={testItem.icon}>
              <PlayIcon size={0.6} />
            </View>
          }
          {
            finished ? 
            <TextButton
              onPress={() => undefined}
              style={testItem.button}
              text={strings['Тест пройден']}
              textStyle={[testItem.buttonText, { color: "green" }]}
            /> :
            <TextButton
              onPress={() => onPress(id)}
              style={testItem.button}
              textStyle={[testItem.buttonText]}
              text={strings['Пройти тест']}
            />
          }
        </RowView>
        <TouchableOpacity onPress={() => setIsCollapsed(prev => !prev)} activeOpacity={0.7}>
          <RowView style={testItem.row2}>
            <Text style={testItem.attemptsLeft}>{wordLocalization(strings['Осталось :attempts попытки'], {attempts: attempts - usedAttempts()})}</Text>
            <View>{isCollapsed ? down : up}</View>
          </RowView>
        </TouchableOpacity>
      </RowView>
      <Collapsible collapsed={isCollapsed}>
        <FlatList
          data={attemptHistory.concat(Array(attempts - usedAttempts()).fill(false))}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </Collapsible>
    </View>
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

const testItem = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 0.45,
    borderColor: APP_COLORS.border,
  },
  row: {
    justifyContent: "space-between"
  },
  row1: {
    alignItems: "center",
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
    alignItems: "center"
  },
  button: {
    marginTop: 0
  },
  buttonText: {
    ...setFontStyle(14, '600', APP_COLORS.primary),
    textTransform: 'uppercase',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    paddingHorizontal: 7,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    marginRight: 6
  },
  divider: {
    marginVertical: 8
  },
  attemptsLeft: {
    ...setFontStyle(13, "500", APP_COLORS.primary),
    marginRight: 6
  },
  attempt: {
    flex: 1,
    paddingVertical: 12,
    borderColor: APP_COLORS.border
  },
  attemptText: {
    ...setFontStyle(13, "500"),
  },
  attemptRow: {
    justifyContent: "space-between",

  }
});

export default MyTestsTab;
