/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  SectionList,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import ParallaxScrollView from './ParallaxScrollView';
import DateHeader from './DateHeader';

const window = Dimensions.get('window');
const WINDOW_HEIGHT = window.height;

const sampleStories = require('./sampleStories.json');

const ROW_HEIGHT = 70;
const PARALLAX_HEADER_HEIGHT = 370;
const STICKY_HEADER_HEIGHT = 70;

export default class HomePage extends Component {
  static tabBarOptions = {
    activeTintColor: 'red',
    style: {
      backgroundColor: 'green',
    },
  }

  navigateToArticle = (rowID) => {
    console.log(rowID);
    const { navigate } = this.props.navigation;
    navigate('ArticleSwiper', { firstItem: Number(rowID) });
  }

  renderItem = (item) => {
    const fbId = item.page_id;
    const imageUrl = `https://graph.facebook.com/${fbId}/picture?type=large`;
    console.log(item);

    return (
      <TouchableHighlight
        key={item.key}
        style={styles.highlight}
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => this.navigateToArticle(item.key)}
      >
        <View style={styles.row}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.profilePic}
          />
          <Text style={styles.rowText}>
            { item.author }
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSectionHeader = (section) => {
    if (section.key === 0) {
      return (
        <View>
          <DateHeader />
          <View style={styles.colorBar}>
            <Text style={styles.colorBarText}>
              { section.title }
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.colorBar, { backgroundColor: 'orange' }]}>
        <Text style={[styles.colorBarText]}>
          { 'Events' }
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          style={styles.container}
          renderItem={({ item }) => this.renderItem(item)}
          automaticallyAdjustContentInsets={false}
          renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
          sections={[ // homogeneous rendering between sections
          { data: sampleStories.stories, title: 'Today\'s updates', key: 0 },
          { data: sampleStories.events, title: 'Events', key: 1 },

        ]}
          keyExtractor={(item, index) => index}
          renderScrollComponent={() => (
            <ParallaxScrollView
              onScroll={() => {}}
              parallaxHeaderHeight={(WINDOW_HEIGHT / 2) - 45}
              backgroundSpeed={10}
              bounces={false}
              renderBackground={() => (
                <View key="background">
                  <Image source={{
                  uri: sampleStories.stories[0].picture_url,
                  width: window.width,
                  height: (WINDOW_HEIGHT / 2) - 45,
                }}
                  />
                </View>
            )}
            />
        )}
        />
      </View>

    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: ROW_HEIGHT,
    backgroundColor: 'transparent',
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  colorBar: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#489AF0',
    width: window.width,
    height: 35,
    paddingHorizontal: 10,
  },
  colorBarText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'avenir',
  },
  rowText: {
    flex: 1,
    fontSize: 20,
    marginLeft: 10,
  },
  profilePic: {
    height: ROW_HEIGHT,
    width: ROW_HEIGHT,
    marginLeft: 0,
  },
});

/*

*/
