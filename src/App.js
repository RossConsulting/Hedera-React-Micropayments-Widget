import React from 'react';
import './App.css';

class App extends React.Component {
  state = {
    payments: [],
    recipient: ""
  }

  handleAddPayment(e) {
    e.preventDefault();
    var amount = e.target[0].value;
    var memo = e.target[1].value;
    this.setState({
      payments: [
        ...this.state.payments, {
          amount: amount,
          memo: memo,
          paid: false,
          pending: false,
          note: ''
        }
      ]
    });
  }

  handlePayment(amount, memo, paymentIndex) {
    this.setState({
      payments: [
        ...this.state.payments.slice(0, paymentIndex), {
          ...this.state.payments[paymentIndex],
          pending: true
        },
        ...this.state.payments.slice(paymentIndex + 1, this.state.payments.length)
      ]
    });
    this.props.payWithHedera(amount, "0.0.1742", "valid payment", "aRandomIDForContent", () => {
      console.log('success callback!');
      this.setState({
        payments: [
          ...this.state.payments.slice(0, paymentIndex), {
            ...this.state.payments[paymentIndex],
            pending: false,
            paid: true,
            note: 'successfully paid'
          },
          ...this.state.payments.slice(paymentIndex + 1, this.state.payments.length)
        ]
      });
    }, (reasonCode) => {
      console.log('failure callback!', reasonCode);
      this.setState({
        payments: [
          ...this.state.payments.slice(0, paymentIndex), {
            ...this.state.payments[paymentIndex],
            pending: false,
            paid: false,
            note: reasonCode
          },
          ...this.state.payments.slice(paymentIndex + 1, this.state.payments.length)
        ]
      });
    });
  }

  render() {
    return (<div className="App">
      <h3>Payments</h3>
      <ul>
        {
          this.state.payments.map((p, i) => (<li key={i}>
            <div>
              {
                `Payment amount: ${p.amount} tinybars | Status: ${p.paid
                  ? 'PAID'
                  : p.pending
                    ? 'PROCESSING'
                    : 'UNPAID'}${p.note !== ''
                      ? (' | ' + p.note)
                      : ''}`
              }
            </div>
            {!p.pending && !p.paid && <button onClick={this.handlePayment.bind(this, p.amount, p.memo, i)}>Pay Now</button>}
          </li>))
        }

      </ul>
      {this.state.payments.length === 0 && <h4><i>Add payment first</i></h4>}
      <form onSubmit={this.handleAddPayment.bind(this)}>
        <input required="required" placeholder="Amount in tinybars"/>
        <input required="required" placeholder="Memo"/>
        <button type="submit">ADD</button>
      </form>

    </div>);
  }
}

export default App;
