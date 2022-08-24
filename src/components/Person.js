import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UniversalView from './view/UniversalView'
import RowView from './view/RowView'
import FastImage from 'react-native-fast-image'
import Divider from './Divider'
import { setFontStyle } from '../utils/utils'
import HtmlView from './HtmlView'

const Person = ({
    status,
    image,
    name,
    description
}) => {
  return (
    <UniversalView>
        <Text style={styles.status}>{status}</Text>
        <RowView style={styles.row}>
            <FastImage source={{ uri: image }} style={styles.image}/>
            <View style={styles.column}>
                <Text style={styles.name}>{name}</Text>
                <HtmlView
                    html={description}
                />
                {
                    description
                    ?
                    <Divider
                        isAbsolute={true}
                    />
                    :
                    null
                }
            </View>
        </RowView>
    </UniversalView>
  )
}

const styles = StyleSheet.create({
    status: {
        ...setFontStyle(21, "700"),
        marginBottom: 14
    },
    row: {
        alignItems: "flex-start"
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 100,
        marginRight: 14
    },
    column: {
        alignItems: "flex-start",
        flex: 1
    },
    name: {
        ...setFontStyle(18, "600"),
    },
})

export default Person