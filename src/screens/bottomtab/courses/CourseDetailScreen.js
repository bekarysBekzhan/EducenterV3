import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import UniversalView from '../../../components/view/UniversalView'
import { useFetching } from '../../../hooks/useFetching'
import { CourseService } from '../../../services/API'
import { useState } from 'react'
import { useEffect } from 'react'
import { APP_COLORS, HEIGHT, WIDTH } from '../../../constans/constants'
import FastImage from 'react-native-fast-image'
import { setFontStyle } from '../../../utils/utils'
import RowView from '../../../components/view/RowView'
import { iconPlay, lock, time } from '../../../assets/icons'
import { strings } from '../../../localization'
import ItemRating from '../../../components/ItemRating'
import HtmlView from '../../../components/HtmlView'
import TextButton from '../../../components/button/TextButton'
import Divider from '../../../components/Divider'
import { Collapse } from "accordion-collapse-react-native"
import Collapsible from 'react-native-collapsible'
import { useSettings } from '../../../components/context/Provider'


const CourseDetailScreen = (props) => {

  const courseID = props.route?.params?.courseID

  const [data, setData] = useState(null)
  const [fetchCourse, isLoading, courseError] = useFetching(async() => {
    const response = await CourseService.fetchCourseByID(courseID)
    setData(response.data?.data)
  })
  
  useEffect(() => {
    fetchCourse()
  }, [])

  const renderHeader = () => {
    return(
      <CourseListHeader data={data}/>
    )
  }

  const renderChapter = ({ item, index }) => {
    return(
      <CourseChapter item={item} index={index} hasSubscribed={data?.has_subscribed}/>
    )
  }

  const renderFooter = () => {
    return(
      <UniversalView>

      </UniversalView>
    )
  }

  return (
    <UniversalView
      style={styles.container}
    >
      {
        isLoading
        ?
        <ActivityIndicator color={APP_COLORS.primary} style={{ marginTop: 120}}/>
        :
        <FlatList
          data={data?.chapters}
          ListHeaderComponent={renderHeader}
          renderItem={renderChapter}
          ListFooterComponent={renderFooter}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      }
    </UniversalView>
  )
}

const CourseListHeader = ({ data }) => {


  const [isDescriptionMore, setDescriptionMore] = useState(false)

  return (
    <UniversalView>
        <FastImage
          source={{ uri: data?.poster, priority: "high" }}
          style={styles.poster}
        />
        <UniversalView
          style={{
            padding: 16
          }}
        >
          <Text style={styles.category}>{data?.category?.name}</Text>
          <Text style={styles.title}>{data?.title}</Text>
          <RowView>
            {time()}
            <Text style={styles.time}>{data?.time + " " +  strings.мин}.</Text>
            <ItemRating
              rating={data?.rating}
              reviewCount={data?.reviews_count}
              starSize={16}
            />
          </RowView>
          <UniversalView
            style={isDescriptionMore ? styles.descriptionViewShow : styles.descriptionViewHidden}
          >
            {
              data?.description
              ?
              <HtmlView
                html={data?.description}
              />
              :
              null
            }
          </UniversalView>
          {
              data?.description && !isDescriptionMore
              ?
              <TextButton
                text={strings.Подробнее}
                style={styles.moreButton}
                textStyle={styles.moreButtonText}
                onPress={() => setDescriptionMore(true)}
              />
              :
              null
          }
          <Divider isAbsolute={false}/>
          <Text style={styles.courseProgram}>{strings['Программа курса']}</Text>
        </UniversalView>
      </UniversalView>
  )
}

const CourseChapter = ({ item, index, hasSubscribed }) => {

  const [isCollapsed, setIsCollapsed] = useState(true)
  const { settings } = useSettings()

  useEffect(() => {
    console.log("item, " , item)
  }, [])

  return(
    <View>
      <TouchableOpacity
        onPress={() => setIsCollapsed(prev => !prev)}
        style={[styles.chapter, { backgroundColor: isCollapsed ? APP_COLORS.gray2 : "white" }]}
        activeOpacity={0.8}
      >
          <View
            style={styles.chapterInfo}
          >
            <Text style={styles.chapterTitle}>{item?.title}</Text>
            <Text style={styles.counts}>{item?.lessons?.length} {strings.лекции}・{item?.files_count} {strings.файла}・{item?.tests_count} {strings.тест}</Text>
            <View
              style={styles.courseStatus}
            >
            {
              !hasSubscribed
              ?
              <RowView>
                {lock()}
                <Text style={styles.subscribeToCourseText}>{strings['Купите курс чтобы смотреть']}</Text>
              </RowView>
              :
              item?.lessons.filter((lesson) => lesson?.is_promo).length > 0
              ?
              iconPlay()
              :
              lock()
            }
            </View>
          </View>
          <FastImage
            source={{ uri: item?.lessons?.length > 0 ? item?.lessons[0]?.preview : settings?.logo }}
            style={styles.chapterPoster}
          >
            <View style={styles.posterOpacity}>
              <View style={styles.chapterPlay}>
                {iconPlay(0.9, APP_COLORS.primary)}
              </View>
            </View>
          </FastImage>
      </TouchableOpacity>
      <Divider
          isAbsolute={false}
          style={{
            width: WIDTH - 32
          }}
        />
      <Collapsible 
        collapsed={isCollapsed}
        style={styles.collapsed}
      >
      {
          item?.lessons.map((lesson, i) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => undefined}
              key={i}
            >
              <RowView style={styles.lesson}>
                <RowView style={styles.lessonRow1}>
                  <View style={styles.lessonIcon}>
                    {
                      lesson?.is_promo
                      ?
                      <View style={styles.lessonPlay}>
                        {iconPlay(0.85)}
                      </View>
                      :
                      lock()
                    }
                  </View>
                  <Text style={lesson?.is_promo ? styles.lessonTitle : styles.lessonLockedTitle} numberOfLines={3}>{index + 1}.{i + 1} {lesson?.title}</Text>
                </RowView>
                <RowView>
                  {time(undefined, APP_COLORS.placeholder)}
                  <Text style={styles.lessonTime}>{lesson?.time < 10 ? "0" + lesson?.time : lesson?.time}:00</Text>
                </RowView>
              </RowView>
            </TouchableOpacity>
          ))
      }
      </Collapsible>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {

  },
  chapter: {
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },  
  chapterInfo: {
  },
  chapterPoster: {
    width: 62,
    height: 62,
    borderRadius: 8,
  },
  chapterTitle: {
    ...setFontStyle(16, "600"),
    marginBottom: 7
  },
  counts: {
    ...setFontStyle(13, "400", APP_COLORS.placeholder),
    marginBottom: 8
  },
  subscribeToCourseText: {
    ...setFontStyle(14, "400", APP_COLORS.placeholder),
    marginLeft: 6,
  },
  courseStatus: {
    marginBottom: 10
  },
  poster: {
    width: WIDTH,
    height: HEIGHT / 3.6,
  },
  posterOpacity: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    justifyContent: "center",
    alignItems: 'center'
  },
  chapterPlay: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: "center"
  },
  category: {
    textTransform: "uppercase",
    ...setFontStyle(14, "700", APP_COLORS.placeholder)
  },
  title: {
    ...setFontStyle(21, "700"),
    marginVertical: 8
  },
  time: {
    marginHorizontal: 4,
    ...setFontStyle(15, "400", APP_COLORS.primary)
  },
  descriptionViewHidden: {
    overflow: 'hidden',
    maxHeight: 120
  },
  descriptionViewShow: {
      overflow: 'hidden',
      maxHeight: null
  },
  moreButton: {
    alignSelf: "flex-start",
    marginVertical: 10
  },
  moreButtonText: {
    ...setFontStyle(15, "500", APP_COLORS.primary),
    textTransform: "uppercase",
  },
  courseProgram: {
    marginTop: 24,
    ...setFontStyle(21, "700")
  },
  collapsed: {
    padding: 0
  },
  lesson: {
    flex: 1,
    marginHorizontal: 6,
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
    marginVertical: 2,
    borderRadius: 8,
  },
  lessonRow1: {
    flex: 1,
    paddingRight: 40,
  },
  lessonIcon: {
    marginRight: 9
  },
  lessonPlay: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: APP_COLORS.primary,
    justifyContent: 'center',
    alignItems: "center",
  },
  lessonTitle: {
    ...setFontStyle(12, "500"),
  },
  lessonLockedTitle: {
    ...setFontStyle(12, "400", APP_COLORS.placeholder)
  },
  lessonTime: {
    ...setFontStyle(11, "400", APP_COLORS.placeholder),

  }
})

export default CourseDetailScreen