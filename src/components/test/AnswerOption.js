import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useMemo, useState } from 'react'
import { ColorApp } from '../../constans/constants'
import { check, x } from '../../assets/icons'
import { getAudioUrl, selectComponent, setFontStyle } from '../../utils/utils'
import AudioPlayer from '../AudioPlayer'
import MathView from './MathView'
import HtmlView from '../HtmlView'

const dynamicContainerStyle = (state, component) => {
  switch(state) {
    case "selected":
      return selectedStyles[component]
    case "unselected":
      return unselectedStyles[component]
    case "correct":
      return correctStyles[component]
    case "incorrect":
      return incorrectStyles[component]
    default:
      console.error("There is no state called " + state)
  }
}

const AnswerOption = ({selected, answer, is_multiple = false, onPress, onTrackChange, correct, extraStyle, extraTextStyle}) => {

  const [state, setState] = useState(correct === undefined ? selected ? "selected" : "unselected" : correct ? "correct" : "incorrect")

  const memoStylesContainer = useMemo(() => [styles.container, dynamicContainerStyle(state, "container"), extraStyle], [state])
  const memoStylesCheckbox = useMemo(() => [styles.checkbox, dynamicContainerStyle(state, "checkbox") , {
    borderRadius: is_multiple ? 50 : 4,
    padding: correct === false ? 7 : 6 
  }], [state])
  const memoStylesText = useMemo(() => [setFontStyle(), {}, extraTextStyle], [])


  return (
    <TouchableOpacity
      style={memoStylesContainer}
      onPress={() => setState(prev => prev === "selected" ? "unselected" : "selected")}
      activeOpacity={0.7}
      disabled={correct !== undefined ? true : false}
    >
      <View
        style={memoStylesCheckbox}
      >
        {
          correct === false
          ?
          x()
          :
          check()
        }
      </View>
      {
        selectComponent(answer, 
        <AudioPlayer 
          url={getAudioUrl(answer)} 
          _index={100} onTrackChange={onTrackChange} 
          style={styles.audioContainer} 
          sliderStyle={styles.slider}
          maximumTrackTintColor={"#FFFFFF"}
        />, 
        <MathView text={answer}/>, 
        <HtmlView html={answer}/>)
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    width: "100%",
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 5/4,
    marginBottom: 7
  },
  checkbox: {
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 5/4
  },
  audioContainer: {
    backgroundColor: "transparent"
  },
  slider: {
    width: 20
  }
})

const selectedStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F1F2FE",
    borderColor: "#F1F2FE"
  },
  checkbox: {
    backgroundColor: ColorApp.primary,
    borderColor: ColorApp.primary
  }
})

const unselectedStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F5F5F5"
  },
  checkbox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#ACB4BE"
  }
})

const correctStyles = StyleSheet.create({
  container: {
    backgroundColor: "#F0F6ED",
    borderColor: "#F0F6ED"
  },
  checkbox: {
    backgroundColor: "green",
    borderColor: "green"
  }
})

const incorrectStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFEFEE",
    borderColor: "#FFEFEE"
  },
  checkbox: {
    backgroundColor: "red",
    borderColor: "red"
  }
})

export default AnswerOption