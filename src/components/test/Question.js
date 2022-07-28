import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import AudioPlayer from '../AudioPlayer'
import MathView from './MathView'
import { selectComponent, setFontStyle } from '../../utils/utils'
import { ColorApp } from '../../constans/constants'
import HtmlView from '../HtmlView'
import { getAudioUrl } from '../../utils/regex'
import AnswerOption from './AnswerOption'

const DATA = [
  {
    id: 1,
    answer: "Пользователю легко с интерфейсом"
  },
  {
    id: 2,
    answer: "<div class=\"ckeditor-html5-audio\" style=\"text-align:center\">\r\n<audio controls=\"controls\" controlslist=\"nodownload\" src=\"https://demo.educenter.kz/storage/files/243573902162d8ffa8da5fa8.96197209_Audio - Steve Jobs - Stay Hung.mp3\">&nbsp;</audio>\r\n</div>\r\n\r\n<p>&nbsp;</p>",
  },
  {
    id: 3,
    answer: "<p><span class=\"math-tex\">\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)</span></p>"
  },
]

const selecteds = [false, true, false]

const Question = ({item, index, onTrackChange, is_multiple, extraStyle, extraTextStyle}) => {


  const memoStylesContainer = useMemo(() => [styles.container, extraStyle], [])
  const memoStylesText = useMemo(() => [setFontStyle(18, "400", ColorApp.primary), {}, extraTextStyle], [])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    console.log((index + 1) + " question")
  }, [])

  return (
    <View
      style={memoStylesContainer}
    >
      <Text style={memoStylesText}>{index+1} - вопрос</Text>
      {
        selectComponent(item?.question, 
          <AudioPlayer url={getAudioUrl(item.question)} _index={index} onTrackChange={onTrackChange}/>,
          <MathView text={item.question} mathStyle={{padding: 14}}/>,
          <HtmlView html={item.question} baseStyle={styles.baseStyle} tagsStyles={tagsStyles}/>
        )
      }
      {
        DATA.map((option, index) => (
          <AnswerOption
            key={index}
            selected={selecteds[index]}
            answer={option.answer}
            is_multiple={is_multiple}
            onTrackChange={onTrackChange}
          />
        ))
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 20
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