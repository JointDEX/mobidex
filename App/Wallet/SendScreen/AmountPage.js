import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { formatAmount, getForexIcon, isValidAmount } from '../../../utils';
import TokenAmount from '../../components/TokenAmount';
import TokenAmountKeyboard from '../../components/TokenAmountKeyboard';
import * as TickerService from '../../services/TickerService';

class AmountPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: '',
      forex: '',
      focus: 'amount',
      error: false
    };
  }

  render() {
    const { token } = this.props;

    return (
      <View style={{ padding: 20, flex: 1, width: '100%' }}>
        <TokenAmount
          symbol={token.symbol}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={this.state.focus === 'amount'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.amount}
          onPress={() => this.setState({ focus: 'amount' })}
        />
        <TokenAmount
          symbol={'USD'}
          icon={getForexIcon('USD', { size: 30, style: { marginLeft: 10 } })}
          containerStyle={{
            marginTop: 10,
            marginBottom: 10,
            padding: 0
          }}
          symbolStyle={{ marginRight: 10 }}
          format={false}
          cursor={this.state.focus === 'forex'}
          cursorProps={{ style: { marginLeft: 2 } }}
          amount={this.state.forex}
          onPress={() => this.setState({ focus: 'forex' })}
        />
        <TokenAmountKeyboard
          onChange={v =>
            this.state.focus === 'forex'
              ? this.setForexAmount(v)
              : this.setTokenAmount(v)
          }
          onSubmit={() => this.submit()}
          pressMode="char"
          buttonTitle={'Next'}
        />
      </View>
    );
  }

  async submit() {
    try {
      new BigNumber(this.state.amount);
      this.props.onSubmit(this.state.amount);
    } catch (err) {
      this.setState({ error: true });
    }
  }

  updateColumnValue(column, value) {
    const text = this.state[column].toString();
    let newText = null;

    if (isNaN(value)) {
      if (value === 'back') {
        newText = text.slice(0, -1);
      } else if (value === '.') {
        newText = text + value;
      } else {
        newText = text + value;
      }
    } else {
      newText = text + value;
    }

    return newText;
  }

  setTokenAmount(value) {
    const amount = this.updateColumnValue('amount', value);

    if (isValidAmount(amount)) {
      const forex = TickerService.getForexTicker(this.props.token.symbol);
      const forexAmount =
        amount && forex
          ? new BigNumber(amount).mul(forex.price).toNumber()
          : '';
      this.setState({ amount, forex: forexAmount });
    }
  }

  setForexAmount(value) {
    const forexAmount = this.updateColumnValue('forex', value);

    if (isValidAmount(forexAmount)) {
      const forex = TickerService.getForexTicker(this.props.token.symbol);
      const tokenAmount =
        forexAmount && forex
          ? formatAmount(new BigNumber(forexAmount).div(forex.price))
          : '';
      this.setState({ amount: tokenAmount, forex: forexAmount });
    }
  }
}

AmountPage.propTypes = {
  token: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default connect(
  state => ({
    settings: state.settings,
    ticker: state.ticker
  }),
  dispatch => ({ dispatch })
)(AmountPage);