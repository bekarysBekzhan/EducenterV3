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
import { CourseService } from '../services/API'

const SearchScreen = (props) => {

    const [isEmpty, setIsEmpty] = useState(true)
    const [data, setData] = useState(null)
    const [page, setPage] = useState(1)

    const renderItem = ({item, index}) => {
        console.log(item)
        return(
            <CourseRow/>
        )
    }

    return (
            <UniversalView>
                <SafeAreaView>
                    <SearchBar {...props} setIsEmpty={setIsEmpty} setData={setData} page={page}/>
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

const SearchBar = ({ navigation, setIsEmpty, setData, page }) => {

    const [value, setValue] = useState("")

    const onChangeText = async(text) => {
        setValue(text)
        if (text === '') {
            setIsEmpty(true)
            setData(null)
        } else {
            setIsEmpty(false)
            const response = await CourseService.fetchCourses(text, page, price, categoryID)
            setData(response.data)
        }
    }

    const clearTapped = () => {
        setIsEmpty(true)
        setValue("")
    }
    
    return(
        <RowView
            style={styles.searchBar}
        >
            <TouchableOpacity
                onPress={() => navigation.goBack()}
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