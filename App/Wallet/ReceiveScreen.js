import React, { Component } from 'react';
import { Share, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import ethUtil from 'ethereumjs-util';
import Button from '../components/Button';

class ReceiveScreen extends Component {
  share = () => {
    Share.share(
      {
        message: `Here's My Address: ${this.props.address}`,
        title: 'My Address'
      },
      {
        // Android only:
        dialogTitle: 'Mobidex Address',
        // iOS only:
        subject: 'Mobidex Address',
        excludedActivityTypes: ['com.apple.UIKit.activity.PostToTwitter']
      }
    );
  };

  render() {
    let { address } = this.props;
    let uri = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${ethUtil.stripHexPrefix(
      this.props.address
    )}`;

    return (
      <View
        style={[
          {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25
          }
        ]}
      >
        <Avatar size="xlarge" source={{ uri }} />
        <Text h4>Address</Text>
        <Text style={{ fontSize: 13 }}>{this.props.address}</Text>
        <Button
          large
          icon={<Icon name="send" size={20} color="white" />}
          onPress={this.share}
          title="Share Address"
          style={{ marginTop: 10 }}
        />
      </View>
    );
  }
}

export default connect(
  state => ({ ...state.device.layout, ...state.wallet }),
  dispatch => ({ dispatch })
)(ReceiveScreen);
