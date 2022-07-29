import React, { Component } from 'react';
import { View, Text } from 'react-native';

export default class HomeScreen2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ backgroundColor: 'green' }}>
                <Text> HomeScreen2 </Text>
            </View>
        );
    }
}
