import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LeftArrowIcon } from '../assets/icons'; // Assuming you have this icon available
import { APP_COLORS } from '../constants/constants';
import { setFontStyle } from '../utils/utils';

const SmallHeaderBar = ({ title }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.iconButton}
                activeOpacity={0.65}
            >
                <LeftArrowIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
};

export default SmallHeaderBar;

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
        left: 10,
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
        ...setFontStyle(18, '600', APP_COLORS.white),
        textAlign: 'center',
        letterSpacing: 0.4,
    },
});
