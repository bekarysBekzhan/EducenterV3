import React, { useState } from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { setFontStyle } from '../../utils/setFontStyle';
import { StyleSheet } from 'react-native';

const Tab = createMaterialTopTabNavigator();

function TopTab({
    screens = [],
    swipeEnabled = false,
    ...props }) {


    return (
        <NavigationContainer>
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
                {screens.map((element) => {
                    return (
                        <Tab.Screen name={element.name} component={element.component} />
                    )
                })}
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default TopTab


const styles = StyleSheet.create({

    tabBarStyle: {
        backgroundColor: '#F5F5F5',
        marginHorizontal: 16,
        marginTop: 10,
        borderRadius: 8
    },
    tabBarItemStyle: {
        borderRadius: 6
    },
    tabBarLabelStyle: {
        fontSize: 15,
        margin: 2,
        textTransform: 'none',
        textAlign: 'center',
    },
    tabBarIndicatorContainerStyle: {
        borderRadius: 6,
        margin: 2,
        paddingHorizontal: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.09,
        shadowRadius: 2,
        elevation: 1
    },
    tabBarIndicatorStyle: {
        height: '100%',
        borderRadius: 6,
        backgroundColor: '#ffffff'
    }
});