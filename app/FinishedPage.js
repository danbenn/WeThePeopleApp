/* @flow */
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';

const window = Dimensions.get('window');
const prayerHands = require('../assets/prayerHands.png');
const clock = require('../assets/clock.png');

export default class FinishedPage extends Component {
  render() {
    return (
      <View style={styles.background}>
        <View style={styles.innerBackground}>
          <Text style={styles.headerText}>
          All done!
          </Text>
          <Image
            style={styles.image}
            source={prayerHands}
          />
        </View>
        <View style={styles.footer}>
          <Image
            style={styles.footerImage}
            source={clock}
          />
          <Text style={styles.footerText}>
        New stories at midnight
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    height: window.height,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#489AF0',
    // backgroundColor: 'cyan',
  },
  innerBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#489AF0',
    // backgroundColor: 'magenta',
  },
  headerText: {
    color: 'white',
    fontSize: 36,
    textAlign: 'center',
    fontWeight: '600',
    // backgroundColor: 'orange',
  },
  image: {
    height: window.width * 0.5,
    width: window.width * 0.5,
    // backgroundColor: 'black',
    resizeMode: 'contain',
    marginTop: 40,
  },
  message: {
    fontSize: 26,
    color: 'white',
    textAlign: 'center',
    margin: 28,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 120,
    width: window.width,
    backgroundColor: 'white',
    marginBottom: 0,
  },
  footerText: {
    fontSize: 22,
    marginRight: 14,
    color: '#535353',
    // backgroundColor: 'orange',
  },
  footerImage: {
    width: 50,
    height: 50,
    marginLeft: 14,
    resizeMode: 'contain',
    // backgroundColor: 'yellow',
  },
});
