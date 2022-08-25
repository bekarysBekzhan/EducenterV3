import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import UniversalView from '../../../components/view/UniversalView'
import FastImage from 'react-native-fast-image'
import { WIDTH } from '../../../constans/constants'
import { strings } from '../../../localization'
import OutlineButton from '../../../components/button/OutlineButton'

const UnauthorizedScreen = (props) => {

    const loginTapped = () => {

    }

    const signupTapped = () => {

    }

    return (
        <UniversalView haveScroll style={styles.container}>
            <FastImage
                source={require("../../../assets/images/MyCoursePlaceHolder.png")}
                style={styles.placeholder}
            />
            <Text style={styles.title}>{strings['Ваши курсы']}</Text>
            <Text style={styles.tips}>{strings['Здесь будут ваши курсы, тесты и задания. Войдите или создайте аккаунт чтобы увидеть']}</Text>
            <OutlineButton
                text={strings.Войти}
                onPress={loginTapped}
            />
            <OutlineButton
                text={strings['Создать аккаунт']}
                style={styles.signup}
                onPress={signupTapped}
            />
        </UniversalView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    placeholder: {
        width: WIDTH,
        height: 250,
        marginBottom: 32
    },
    title: {

    },
    tips: {

    },
    signup: {
        
    }
})

export default UnauthorizedScreen