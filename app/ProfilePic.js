import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  TouchableHighlight,
  StyleSheet,
  AppRegistry,
} from 'react-native';

export default class ProfilePic extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.highlight}
        underlayColor="white"
        onPress={() => this.props.wasTapped()}
      >
        <Image
          style={styles.profilePic}
          source={{ uri: this.props.imageUrl }}
        />
      </TouchableHighlight>
    );
  }
}

ProfilePic.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  wasTapped: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  highlight: {
    height: 60,
    width: 60,
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 30,
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
  },
});

AppRegistry.registerComponent('ProfilePic', () => ProfilePic);
