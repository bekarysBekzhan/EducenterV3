import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native'
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
import { time } from '../../../assets/icons'
import { strings } from '../../../localization'
import ItemRating from '../../../components/ItemRating'
import HtmlView from '../../../components/HtmlView'
import OutlineButton from '../../../components/button/OutlineButton'

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
      <CourseChapter item={item} index={index}/>
    )
  }

  const renderFooter = () => {
    return(
      <UniversalView>

      </UniversalView>
    )
  }

  return (
    <UniversalView>
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
              <OutlineButton
                text={strings.Подробнее}
                onPress={() => setDescriptionMore(true)}
              />
              :
              null
            }
        </UniversalView>
      </UniversalView>
  )
}

const CourseChapter = ({ item, index }) => {
  return(
    <UniversalView
      style={styles.chapter}
    >

    </UniversalView>
  )
}


const styles = StyleSheet.create({
  chapter: {

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
    ...setFontStyle(17, "800"),
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
})

export default CourseDetailScreen