import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UniversalView from './view/UniversalView'
import RowView from './view/RowView'
import FastImage from 'react-native-fast-image'
import Divider from './Divider'
import { setFontStyle } from '../utils/utils'
import HtmlView from './HtmlView'
import { APP_COLORS } from '../constants/constants'
import { WIDTH } from '../constants/constants'
import { HEIGHT } from '../constants/constants'

const Person = ({
    status,
    image,
    name,
    description,
    extraStyles
}) => {

    const getInitials = (name) => {
        if (!name || typeof name !== 'string') {
            return '';
        }

        const words = name.trim().split(' ');

        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }

        const initials = words.map((word) => word[0].toUpperCase());

        return initials.join('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.classicView}>
                <Text style={styles.statusText}>{status}</Text>
                <View style={styles.authorContainer}>
                    {image ? (
                        <FastImage
                            source={{ uri: image, priority: 'high' }}
                            style={styles.image}
                        />
                    ) : (
                        <View style={styles.initialsImage}>
                            <Text style={styles.initialsImageText}>{getInitials(name)}</Text>
                        </View>
                    )}
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorInfoText}>{name}</Text>
                    </View>
                </View>
            </View>

            {description ? (
                <View style={styles.classicView}>
                    <Text style={styles.descriptionTitle}>ОПИСАНИЕ</Text>
                    <Text style={styles.descriptionText}>{description}</Text>
                </View>
            ) : (
                <View />
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 0,
        alignItems: 'center',
    },
    classicView: {
        width: '100%',
        height: 105,
        borderRadius: 16,
        backgroundColor: APP_COLORS.white,
        padding: 16,
        marginBottom: 16,

        shadowOpacity: 0.1,
        shadowRadius: 92,
        shadowColor: '#000153',
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    statusText: {
        ...setFontStyle(12, '400', APP_COLORS.darkgray),
        textTransform: 'uppercase',
        textAlign: 'left',
        letterSpacing: 0.4,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
    },
    image: {
        width: 50,
        height: 50,
    },
    initialsImage: {
        width: 50,
        height: 50,
        backgroundColor: '#FF6B00',
    },
    initialsImageText: {
        ...setFontStyle(16, '600', APP_COLORS.white),
        letterSpacing: 0.4,
        textAlign: 'center',
    },
    authorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    authorInfoText: {
        ...setFontStyle(16, '600', APP_COLORS.black),
        letterSpacing: 0.4,
        textAlign: 'left',
    },
    descriptionTitle: {
        ...setFontStyle(12, '400', APP_COLORS.darkgray),
        textTransform: 'uppercase',
        textAlign: 'left',
        letterSpacing: 0.4,
    },
    descriptionText: {
        ...setFontStyle(16, '600', APP_COLORS.black),
        letterSpacing: 0.4,
        textAlign: 'left',
    }

})

export default Person

