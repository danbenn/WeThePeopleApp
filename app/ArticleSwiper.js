/* @flow */

import React, { Component } from 'react';
import {
  Dimensions, View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Article from './Article';
import EventList from './EventsList';

const sampleStories = require('./sampleStories.json');

const window = Dimensions.get('window');

export default class ArticleSwiper extends Component {
  static navigationOptions = {
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: 'white',
    },
  };

  constructor(props) {
    super(props);
    const articles = sampleStories.stories.map((elt) => {
      const newElt = elt;
      newElt.type = 'article';
      return (newElt);
    });
    articles.push( sampleStories.events[0]);
    this.state = {
      articles,
    };
  }

  renderItem = ({ item }, parallaxProps) => {
    if (item.type === 'article') {
      return (
        <Article
          item={item}
          parallaxProps={parallaxProps}
        />
      );
    }
    return (<EventList />);
  }

  render() {
    const { params } = this.props.navigation.state;
    console.log(params);
    return (
      <Carousel
        data={this.state.articles}
        firstItem={params.firstItem}
        renderItem={this.renderItem}
        sliderWidth={window.width}
        itemWidth={window.width}
        containerCustomStyle={{ backgroundColor: 'white' }}
        hasParallaxImages
        swipeThreshold={5}
        inactiveSlideOpacity={1.0}
        inactiveSlideScale={1.0}
      />
    );
  }
}
