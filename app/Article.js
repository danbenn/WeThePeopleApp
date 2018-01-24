/* @flow */
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import ParallaxScrollView from './ParallaxScrollView';
import ParallaxImage from './ParallaxImage';
import NameHeader from './NameHeader';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = window.height / 2;

export default class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: null,
      width: null,
    };
  }
  componentDidMount() {
    Image.getSize(
      this.props.item.picture_url,
      (srcWidth, srcHeight) => {
        const maxHeight = Dimensions.get('window').height / 2;
        const maxWidth = Dimensions.get('window').width;

        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        // this.setState({ width: srcWidth * ratio, height: srcHeight * ratio });
        this.setState({ width: maxWidth, height: maxWidth });
      }, (error) => {
        console.log('error:', error);
      },
    );
  }
  render() {
    const { item, parallaxProps } = this.props;
    return (
      <ParallaxScrollView
        onScroll={() => {}}
        headerBackgroundColor="#000"
        parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
        backgroundSpeed={10}
        renderBackground={() => (
          <View key="background">
            <ParallaxImage
              source={{
                  uri: item.picture_url,
                  width: window.width,
                  height: (window.height / 2),
                }}
              containerStyle={{ width: this.state.width, height: this.state.height }}
              style={styles.image}
              parallaxFactor={0.3}
              {...parallaxProps}
            />
          </View>
          )}
      >
        <View style={styles.slide}>
          <NameHeader
            name={item.author}
            facebookId={item.page_id}
            party="R"
            title="Grand Pooba"
            wasTapped={() => {}}
          />
          <Text style={styles.message}>{item.status_message}</Text>
        </View>
      </ParallaxScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    width: window.width,
  },
  message: {
    flex: 1,
    // backgroundColor: 'green',
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    backgroundColor: 'black',
    // backgroundColor: 'blue',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
    // backgroundColor: 'blue',
  },
});

/*
componentDidMount() {
    Image.getSize(this.props.source.uri, (srcWidth, srcHeight) => {
      const maxHeight = Dimensions.get('window').height; // or something else
      const maxWidth = Dimensions.get('window').width;

      const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      this.setState({ width: srcWidth * ratio, height: srcHeight * ratio });
    }, error => {
      console.log('error:', error);
    });
  }

*/
