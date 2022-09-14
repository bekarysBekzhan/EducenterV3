import React, { useEffect, useState } from 'react'
import UniversalView from '../../components/view/UniversalView'
import { useFetching } from '../../hooks/useFetching'
import { UBT } from '../../services/API'
import LoadingScreen from '../../components/LoadingScreen'
import { FlatList, StyleSheet, View, Text } from 'react-native'
import Empty from '../../components/Empty'
import { strings } from '../../localization'
import { Select } from '@mobile-reality/react-native-select-pro';
import { setFontStyle } from '../../utils/utils'
import { APP_COLORS, HEIGHT, WIDTH } from '../../constans/constants'
import ModuleTestItem from '../../components/test/ModuleTestItem'
import SimpleButton from '../../components/button/SimpleButton'

const SelectSubjectsScreen = (props) => {

    console.log("render")

    const [dataSource, setDataSource] = useState({
        category: null,
        category2: null,
        categories: [],
        categories2: [],
        tests: [],
    })

    const [fetchCategories, isFetchingCategories, fetchingCategoriesError] = useFetching(async() => {
        const response = await UBT.fetchCategories()
        setDataSource(prev => ({
            ...prev,
            categories: response.data?.data
        }))
    })

    const [fetchTests, isFetchingTests, fetchingTestsError] = useFetching(async() => {
       const response = await UBT.fetchTests(dataSource.category?.value, dataSource.category2?.value)
       if (dataSource.category2) {
            setDataSource(prev => ({
                ...prev,
                tests: response.data?.data
            }))
       } else {
            setDataSource(prev => ({
                ...prev,
                categories2: response.data?.data.filter(item => item?.category_id !== item?.category_id2)
            }))
       }
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (fetchingTestsError) {
            console.log(fetchingTestsError)
        }
    }, [fetchingTestsError])

    useEffect(() => {
        if (fetchingCategoriesError) {
            console.log(fetchingCategoriesError)
        }
    }, [fetchingCategoriesError])

    useEffect(() => {
        if (dataSource.category) {
            fetchTests()
        }
    }, [dataSource.category])

    const getCategories2 = () => {

        if (dataSource.category === null) {
            return []
        }

        let subjects = {}

        dataSource.categories2.forEach(element => {
            if (dataSource.category.value === element?.category_id) {
                subjects[element?.category_id2] = true
            } else {
                subjects[element?.category_id] = true
            }
        });

        let result = []

        dataSource.categories.forEach(element => {
            if (subjects.hasOwnProperty(element.id)) {
                result.push({ value: element.id, label: element.name })
            }
        });

        return result
    }

    const onFirstSelect = (option, optionIndex) => {
        
        if (dataSource.category === option) {
            return
        }

        setDataSource(prev => ({
            ...prev,
            category: option,
            category2: null
        }))
    }

    const onFirstRemove = () => {
        setDataSource(prev => ({
            ...prev,
            category: null,
            category2: null,
            categories2: []
        }))
    }

    const onSecondSelect = (option, optionIndex) => {
        setDataSource(prev => ({
            ...prev,
            category2: option
        }))
    }

    const onSecondRemove = () => {
        setDataSource(prev => ({
            ...prev,
            category2: null
        }))
    }

    const testItemTapped = (id) => {
        console.log("test ", id)
    }

    const renderHeader = () => {
        
        return (
            <View>
                <Text>{strings['Выберите вопросы первого и второго урока чтобы начать тест']}</Text>
                <Select
                    options={dataSource.categories.map((item, _) => ({ value: item?.id, label: item?.name }))}
                    placeholderText={strings['Выберите первый урок']}
                    placeholderTextColor={APP_COLORS.placeholder}
                    selectContainerStyle={styles.selectContainer}
                    optionTextStyle={styles.optionText}
                    selectControlTextStyle={styles.optionText}
                    optionsListStyle={styles.optionList}
                    selectControlStyle={styles.select}
                    optionStyle={styles.option}
                    optionSelectedStyle={styles.selectedOption}
                    noOptionsText={strings['Нет данных']}
                    onSelect={onFirstSelect}
                    onRemove={onFirstRemove}
                    defaultOption={dataSource.category}
                />
                <Select
                    options={getCategories2()}
                    placeholderText={strings['Выберите второй урок']}
                    placeholderTextColor={APP_COLORS.placeholder}
                    selectContainerStyle={styles.selectContainer}
                    optionTextStyle={styles.optionText}
                    selectControlTextStyle={styles.optionText}
                    optionsListStyle={styles.optionList}
                    selectControlStyle={styles.select}
                    optionStyle={styles.option}
                    optionSelectedStyle={styles.selectedOption}
                    noOptionsText={strings['Нет данных']}
                    onSelect={onSecondSelect}
                    onRemove={onSecondRemove}
                    defaultOption={dataSource.category2}
                />
                <SimpleButton
                    text={strings.Выбрать}
                    onPress={fetchTests}
                    style={{ marginTop: 20 }}
                />
            </View>
        )
    }

    const renderItem = ({item, index}) => {
        return (
            <ModuleTestItem  
                id={item?.id}
                index={index}
                categoryName={item?.category?.name}
                time={item?.timer}
                title={item?.title}
                attempts={item?.attempts}
                price={item?.price}
                oldPrice={item?.old_price}
                onPress={testItemTapped}
                hasSubscribed={item?.has_subscribed}
            />
        )
    }

    const renderFooter = () => {
        return (
            <View/>
        )
    }

    if (isFetchingCategories) {
        return <LoadingScreen/>
    }
    return (
        <UniversalView style={styles.container}>
            <FlatList
                data={dataSource.tests}
                ListHeaderComponent={renderHeader}
                renderItem={renderItem}
                ListEmptyComponent={() => <Empty/>}
                ListFooterComponent={renderFooter}
                keyExtractor={(_, index) => index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </UniversalView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    selectContainer: {
        paddingTop: 10,
    },
    select: {
        backgroundColor: APP_COLORS.input,
        borderWidth: 0,
        height: 48
    },
    optionList: {
        borderWidth: 0,
        maxHeight: HEIGHT / 3,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowColor: "#000",
        shadowRadius: 20,
        shadowOpacity: 0.09,
        elevation:1
    },
    option: {
        height: 45
    },
    selectedOption: {
        backgroundColor: APP_COLORS.primary,
        color: "white"
    },
    optionText: {
        ...setFontStyle(17, "400")
    }
})

export default SelectSubjectsScreen