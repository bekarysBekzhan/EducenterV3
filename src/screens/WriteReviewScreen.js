import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Alert, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useFetching } from '../hooks/useFetching'
import { CourseService } from '../services/API'
import Overlay from '../components/view/Overlay'
import { strings } from '../localization'
import SimpleButton from '../components/button/SimpleButton'
import { setFontStyle } from '../utils/utils'
import RatingStar from '../components/RatingStar'

const WriteReviewScreen = (props) => {

  const id = props.route?.params?.id

  const [rateCourse, isSending, requestError] = useFetching(async() => {
    const response = await CourseService.rateCourse(id, text, rating)
    alertSuccessful()
  })

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: strings['Оставить отзыв']
    })
  }, [])

  useEffect(() => {
    if (requestError) {
      console.log(requestError)
    }
  }, [requestError])

  useEffect(() => {
    console.log("Current rating : " , rating)
  }, [rating])

  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")

  const onChangeText = (value) => {
    setText(value)
  }

  const onAlertButton = () => {

  }

  const alertSuccessful = () => {
    Alert.alert(
      strings['Спасибо!'],
      strings['Ваш отзыв принят!'],
      [
        {
          text: "OK",
          onPress: onAlertButton
        }
      ]
    )
  } 

  return (
    <KeyboardAvoidingView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
            <RatingStar
              halfStarEnabled={false}
              starSize={54}
              rating={rating}
              selectedStar={setRating}
            />
            <TextInput
              value={text}
              autoFocus
              onChangeText={onChangeText}
              style={styles.input}
              multiline
            />
            <View style={styles.spacer}/>
            <SimpleButton
              text={strings['Оставить отзыв']}
              onPress={rateCourse}
            />
        </ScrollView>
        <Overlay visible={isSending}/>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      padding: 16
    },
    scrollView:{
      flex: 1,
      paddingBottom: 16
    },
    input: {
      flex: 1,
      marginTop: 16,
      height: 200,
      ...setFontStyle(20, "400", undefined, 25),
    },
    spacer: {
      flex: 1,
    }
})

export default WriteReviewScreen