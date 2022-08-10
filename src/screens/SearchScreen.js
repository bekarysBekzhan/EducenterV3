import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import UniversalView from "../components/view/UniversalView"
import RowView from "../components/view/RowView"
import { clear, filter, search, x } from '../assets/icons'
import Input from '../components/Input'
import { strings } from '../localization'
import { APP_COLORS, WIDTH } from '../constans/constants'
import { setFontStyle } from '../utils/utils'
import SectionView from '../components/view/SectionView'
import { useState } from 'react'
import { useEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import CourseRow from '../components/CourseRow'

const SearchScreen = (props) => {

    const [isEmpty, setIsEmpty] = useState(true)
    const [data, setData] = useState(null)


    const renderItem = () => {
        return(
            <CourseRow/>
        )
    }

    return (
            <UniversalView>
                <SafeAreaView>
                    <SearchBar {...props} setIsEmpty={setIsEmpty}/>
                    <SectionView label={isEmpty ? strings['История поиска'] : strings.Курсы}/>
                    {
                        data !== null
                        ?
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(_, index) => index.toString()}
                        />
                        :
                        data
                    }
                </SafeAreaView>
            </UniversalView>
    )
}

const SearchBar = (props) => {

    const [value, setValue] = useState("")

    const onChangeText = (text) => {
        if (text === '') {
            props.setIsEmpty(true)
        } else {
            props.setIsEmpty(false)
        }
        setValue(text)
    }

    const clearTapped = () => {
        props.setIsEmpty(true)
        setValue("")
    }
    
    return(
        <RowView
            style={styles.searchBar}
        >
            <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                activeOpacity={0.8}
            >
                {x(16, APP_COLORS.placeholder)}
            </TouchableOpacity>
            <Input
                _focus={true}
                placeholder={strings['Поиск курсов и тестов']}
                left={
                <View
                    style={styles.searchIcon}
                >
                    {search("#000")}
                </View>}
                right={
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={clearTapped}
                    >
                        {clear()}
                    </TouchableOpacity>
                }
                value={value}
                onChangeText={onChangeText}
                extraStyle={styles.inputContainer}
                extraInputStyle={styles.input}
            />
            <TouchableOpacity
                activeOpacity={0.8}
            >
                {filter}
            </TouchableOpacity>
        </RowView>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        width: WIDTH,
        justifyContent: 'space-between',
        padding: 16,
        paddingBottom: 6
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 10,
        borderWidth: 0,
        padding: 14,
        paddingVertical: 12,
        borderRadius: 16,
        marginHorizontal: 16
    },
    input: [setFontStyle(15, "400"), {

    }],
    searchIcon: {
        marginRight: 10
    }
})

export default SearchScreen