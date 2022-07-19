import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ColorApp } from '../../constans/ColorApp'
import { check } from '../../assets/icons'
import { setFontStyle } from '../../utils/setFontStyle'

const AnswerOption = ({_selected, text, is_multiple, onPress}) => {

  const [selected, setSelected] = useState(_selected)

  return (
    <TouchableOpacity
      style={[styles.container, { 
        borderColor: selected ? "#F1F2FE" : "#F5F5F5",
        backgroundColor: selected ? "#F1F2FE" : "#FFFFFF"
      }]}
      onPress={() => setSelected(!selected)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.checkbox, {
          backgroundColor: selected ? ColorApp.primary : "#FFFFFF",
          borderRadius: is_multiple ? 50 : 4,
          borderColor: selected ? ColorApp.primary : "#ACB4BE"
        }]}
      >
        {check()}
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