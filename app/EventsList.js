/* @flow */
import React, { Component } from 'react';
import {
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import Event from './Event';

const sampleStories = require('./sampleStories.json');

export default class EventsList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SectionList
          sections={[
            { title: 'Events', data: sampleStories.events },
          ]}
          renderItem={({ item }) => <Event item={item} />}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#D6D9DE',
  },
});

