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
  getOrdinal = (dayOfMonth) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = dayOfMonth % 100;
    const ordinal = (s[(v - 20) % 10] || s[v] || s[0]);
    return ordinal;
  }

  render() {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const ordinal = this.getOrdinal(dayOfMonth);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const day = days[today.getDay()];
    const month = months[today.getMonth()];
    return (
      <View style={styles.dateHeader}>
        <Text style={styles.currentDay}>
          { day }
        </Text>
        <Text style={styles.dayOfMonth}>
          { `${month} ${dayOfMonth}${ordinal}` }
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
    // marginTop: -90,
    backgroundColor: 'rgba(0,0,0,.9)',
    paddingHorizontal: 10,
  },
  currentDay: {
    fontSize: 36,
    fontFamily: 'avenir',
    color: 'white',
    // backgroundColor: 'green',
  },
  dayOfMonth: {
    fontSize: 17,
    fontFamily: 'avenir',
    color: 'white',
    // backgroundColor: 'orange',
  },
});

