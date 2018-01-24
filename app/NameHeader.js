import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableHighlight,
  StyleSheet,
  AppRegistry,
  Text,
  Dimensions,
} from 'react-native';
import ProfilePic from './ProfilePic';

const PAGE_WIDTH = Dimensions.get('window').width;

export default class NameHeader extends Component {
  render() {
    const fbId = this.props.facebookId;
    const imageUrl = `https://graph.facebook.com/${fbId}/picture?type=large`;
    return (
      <View style={styles.header}>
        <ProfilePic
          imageUrl={imageUrl}
          wasTapped={() => {}}
        />
        <View style={styles.nameView}>
          <View>
            <TouchableHighlight
              style={styles.nameWrapper}
              underlayColor="white"
              onPress={() => this.props.wasTapped()}
            >
              <Text>
                <Text style={styles.name}>
                  {this.props.name}
                </Text>
                <Text style={styles.party}>
                  {` (${this.props.party})`}
                </Text>
              </Text>
            </TouchableHighlight>
          </View>
          <Text style={styles.title}>
            {this.props.title}
          </Text>
        </View>
      </View>
    );
  }
}

NameHeader.propTypes = {
  name: PropTypes.string.isRequired,
  facebookId: PropTypes.string.isRequired,
  party: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  wasTapped: PropTypes.func.isRequired,
};

let styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  title: {
    marginTop: 8,
    marginLeft: 10,
    fontSize: 14,
    color: 'grey',
  },
  nameView: {
    flexDirection: 'column',
    // backgroundColor: 'magenta',
  },
  nameWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
    // backgroundColor: 'yellow',
  },
  name: {
    fontSize: 22,
    fontFamily: 'avenir-medium',
    color: 'white',
  },
  party: {
    fontSize: 22,
    fontFamily: 'avenir-light',
    color: 'white',
  },
});


AppRegistry.registerComponent('ProfilePic', () => ProfilePic);
