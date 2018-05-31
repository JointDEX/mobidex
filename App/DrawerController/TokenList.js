import { ZeroEx } from '0x.js';
import React, { Component } from 'react';
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { updateForexTickers, updateTokenTickers } from '../../thunks';
import {
  findTickerDetails,
  formatAmount,
  formatMoney,
  getImage
} from '../../utils';

const TokenItem = connect(
  state => ({
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(
  class extends Component {
    render() {
      const { token, ticker, settings } = this.props;
      const { decimals, symbol } = token;
      const { forexCurrency } = settings;
      const balance = ZeroEx.toUnitAmount(token.balance, decimals);
      const forex = findTickerDetails(ticker.forex, symbol, forexCurrency);

      return (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{symbol.toString()}</Text>
          <Text style={styles.itemText}>{formatAmount(balance)}</Text>
          {forex && forex.price ? (
            <Text style={styles.itemText}>
              ({formatMoney(balance.mul(forex.price).toNumber())})
            </Text>
          ) : null}
        </View>
      );
    }
  }
);

class TokenList extends Component {
  constructor(props, context) {
    super(props);

    this.state = {
      refreshing: false
    };
  }

  async componentDidMount() {
    await this.onRefresh();
  }

  render() {
    const { tokens } = this.props;

    return (
      <ScrollView
        style={{ width: '100%' }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        {tokens.map((token, index) => (
          <TouchableOpacity
            key={`token-${index}`}
            onPress={() => this.props.onPress(token)}
          >
            <ListItem
              roundAvatar
              bottomDivider
              avatar={{ source: getImage(token.symbol) }}
              title={<TokenItem token={token} />}
              avatarOverlayContainerStyle={{ backgroundColor: 'transparent' }}
              containerStyle={[
                this.props.token &&
                  this.props.token.address === token.address &&
                  styles.highlight
              ]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  onRefresh = async () => {
    this.setState({ refreshing: true });
    await this.props.dispatch(updateForexTickers());
    await this.props.dispatch(updateTokenTickers());
    this.setState({ refreshing: false });
  };
}

const styles = {
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginLeft: 5,
    height: 25,
    width: '100%'
  },
  itemText: {
    marginLeft: 10
  },
  highlight: {
    backgroundColor: colors.grey3,
    borderColor: colors.grey3,
    borderWidth: 1
  }
};

export default connect(
  state => ({
    ...state.settings
  }),
  dispatch => ({ dispatch })
)(TokenList);