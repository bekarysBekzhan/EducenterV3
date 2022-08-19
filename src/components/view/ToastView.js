import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RowView from './RowView';
import { setFontStyle } from '../../utils/utils';
import { APP_COLORS } from '../../constans/constants';
import { InfoIcon } from '../../assets/icons';

const ToastView = ({
    text,
}) => (
    <RowView style={styles.row}>
        <InfoIcon/>
        <View style={styles.col}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </RowView>
);

const styles = StyleSheet.create({
    row: {
        backgroundColor: 'rgba(17, 22, 33, 0.88)',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.04,
        shadowRadius: 24,
        elevation: 1
    },
    col: {
        flex: 1,
        marginLeft: 10
    },
    text: {
        ...setFontStyle(15, '400', '#fff')
    }
});

export default ToastView;