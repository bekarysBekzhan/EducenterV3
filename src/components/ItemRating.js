import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { starIcon } from '../assets/icons'
import { setFontStyle } from '../utils/setFontStyle'

const ItemRating = ({rating, reviewCount, starSize}) => {
  return (
    <View style={styles.container}>
        {starIcon(starSize)}
        <View style={{width: 2.5, height: 1}}/>
        <Text style={[setFontStyle(10, "400"), {marginRight: 2.5}]}>{rating}</Text>
        <Text style={[setFontStyle(10, "400", "#111621"), {}]}>({reviewCount})</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },

})

export default ItemRating