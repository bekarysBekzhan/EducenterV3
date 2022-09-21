import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import UniversalView from '../../components/view/UniversalView'
import { setFontStyle, wordLocalization } from '../../utils/utils';
import { strings } from '../../localization';
import { APP_COLORS, HEIGHT, RESULT_TYPES, WIDTH } from '../../constans/constants';
import SimpleButton from '../../components/button/SimpleButton';
import FastImage from 'react-native-fast-image';
import { useFetching } from '../../hooks/useFetching';
import LoadingScreen from '../../components/LoadingScreen';
import RowView from '../../components/view/RowView';
import { ROUTE_NAMES } from '../../components/navigation/routes';

const UBTCompletedScreen = (props) => {

    const id = props.route?.params?.id
    const entity = props.route?.params?.entity
    const passed = props.route?.params?.passed;
    const correct = props.route?.params?.correct;
    const total = props.route?.params?.total;
    const resultType = props.route?.params?.resultType
    const data = props.route?.params?.data

    const [results, setResults] = useState([])
    const [parseJSON, isLoading, parsingError] = useFetching(async() => {
        const content = JSON.parse(data)
        setResults(Object.values(content))
    })

    useLayoutEffect(() => {
        props.navigation.setOptions({
          title: strings['Завершение теста'],
        })
      }, [])

    useEffect(() => {
        parseJSON()
    }, [])

    useEffect(() => {
        if (parsingError) {
            console.log(parsingError);
        }
    }, [parsingError])

    const Banner = ({children}) => {
        
        const passedTestBanner = require("../../assets/images/PassedTestBanner.png");
        const failedTestBanner = require("../../assets/images/FailedTestBanner.png");

        if (passed) {
        return (
            <FastImage style={styles.poster} source={passedTestBanner}>
                {children}
            </FastImage>
        );
        }
        return (
        <FastImage style={styles.poster} source={failedTestBanner}>
            {children}
        </FastImage>
        );
    };

    const posterText = () => {
        if (passed) {
        return strings['У вас больше 50% правильных ответов'];
        }
        return strings[
        'У вас меньше 50% правильных ответов. Вам нужно заново пройти тест.'
        ];
    };

    const onResults = () => {
        props.navigation.navigate(ROUTE_NAMES.ubtResult, { id, resultType})
    }

    const onAgain = () => {
        props.navigation.navigate(ROUTE_NAMES.testPreview, {id: entity?.id, again: true, type: "ubt", title: entity?.title})
    }

    const onGoHome = () => {

    }

    const renderResults = () => {
        return (
            <View>
                {
                    results.map((res, index) => (
                        <RowView 
                            key={index}
                            style={styles.subject}
                        >
                            <RowView>
                                <Text style={styles.subjectIndex}>{index + 1}.</Text>
                                <Text style={styles.subjectName}>{res?.name}</Text>
                            </RowView>
                            <Text style={styles.subjectResult}>{wordLocalization(strings[':num из :count'], { num: res?.count, count: res?.total })}</Text>
                        </RowView>
                    ))
                }
            </View>
        )
    }

    if (isLoading) {
        return <LoadingScreen/>
    }

    return (
        <UniversalView style={styles.container} haveScroll>
            <Banner>
                <Text style={styles.score}>
                {wordLocalization(strings[':num из :count'], {
                    num: correct,
                    count: total,
                })}
                </Text>
                <Text style={styles.aboutResult}>{posterText()}</Text>
            </Banner>
            {
                resultType === RESULT_TYPES.NONE || resultType === undefined || resultType === null
                ?
                null
                :
                <SimpleButton
                    text={strings.Результаты}
                    textStyle={styles.resultsText}
                    style={[styles.resultsButton, { backgroundColor: passed ? APP_COLORS.primary : "red" }]}
                    onPress={onResults}
                />
            }
            <SimpleButton
                text={strings['Пройти заново']}
                textStyle={[styles.againText, { color: passed ? APP_COLORS.primary : "red" }]}
                style={styles.againButton}
                onPress={onAgain}
            />
            {/* <SimpleButton
                text={strings['На главную']}
                textStyle={[styles.againText, { color: passed ? APP_COLORS.primary : "red" }]}
                style={styles.againButton}
                onPress={onGoHome}
            /> */}
            <Text style={styles.result}>{strings['Результаты теста']}</Text>
            {renderResults()}
        </UniversalView>
    );
};

const styles = StyleSheet.create({
  container: {
    
  },
  poster: {
    width: WIDTH,
    height: HEIGHT / 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  score: {
    ...setFontStyle(29, '700'),
    marginBottom: 6,
  },
  aboutResult: {
    ...setFontStyle(15, '400'),
    textAlign: 'center',
  },
  resultsButton: {
    margin: 16
  },
  resultsText: {},
  againButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: "transparent"
  },
  againText: {},
  result: {
    ...setFontStyle(19, "700"),
    marginLeft: 16
  },
  subject: {
    marginHorizontal: 16,
    paddingVertical: 20,
    justifyContent: "space-between",
    borderBottomWidth: 0.23,
    borderColor: APP_COLORS.border,
  },
  subjectIndex: {
    marginRight: 24,
    ...setFontStyle(10, "400", APP_COLORS.placeholder),
  },
  subjectName: {
    ...setFontStyle(15, "500"),
  },
  subjectResult: {
    ...setFontStyle(13, "600", APP_COLORS.primary),
    textTransform: "uppercase",
  }
});

export default UBTCompletedScreen