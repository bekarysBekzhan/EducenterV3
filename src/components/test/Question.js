import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import AudioPlayer from '../AudioPlayer'
import MathView from './MathView'
import { setFontStyle } from '../../utils/utils'
import { ColorApp } from '../../constans/ColorApp'
import HtmlView from '../HtmlView'
import { getAudioUrl } from '../../utils/regex'
import SimpleButton from '../button/SimpleButton'
import TrackPlayer from 'react-native-track-player'

const Question = ({item, index, children}) => {

  useEffect(() => {
    console.log('item : ' , item)
  }, [])

  return (
    <View
      style={styles.container}
    >
      <Text style={[setFontStyle(18, "400", ColorApp.primary)]}>{index+1} - вопрос</Text>
      {
        item?.question.includes("audio")
        ?
        <AudioPlayer url={getAudioUrl(item.question)}/>
        :
        item?.question.includes("math-text")
        ?
        <MathView text={item.question}/>
        :
        item?.question
        ?
        <HtmlView html={item.question} baseStyle={styles.baseStyle} tagsStyles={tagsStyles}/>
        :
        null
      }
      {
        children
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  baseStyle: {

  },
  
})

const tagsStyles = {
  div: {

  },
  p: {

  },
  span: {

  },
  image: {

  },
  iframe: {

  }
}

export default Question