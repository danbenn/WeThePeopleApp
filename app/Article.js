/* @flow */
import React, { Component } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Share,
  Image,
  TouchableHighlight,
  ScrollView,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';
import Lightbox from './Lightbox';
import ParallaxScrollView from './ParallaxScrollView';
import ParallaxImage from './ParallaxImage';
import NameHeader from './NameHeader';

const window = Dimensions.get('window');
const rightArrow = require('../assets/rightArrow.png');
const shareIcon = require('../assets/shareIcon.png');

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

  onShareButtonClick = () => {
    let message = this.props.item.author;
    if (this.props.item.link_name !== '') {
      message = this.props.item.link_name;
    }
    Share.share({
      message,
      url: this.props.permalink_url,
      title: this.props.item.author,
    }, {
      // Android only:
      dialogTitle: 'Share this post',
    });
  }

  onLinkClick = () => {
    if (this.props.item.external_link !== '') {
      Linking.openURL(this.props.item.external_link);
    }
    Linking.openURL(this.props.item.permalink_url);
  }

  renderImage = (item, parallaxProps) => (
    <View key="background">
      <Lightbox underlayColor="white">
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
      </Lightbox>
    </View>
  )

  renderMessageText = () => {
    const { status_message } = this.props.item;
    if (status_message === '') {
      return null;
    }
    return (
      <Text style={styles.messageText}>
        {status_message}
      </Text>
    );
  }

  renderLink = () => {
    if (this.props.item.link_name === '') {
      return null;
    }
    return (
      <TouchableHighlight
        style={{}}
        underlayColor="#1D1F25"
        onPress={this.onLinkClick}
      >
        <View>
          <View style={styles.linkBorder} />
          <View style={styles.linkWrapper}>
            <Image
              source={rightArrow}
              style={styles.linkIcon}
            />
            <Text style={styles.linkText}>
              {this.props.item.link_name}
            </Text>
          </View>
          <View style={styles.linkBorder} />
        </View>
      </TouchableHighlight>
    );
  }

  renderShareButton = () => (
    <View style={styles.shareButtonWrapper}>
      <TouchableHighlight
        style={styles.shareIcon}
        underlayColor="white"
        onPress={this.onShareButtonClick}
      >
        <Image
          source={shareIcon}
          style={styles.shareIcon}
        />
      </TouchableHighlight>
      <Text style={styles.shareText}>
        Share this story
      </Text>
    </View>
  )

  renderFooter = () => (
    <View style={styles.footer} >
      <View style={styles.postsRemainingView}>
        <Text style={styles.postsRemainingText}>
          {`${this.props.index + 1} / ${this.props.numPosts}`}
        </Text>
      </View>
      <Text style={styles.footerText}>
        Swipe to next post
      </Text>
    </View>
  )

  render() {
    const { item, parallaxProps } = this.props;
    return (
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.slide}>
          {this.renderImage(item, parallaxProps)}
          <NameHeader
            name={item.author}
            facebookId={item.page_id}
            party={item.party === '' ? '' : item.party[0]}
            title={item.title}
            wasTapped={() => {}}
          />

          {this.renderMessageText()}
          {this.renderLink()}
          {this.renderShareButton()}
          {this.renderFooter()}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'space-between',
    width: window.width,
    backgroundColor: 'white',
  },
  messageText: {
    backgroundColor: 'white',
    fontSize: 18,
    lineHeight: 28,
    paddingHorizontal: 15,
    marginTop: 10,
    paddingBottom: 15,
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
  footer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#489AF0',
    height: 120,
    width: window.width,
    marginBottom: 40,
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    // backgroundColor: 'cyan',
    marginBottom: 10,
  },
  postsRemainingText: {
    flex: 1,
    color: '#489AF0',
    paddingTop: 5,
    fontSize: 22,
    // backgroundColor: 'orange',
  },
  postsRemainingView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    width: window.width / 3,
    height: 40,
  },
  linkBorder: {
    borderColor: '#ccc',
    borderWidth: 0.7,
  },
  linkText: {
    flex: 1,
    padding: 12,
    fontSize: 18,
  },
  linkIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  linkWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shareIcon: {
    height: 50,
    width: 50,
    marginBottom: 10,
  },
  shareText: {
    color: '#489AF0',
    fontSize: 17,
  },
  shareButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    backgroundColor: 'white',
    marginBottom: 10,
    marginTop: 10,
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
