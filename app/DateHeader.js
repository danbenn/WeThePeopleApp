/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';

const window = Dimensions.get('window');
const ROW_HEIGHT = 60;

export default class DateHeader extends Component {
    render() {
        return (
            <View style={styles.dateHeader}>
                <Text style={styles.currentDay}>
                    { 'Saturday' }
                </Text>
                <Text style={styles.dayOfMonth}>
                    { 'December 30th' }
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dateHeader: {
        flex: 1,
        justifyContent: 'center',
        width: window.width,
        height: ROW_HEIGHT * 1.5,
        marginTop: -90,
        backgroundColor: 'rgba(0,0,0,.5)',
        paddingHorizontal: 10,
      },
      currentDay: {
        fontSize: 36,
        fontFamily: 'avenir',
        color: 'white',

        // backgroundColor: 'green',
      },
      dayOfMonth: {
        fontSize: 16,
        fontFamily: 'avenir',
        color: 'white',
        // backgroundColor: 'orange',
      },
})



