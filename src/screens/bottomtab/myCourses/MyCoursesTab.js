import {View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import UniversalView from '../../../components/view/UniversalView';
import {useFetching} from '../../../hooks/useFetching';
import {MyCourseService} from '../../../services/API';
import {APP_COLORS, WIDTH} from '../../../constans/constants';
import LoadingScreen from '../../../components/LoadingScreen';
import FastImage from 'react-native-fast-image';
import RowView from '../../../components/view/RowView';
import * as Progress from "react-native-progress"
import { check, PlayIcon } from '../../../assets/icons';
import { strings } from '../../../localization';
import CourseRow from '../../../components/CourseRow';
import { setFontStyle } from '../../../utils/utils';
import { ROUTE_NAMES } from '../../../components/navigation/routes';

const MyCoursesTab = () => {

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [data, setData] = useState([]);
  const [loadingNext, setLoadingNext] = useState(false);

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
    if(page < lastPage && !isFetchingNext) {
      setLoadingNext(true)
      setPage(prev => prev + 1)
    }
  }

  const renderCourse = ({item, index}) => {
    return <MyCourseCard item={item} index={index}/>
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {isFetchingNext ? <ActivityIndicator color={APP_COLORS.primary} /> : null}
    </View>
  );

  if (isFetching) {
    return <LoadingScreen/>
  }

  return (
    <UniversalView>
      <FlatList
        data={data}
        renderItem={renderCourse}
        ListFooterComponent={renderFooter}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onEndReached={onEndReached}
        refreshing={isFetching}
        onRefresh={() => {
          if (page === 1) {
            fetchCourses();
          }
          setPage(1);
        }}
      />
    </UniversalView>
  );
};

const MyCourseCard = ({ item, index, navigation }) => {

  useEffect(() => {
    console.log("item : " , item)
  }, [])

  const navigationTapped = () => {
    navigation.navigate(ROUTE_NAMES)
  }

  return(
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
    >
      <FastImage 
        style={styles.poster}
        source={{ uri: item?.progress_information?.next_lesson?.preview }}
      >
        <View style={styles.posterOverlay}>
          <RowView style={styles.row1}>
            <Text style={styles.position}>{item?.progress_information?.next_lesson?.position} {strings.урок}</Text>
            <Progress.Circle
              size={40}
              progress={item?.progress_information?.number ? parseFloat(item.progress_information?.number) / 100 : 0}
              formatText={() => item.progress_information?.number ? item.progress_information.number : "0 %"}
              borderWidth={0}
              unfilledColor={"rgba(255,255,255,0.4)"}
              borderColor={null}
              color={"#fff"}
              showsText
              textStyle={setFontStyle(10, "500", "#fff")}
            />
          </RowView>
          <View>
            {
              item?.progress_information?.finished
              ?
              <RowView>
                <View style={styles.icon}>
                  {check()}
                </View>
                <Text style={styles.actionText}>{strings['Курс завершен']}</Text>
              </RowView>
              :
              <RowView>
                <View style={[styles.icon, { paddingLeft: 7 }]}>
                  <PlayIcon size={0.6}/>
                </View>
                <Text style={styles.actionText}>{strings['Продолжить урок']}</Text>
              </RowView>
            }
            <Text numberOfLines={2} style={styles.title}>{item?.progress_information?.next_lesson?.title}</Text>
            <Text numberOfLines={2} style={styles.description}>{item?.progress_information?.next_lesson?.description}</Text>
          </View>
        </View>
      </FastImage>
      <CourseRow
        title={item?.title}
        poster={item?.poster}
        category_name={item?.category_name}
        reviewCount={item?.reviews_count}
        rating={item?.reviews_stars}
        disabled={true}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16
  },
  card: {
    paddingVertical: 16,
    flex: 1,
    borderBottomWidth: 0.75,
    borderColor: APP_COLORS.border
  },
  poster: {
    flex: 1,
    borderRadius: 16,
    height: 220,
    marginBottom: 16
  },
  posterOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 16,
    justifyContent: "space-between"
  },
  position: {
    ...setFontStyle(16, "600", "white"),
    textTransform: "uppercase"
  },
  row1: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary
  },
  actionText: {
    ...setFontStyle(12, "500", "white"),
    marginLeft: 8
  },
  footer: {
    width: WIDTH - 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginVertical: 8,
    ...setFontStyle(18, "600", "white")
  },
  description: {
    ...setFontStyle(14, "500", "white")
  }
});

export default MyCoursesTab;
