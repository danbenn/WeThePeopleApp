/* @flow */
import React, { Component } from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  StyleSheet,
} from 'react-native';

const hippo = require('../assets/hippo.jpg');

export default class LoadingScreen extends Component {
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.spin();
  }
  spin() {
    this.spinValue.setValue(0);
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
      },
    ).start(() => this.spin());
  }

  render() {
    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <View style={styles.background}>
        <Animated.Image
          style={[styles.image, { transform: [{ rotate: spin }] }]}
          source={hippo}
        />
        <Text style={styles.headerText}>
          Loading...
        </Text>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 30,
    marginTop: 30,
    fontWeight: '500',
  },
});
