/* @flow */
import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import HomePage from './HomePage';
import ArticleSwiper from './ArticleSwiper';
import EventsList from './EventsList';

export default class App extends Component {
  render() {
    return (
      <MainNavigator />
    );
  }
}

const MainNavigator = StackNavigator({
  HomePage: { screen: HomePage, navigationOptions: { header: null } },
  ArticleSwiper: {
    screen: ArticleSwiper,
    navigationOptions: {
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
    },
  },
});
