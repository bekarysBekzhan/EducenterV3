import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LeftArrowIcon, SearchIcon } from '../assets/icons'; // Assuming you have this icon available
import { APP_COLORS } from '../constants/constants';
import { ROUTE_NAMES } from './navigation/routes';

const HeaderBar = ({ title, type = 'course', filters = {} }) => {
    const navigation = useNavigation();

    let route = ROUTE_NAMES.courseSearch;

    if (type === 'test') {
        route = ROUTE_NAMES.testSearch;
    } else if (type === 'task') {
        route = ROUTE_NAMES.taskSearch;
    } else if (type === 'offlineCourse') {
        route = ROUTE_NAMES.offlineCourseSearchScreen;
    }

    return (
        <View style={styles.header}>

            <Text style={styles.headerTitle}>{title}</Text>

            <TouchableOpacity
                onPress={() => navigation.navigate(route, { filters })}
                style={styles.iconButton}
                activeOpacity={0.65}
            >
                <SearchIcon />
            </TouchableOpacity>

        </View>
    );
};

export default HeaderBar;

const styles = StyleSheet.create({
    header: {
        height: 60,
        backgroundColor: APP_COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
    },
    iconButton: {
        position: 'absolute',
        right: 12,
        padding: 10,
        backgroundColor: '#FFFFFF33',
        borderRadius: 31,
        width: 36,
        height: 36,
        paddingTop: 9,
        gap: 16,
        alignItems: 'center',
        marginLeft: 8,
    },
    headerTitle: {
        color: APP_COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
