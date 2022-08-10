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

const SearchScreen = (props) => {
  return (
        <UniversalView>
            <SafeAreaView>
                <SearchBar {...props}/>
                <SectionView label={strings['История поиска']}/>
            </SafeAreaView>
        </UniversalView>
  )
}

const SearchBar = (props) => {

    
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
                <TouchableOpacity
                    style={styles.searchIcon}
                    activeOpacity={0.8}
                >
                    {search("#000")}
                </TouchableOpacity>}
                right={
                    <TouchableOpacity
                        activeOpacity={0.8}
                    >
                        {clear()}
                    </TouchableOpacity>
                }
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
        borderRadius: 16
    },
    input: [setFontStyle(15, "400"), {
        // marginLeft: 15
    }],
    searchIcon: {
        marginRight: 10
    }
})

export default SearchScreen