import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ColorApp } from '../../constans/ColorApp'
import { check, x } from '../../assets/icons'
import { setFontStyle } from '../../utils/setFontStyle'

const AnswerOption = ({_selected, text, is_multiple, onPress, disabled, correct}) => {

  const [selected, setSelected] = useState(_selected)

  return (
    <TouchableOpacity
      style={[styles.container, { 
        borderColor: selected ? "#F1F2FE" : "#F5F5F5",
        backgroundColor: correct === undefined ? selected ? "#F1F2FE" : "#FFFFFF" : correct ? "#F0F6ED" : "#FFEFEE"
      }]}
      onPress={() => setSelected(!selected)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View
        style={[styles.checkbox, {
          backgroundColor: correct === undefined ? selected ? ColorApp.primary : "#FFFFFF" : correct ? "green" : "red",
          borderRadius: is_multiple ? 50 : 4,
          borderColor: selected ? ColorApp.primary : "#ACB4BE"
        }]}
      >
        {
          correct === false
          ?
          x()
          :
          check()
        }
      </View>
      <Text style={[setFontStyle(), {
        
      }]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 11,
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 5/4
  },
  checkbox: {
    padding: 6,
    paddingVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 5/4
  }
})

export default AnswerOption