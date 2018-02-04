/* @flow */

import React, { Component } from 'react';
import {
  Dimensions,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Article from './Article';
import EventList from './EventsList';
import FinishedPage from './FinishedPage';

const samplePosts = require('./samplePosts.json');

const window = Dimensions.get('window');

export default class ArticleSwiper extends Component {
  static navigationOptions = {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'transparent',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      elevation: 0,
      borderBottomWidth: 0, // removes the border on the bottom
    },
  };
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      posts: params.posts,
      events: params.events,
      firstItem: params.firstItem,
    };
  }

  renderItem = ({ item, index }, parallaxProps) => {
    if (item.type === 'post') {
      return (
        <Article
          item={item}
          index={index}
          numPosts={this.state.posts.length}
          parallaxProps={parallaxProps}
        />
      );
    }
    if (item.type == 'events') {
      return (
        <EventList
          events={this.state.events}
        />
      );
    }
    return (
      <FinishedPage />
    );
  }

  render() {
    const { params } = this.props.navigation.state;
    const data = this.state.posts;
    if (this.state.events.length) {
      data.concat({ type: 'events' });
    }
    return (
      <Carousel
        data={this.state.posts.concat([{
          type: 'finished',
        }])}
        firstItem={this.state.firstItem}
        renderItem={this.renderItem}
        sliderWidth={window.width}
        itemWidth={window.width}
        containerCustomStyle={{ backgroundColor: 'white', marginBottom: -45 }}
        hasParallaxImages
        swipeThreshold={15}
        inactiveSlideOpacity={1.0}
        inactiveSlideScale={1.0}
      />
    );
  }
}
