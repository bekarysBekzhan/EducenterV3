import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import { APP_COLORS } from '../../constants/constants';
import { setFontStyle } from '../../utils/utils';

const Tab = createMaterialTopTabNavigator();

function TopTab({
    screens = [],
    swipeEnabled = false,
    ...props }) {


    return (

        <Tab.Navigator
            screenOptions={{

                tabBarStyle: styles.tabBarStyle,
                tabBarItemStyle: styles.tabBarItemStyle,
                tabBarLabelStyle: styles.tabBarLabelStyle,
                tabBarIndicatorContainerStyle: styles.tabBarIndicatorContainerStyle,
                tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
                tabBarInactiveTintColor: '#808191',
                tabBarActiveTintColor: '#111621',
                swipeEnabled: swipeEnabled
            }}
        >
            {screens.map((element, index) => {
                return (
                    <Tab.Screen name={element.name} component={element.component} key={index} />
                )
            })}
        </Tab.Navigator>
    );
}

export default TopTab


const styles = StyleSheet.create({

    tabBarStyle: {
        backgroundColor: APP_COLORS.lightgray,
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 24,
    },
    tabBarItemStyle: {
        borderRadius: 24
    },
    tabBarLabelStyle: {
        ...setFontStyle(14, '500', APP_COLORS.black),
        margin: 2,
        textTransform: 'none',
        textAlign: 'center',
    },
    tabBarIndicatorContainerStyle: {
        borderRadius: 24,
        margin: 2,
        paddingHorizontal: 8,

        shadowColor: '#000153', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 92, 
        elevation: 92,
    },
    tabBarIndicatorStyle: {
        height: '100%',
        borderRadius: 24,
        backgroundColor: APP_COLORS.white,
    }
});