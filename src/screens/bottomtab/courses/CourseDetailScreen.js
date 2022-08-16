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
            {time}
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

  useEffect(() => {
    console.log("item, " , item)
  }, [])

  return(
    <UniversalView>
      <TouchableOpacity
        onPress={() => setIsCollapsed(prev => !prev)}
        style={[styles.chapter, { backgroundColor: isCollapsed ? APP_COLORS.gray2 : "white" }]}
        activeOpacity={0.8}
      >
        <RowView>
          <View>
            <Text style={styles.chapterTitle}>{item?.title}</Text>
            <Text style={styles.counts}>{item?.lessons?.length} {strings.лекции}・{item?.files_count} {strings.файла}・{item?.tests_count} {strings.тест}</Text>
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
        </RowView>
        <Divider
          isAbsolute={false}
          style={{
            width: WIDTH - 32
          }}
        />
      </TouchableOpacity>
      <Collapsible 
        collapsed={isCollapsed}
        style={styles.collapsed}
      >
      {
          item?.lessons.map((lesson, i) => (
            <RowView
              key={i}
            >
              {
                lesson?.is_promo
                ?
                iconPlay()
                :
                lock()
              }
              <Text>{index + 1}.{i + 1} {lesson?.title}</Text>
              {time}
            </RowView>
          ))
      }
      </Collapsible>
    </UniversalView>
  )
}


const styles = StyleSheet.create({
  container: {

  },
  chapter: {
    padding: 8,
    paddingLeft: 16
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
  poster: {
    width: WIDTH,
    height: HEIGHT / 3.6,
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
    // padding: 16
  }
})

export default CourseDetailScreen