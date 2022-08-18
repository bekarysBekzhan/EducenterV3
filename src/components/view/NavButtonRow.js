import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useMemo } from 'react';
import { iconNext } from '../../assets/icons';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constans/constants';

const NavButtonRow = ({
    item,
    leftIcon,
    title,
    selectedCategory,
    titleStyle,
    style,
    onPress = () => undefined,
    ...props }) => {
    const memoStyle = useMemo(() => [styles.row, style], [style]);
    const titleMemoStyle = useMemo(() => [styles.title, titleStyle], [titleStyle]);

    const onHandlerPress = () => {
        if (onPress) {
            onPress(item)
        }
    }

    return (
        <TouchableOpacity
            style={memoStyle}
            activeOpacity={0.9}
            onPress={onHandlerPress}
            {...props}>
            {leftIcon}
            <Text style={titleMemoStyle}>{title}</Text>
            {
                selectedCategory
                    ?
                    <Text style={styles.selectedCategory}>{selectedCategory}</Text>
                    :
                    null
            }
            {iconNext}
        </TouchableOpacity>
    );
};

export default NavButtonRow;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: "space-between",
        height: 48,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomLeftRadius: 80
    },
    title: {
        flex: 1,
        marginLeft: 16,
        ...setFontStyle(17, '400', "#111621")
    },
    selectedCategory: {
        ...setFontStyle(14, "400", APP_COLORS.placeholder)
    }
});
