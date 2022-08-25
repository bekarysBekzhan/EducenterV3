import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import FastImage from 'react-native-fast-image'
import { setFontStyle } from '../utils/utils'
import { APP_COLORS } from '../constans/constants'
import Price from './Price'
import ItemRating from './ItemRating'

const CourseRow = ({
    id,
    poster, 
    title, 
    category_name, 
    price, 
    old_price, 
    rating, 
    reviewCount, 
    onPress = () => undefined
}) => {
  return (
    <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(id)}
        activeOpacity={0.8}
    >
        <FastImage
            source={{uri: poster}}
            style={styles.poster}
        />
        <View
            style={styles.data}
        >
            <Text style={setFontStyle(11, "400", APP_COLORS.placeholder)}>{category_name}</Text>
            <Text style={setFontStyle(17, "600", APP_COLORS.font)} numberOfLines={1}>{title}</Text>
            <Price price={price} oldPrice={old_price} oldPriceStyle={styles.textOldPrice} priceStyle={styles.textPrice}/>
        </View>
        <ItemRating rating={rating} reviewCount={reviewCount} starSize={16 }/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    poster: {
        width: 62,
        height: 62,
        borderRadius: 10,
        marginRight: 8
    },
    data: {
        flex: 1,
        height: 62,
        flexDirection: 'column',
        justifyContent: "space-between",
        alignItems: 'flex-start',
    },
    textPrice: {
        fontSize: 13,
        fontWeight: "500",
    },
    textOldPrice: {
        fontSize: 13,
        fontWeight: "500",
    }
})

export default CourseRow