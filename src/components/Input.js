import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { useMemo } from 'react'
import { TextInputMask } from 'react-native-masked-text'
import { useEffect } from 'react'
import RowView from './view/RowView'
import { ColorApp } from '../constans/constants'
import { setFontStyle } from '../utils/utils'
import { useState } from 'react'

const Input = ({
    placeholder,
    mask,
    keyboardType='phone-pad',
    right,
    left,
    extraStyle,
    extraInputStyle,
    ...props
}) => {

    const [focus, setFocus] = useState(false)
    
    const memoStyles = useMemo(() => [styles.container, extraStyle, focus ? styles.focus : {}], [focus])
    const memoInputStyles = useMemo(() => [styles.input, extraInputStyle], [])

    useEffect(() => {
        console.log("Focus : " , focus)
    }, [focus])
    
    return (
        <RowView
            style={memoStyles}
        >
        {left}
        {
            mask === undefined
            ?
            <TextInput
                placeholderTextColor={ColorApp.placeholder}
                placeholder={placeholder}
                style={memoInputStyles}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                {...props}
            />
            :
            <TextInputMask
                placeholderTextColor={ColorApp.placeholder}
                placeholder={placeholder}
                style={memoInputStyles}
                type='custom'
                options={{ mask: mask }}
                keyboardType={keyboardType}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                {...props}
            />
        }
        {right}
        </RowView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: ColorApp.input,
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        paddingHorizontal: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: ColorApp.input
    },
    input: {
        flex: 1,
        ...setFontStyle(17)
    },
    focus: {
        borderWidth: 1,
        borderColor: ColorApp.primary,
    }
})

export default Input