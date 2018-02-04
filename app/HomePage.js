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
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import ParallaxScrollView from './ParallaxScrollView';
import DateHeader from './DateHeader';
import LoadingScreen from './LoadingScreen';

const window = Dimensions.get('window');
const WINDOW_HEIGHT = window.height;

const samplePosts = require('./samplePosts.json');
const sampleEvents = require('./sampleEvents.json');


const ROW_HEIGHT = 90;
const PARALLAX_HEADER_HEIGHT = 370;
const STICKY_HEADER_HEIGHT = 70;

const baseUrl = 'https://xev6uqiodd.execute-api.us-east-1.amazonaws.com/dev/';

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      events: [],
      isLoading: true,
    };
  }

  componentWillMount() {
    const postsUrl = `${baseUrl}find_recent_posts/ann%20arbor`;
    const eventsUrl = `${baseUrl}find_upcoming_events/ann%20arbor`;
    fetch(postsUrl).then(response => response.json()).then((responseJson) => {
      this.setState({
        posts: responseJson,
        isLoading: false,
      });
    });
    fetch(eventsUrl).then(response => response.json()).then((responseJson) => {
      this.setState({
        events: responseJson,
        isLoading: false,
      });
    });
  }

  navigateToPost = (rowID) => {
    const { navigate } = this.props.navigation;
    navigate('ArticleSwiper', {
      firstItem: Number(rowID),
      posts: this.state.posts,
      events: this.state.events,
    });
  }

  renderItem = (item, index) => {
    const fbId = item.page_id;
    const imageUrl = `https://graph.facebook.com/${fbId}/picture?type=large`;
    let indexForSwiper = index;
    if (item.type === 'event') {
      indexForSwiper = index + this.state.posts.length;
    }
    return (
      <TouchableHighlight
        key={item.key}
        style={styles.highlight}
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => this.navigateToPost(indexForSwiper)}
      >
        <View style={styles.row}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.profilePic}
          />
          <View style={styles.rowTextView}>
            <Text style={styles.rowText}>
              { item.author }
            </Text>
            <Text style={styles.position}>
              { item.title }
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  renderSectionHeader = (section) => {
    if (section.data.length === 0) {
      return null;
    }
    if (section.key === 0) {
      return (
        <View>
          <TouchableHighlight
            style={styles.highlight}
            underlayColor="rgba(0,0,0,.1)"
            onPress={() => this.navigateToPost(0)}
          >
            <Image source={{
            uri: this.state.posts.length ? this.state.posts[0].picture_url : '',
            width: window.width,
            height: (WINDOW_HEIGHT / 2) - 45,
          }}
            />
          </TouchableHighlight>
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

  renderScrollComponent = () => (
    <Image source={{
      uri: this.state.posts.length ? this.state.posts[0].picture_url : '',
      width: window.width,
      height: (WINDOW_HEIGHT / 2) - 45,
    }}
    />
  )

  render() {
    StatusBar.setHidden(false, 'fade');
    if (this.state.isLoading) {
      return (<LoadingScreen />);
    }
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <SectionList
          style={styles.container}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          automaticallyAdjustContentInsets={false}
          renderSectionHeader={({ section }) => this.renderSectionHeader(section)}
          sections={[ // homogeneous rendering between sections
          { data: this.state.posts, title: 'Today\'s posts', key: 0 },
          { data: this.state.events, title: 'Events', key: 1 },
        ]}
          keyExtractor={(item, index) => index}
        />
      </ScrollView>

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
    justifyContent: 'flex-start',
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
    fontSize: 22,
    marginBottom: 5,
    marginTop: 10,
    color: 'black',
    // backgroundColor: 'purple',
    fontWeight: '400',
  },
  profilePic: {
    height: ROW_HEIGHT,
    width: ROW_HEIGHT,
    marginLeft: 0,
  },
  rowTextView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 0,
    margin: 10,
    marginBottom: 0,
    // backgroundColor: 'yellow',


  },
  position: {
    flex: 1,
    fontSize: 17,
    color: 'black',
    // backgroundColor: 'orange',
  },
});

/*

*/
