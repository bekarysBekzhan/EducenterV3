import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { APP_COLORS } from '../constants/constants'
import { TouchableOpacity } from 'react-native'
import { storeObject } from '../storage/AsyncStorage'
import { useSettings } from './context/Provider';
import { BellIcon, SettingsIcon } from '../assets/icons'


const ProfileHeaderBar = ({ navigation, title }) => {
    const { settings, isRead, setIsRead, nstatus } = useSettings();

    const onPressNotification = async () => {
        await storeObject(STORAGE.isRead, true);
        setIsRead(true);
        navigation.navigate(ROUTE_NAMES.notifications);
    };
    return (
        <View style={styles.header}>

            <Text style={styles.headerTitle}>{title}</Text>


            <View style={styles.headerIcons}>
                <View style={styles.flexRowAlignCenterGapTen}>
                    <TouchableOpacity
                        activeOpacity={0.65}
                        onPress={onPressNotification}
                        style={styles.iconButton}
                    >
                        <BellIcon isRead={isRead} color={APP_COLORS.gray} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.65}
                        style={styles.iconButton}
                    >
                        <SettingsIcon color={APP_COLORS.gray} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>


    )
}

export default ProfileHeaderBar

const styles = StyleSheet.create({
    header: {
        flex: 1,
        paddingTop: 30,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        paddingBottom: 90,
        backgroundColor: APP_COLORS.primary,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500",
        color: "white",
        marginLeft: 15
    },
    flexRowAlignCenterGapTen: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    iconButton: {
        backgroundColor: '#FFFFFF33',
        borderRadius: 31,
        width: 36,
        height: 36,
        paddingTop: 9,
        gap: 16,
        alignItems: 'center',
        marginLeft: 8,
    },
    headerIcons: {
        marginRight: 12,
    },
})
