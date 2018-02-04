/* @flow */
import React, { Component } from 'react';
import {
  StackNavigator,
} from 'react-navigation';
import HomePage from './HomePage';
import ArticleSwiper from './ArticleSwiper';
import FinishedPage from './FinishedPage';

export default class App extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <MainNavigator />
    );
  }
}

const MainNavigator = StackNavigator({
  HomePage: { screen: HomePage, navigationOptions: { header: null } },
  ArticleSwiper: {
    screen: ArticleSwiper,
  },
});
