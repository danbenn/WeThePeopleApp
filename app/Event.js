/* @flow */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableHighlight,
} from 'react-native';
import moment from 'moment';
import Lightbox from './Lightbox';

const window = Dimensions.get('window');
const clock = require('../assets/clock.png');
const locationPin = require('../assets/locationPin.png');

export default class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: moment(this.props.event.start_time),
      end: moment(this.props.event.end_time),
      height: null,
      width: null,
    };
  }
  componentDidMount() {
    Image.getSize(
      this.props.event.cover.source,
      (srcWidth, srcHeight) => {
        const maxHeight = Dimensions.get('window').height / 2;
        const scaleUpFactor = window.width / srcWidth;
        const dynamicHeight = scaleUpFactor * srcHeight;
        this.setState({ height: dynamicHeight });
      }, (error) => {
        console.log('error:', error);
      },
    );
  }

  renderEventHeader = event => (
    <View style={styles.eventHeader}>
      <View style={styles.dateHeader}>
        <Text style={styles.dayOfMonth}>
          {this.state.start.format('DD')}
        </Text>
        <Text style={styles.monthInHeader}>
          {this.state.start.format('MMM').toUpperCase()}
        </Text>
      </View>
      <Text
        style={styles.name}
        numberOfLines={2}
      >
        {event.name}
      </Text>
    </View>
  )

  renderEventImage = event => (
    <Lightbox underlayColor="white">
      <Image
        source={{
          uri: event.cover.source,
          width: window.width,
          height: this.state.height,
        }}
        style={styles.image}
      />
    </Lightbox>
  )

  renderTimeDetail = event => (
    <View style={styles.infoRow}>
      <Image
        style={styles.icon}
        source={clock}
      />
      <Text style={styles.infoRowText}>
        {this.state.start.format('dddd, MMMM D, h a')}
      </Text>
    </View>
  )

  renderLocation = (event) => {
    if ('place' in event) {
      return (
        <View style={styles.infoRow}>
          <Image
            style={styles.icon}
            source={locationPin}
          />
          <Text style={styles.infoRowText}>
            {event.place.name}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderButton = text => (
    <TouchableHighlight
      style={styles.button}
      underlayColor="white"
      activeOpacity={0.5}
      onPress={() => {}}
    >
      <View>
        <Text style={styles.buttonText}>
          {text}
        </Text>
      </View>
    </TouchableHighlight>
  )

  renderButtons = () => (
    <View style={styles.buttonView}>
      {this.renderButton('Remind me')}
      <View style={styles.buttonDivider} />
      {this.renderButton('Share')}
    </View>
  )

  render() {
    const { event } = this.props;
    return (
      <View style={styles.eventContainer}>
        {this.renderEventImage(event)}
        {this.renderEventHeader(event)}
        {this.renderTimeDetail(event)}
        {this.renderLocation(event)}
        {this.renderButtons()}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    flex: 1,
    padding: 10,
    fontSize: 18,
    // backgroundColor: 'blue',
  },
  eventContainer: {
    flex: 1,
    backgroundColor: 'white',
    width: window.width,
    marginBottom: 10,
  },
  eventHeader: {
    flex: 1,
    height: 92,
    marginTop: 16,
    marginBottom: -10,
    flexDirection: 'row',
    // backgroundColor: 'magenta',
  },
  dateHeader: {
    width: 70,
    flexDirection: 'column',
    marginLeft: 11,
    // backgroundColor: 'red',
  },
  dayOfMonth: {
    flex: 1,
    fontSize: 40,
    textAlign: 'center',
    fontFamily: 'avenir',
    // backgroundColor: 'green',
  },
  monthInHeader: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'avenir-medium',
    // backgroundColor: 'orange',
    paddingTop: 10,
  },
  image: {
    flex: 1,
    backgroundColor: 'black',
    resizeMode: 'contain',
  },
  icon: {
    marginTop: 3,
    marginRight: 12,
    height: 28,
    width: 28,
  },
  name: {
    flex: 1,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 20,
    fontSize: 22,
    fontFamily: 'avenir-medium',
    lineHeight: 35,
  },
  infoRow: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'cyan',
    marginLeft: 22,
  },
  infoRowText: {
    flex: 1,
    margin: 5,
    fontFamily: 'avenir-light',
    fontSize: 18,
    // backgroundColor: 'yellow',
  },
  buttonView: {
    flex: 1,
    height: 60,
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'magenta',
  },
  button: {
    flex: 1,
    // backgroundColor: 'yellow',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'avenir-light',
    fontSize: 18,
  },
  buttonDivider: {
    width: 0.5,
    height: 35,
    backgroundColor: 'gray',
  },
});

