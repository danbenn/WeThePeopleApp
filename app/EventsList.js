/* @flow */
import React, { Component } from 'react';
import {
  SectionList,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Event from './Event';

export default class EventsList extends Component {
  static navigationOptions = {
    headerTintColor: 'orange',
    headerStyle: {
      backgroundColor: 'orange',
    },
  };
  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Events
          </Text>
        </View>
        <SectionList
          sections={[
            { title: 'Events', data: this.props.events },
          ]}
          renderItem={({ item }) => <Event event={item} />}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6D9DE',
  },
  header: {
    backgroundColor: 'orange',
    height: 70,
  },
  headerText: {
    flex: 1,
    // backgroundColor: 'red',
    fontSize: 22,
    textAlign: 'center',
    color: 'white',
    marginTop: 27,
    fontWeight: '600',
  },
});

