import React from 'react';
import HederaExtensionTag from './HederaExtensionTag';
import PropTypes from 'prop-types';
import hBarIcon from './hbar-icon-white.png';
import './HederaMicropayment.css';
import 'arrive';

class HederaMicropayment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasPlugin: false,
      isOnPopupPage: false,
      invalidRequest: false,
      handlingRedirect: false,
      processingPayment: false,
      paymentData: {}
    }
  }

  componentWillMount() {
    const popupPath = this.props.popupPath === undefined
      ? '/hedera-process-payment'
      : this.props.popupPath;
    if (window.location.pathname === popupPath) {
      var hasPlugin = localStorage.getItem('hederaChromePlugin') === 'true';
      var url = new URL(window.location.href);
      var id = url.searchParams.get("id");
      var status = url.searchParams.get("status");
      url.searchParams.delete("id");
      url.searchParams.delete("status");
      window.history.replaceState({}, document.title, url.href);
      if (id != null && status == null) {
        if (localStorage.getItem('hedera' + id) == null) {
          this.setState({isOnPopupPage: true, invalidRequest: true, hasPlugin});
          setTimeout(() => {
            window.close()
          }, 3000);
        } else {
          this.setState({
            hasPlugin,
            isOnPopupPage: true,
            sessionId: id,
            paymentData: JSON.parse(localStorage.getItem('hedera' + id))
          })
        }
      } else if (id != null && status != null) {
        // valid redirect
        this.setState({isOnPopupPage: true, invalidRequest: false, handlingRedirect: true, hasPlugin});
        if (status === 'SUCCESS') {
          localStorage.setItem('hedera' + id, JSON.stringify({paymentSuccessful: true, message: 'SUCCESS'}));
          window.close();
        } else if (status === 'NON_PAYING_ACCOUNT') {
          localStorage.setItem('hedera' + id, JSON.stringify({paymentSuccessful: false, message: 'INSUFFICIENT_AMOUNT'}));
          window.close();
        } else if (status === 'NO_ACCOUNT') {
          localStorage.setItem('hedera' + id, JSON.stringify({paymentSuccessful: false, message: 'NO_ACCOUNT'}));
          // NO ACCOUNT -> User not logged in
          window.close();
        } else if (status === 'HOME_PAGE') {
          localStorage.setItem('hedera' + id, JSON.stringify({paymentSuccessful: false, message: 'RAISE_THRESHOLD'}));
          // assumption -> this is used to when user hasn't approved spending.
          window.close();
        } else {
          // invalid status, mimicked redirect
          this.setState({isOnPopupPage: true, invalidRequest: true, hasPlugin});
          setTimeout(() => {
            window.close()
          }, 3000);
        }
      } else {
        // 2 cases here - in both cases id is null
        // 1. status not null : invalid redirect from payment page -- will not happen in by our redirect and param is hardcoded - most likely a user trying to mock yhis
        // 2. status is null: somebody tried to route to this page directly
        this.setState({isOnPopupPage: true, invalidRequest: true, hasPlugin});
        setTimeout(() => {
          window.close()
        }, 3000);
      }

    } else {
      detectPlugin().then(r => {
        this.setState({hasPlugin: true});
        localStorage.setItem('hederaChromePlugin', 'true');
      }).catch(e => {
        this.setState({hasPlugin: false});
        localStorage.setItem('hederaChromePlugin', 'false');
      });
    }
  }

  payWithHedera(amount, recipient, memo, productId, successCallback, failureCallback) {
    this.setState({processingPayment: true})
    const paramId = ([...Array(7)].map(_ => (Math.random() * 36 | 0).toString(36)).join ``) + new Date() / 1E3 | 0;
    const url = window.location.origin + (
      this.props.popupPath === undefined
      ? '/hedera-process-payment'
      : this.props.popupPath) + "?id=" + paramId;

    localStorage.setItem('hedera' + paramId, JSON.stringify({amount: amount, recipient: recipient, memo: memo, contentId: productId, type: 'article'}));

    let features = [];
    features.push(`width=600px`);
    features.push(`height=640px`);
    features.push(`left=${window.top.outerWidth / 2 + window.top.screenX - 600 / 2}`);
    features.push(`top=${window.top.outerWidth / 2 + window.top.screenY - 640 / 2}`);

    let newPopup = window.open(url, '_blank', features);

    if (newPopup) {
      newPopup.addEventListener('beforeunload', () => {
        // handle check payment mechanism here
        setTimeout(() => {
          this.setState({processingPayment: false});
          let response = JSON.parse(localStorage.getItem('hedera' + paramId));
          if (response.paymentSuccessful === undefined) {
            failureCallback("CANNOT_CONFIRM_PAYMENT"); // user canceled/closed popup erratically
          } else if (response.paymentSuccessful === true) {
            //
            successCallback();
          } else {
            failureCallback(response.message);
          }
        }, 2000);

      });
    } else {
      this.setState({processingPayment: false})
      failureCallback("BLOCKED_POPUP");
    }
  }

  askForApproval(maxAmount) {
    // use a pop to set the maximum amount threshold
    // use 'arrive'/'leave' from 'arrive' lib to check whether approve was clicked on (when message disappear)
    console.log(maxAmount);
  }

  componentDidMount() {
    document.arrive("#hedera-banner-wrapper", {
      existing: true
    }, () => {
      let s = document.getElementById("alert-string");
      let existing = s.innerHTML.replace("Daily Timestamp", "website");
      s.innerHTML = existing;
    });
  }

  render() {
    if (this.state.isOnPopupPage) {
      return (<div className='hedera-process-payment-popup'>
        {
          !this.state.invalidRequest && this.state.hasPlugin && !this.state.handlingRedirect && <> < HederaExtensionTag {
            ...this.state.paymentData
          }
          pathname = {
            this.props.popupPath === undefined
              ? '/hedera-process-payment'
              : this.props.popupPath
          }
          sessionId = {
            this.state.sessionId
          } />< div className = "hedera-waiting-image-wrapper-no-anim" > <img src={hBarIcon} alt='Hello future'/></div>
        <h4 style={{
            paddingTop: '1rem'
          }}>
          Sending payment.Do not close this page.Please wait ...</h4> < />
        }
        {
          !this.state.invalidRequest && this.state.hasPlugin && this.state.handlingRedirect && <> < div className = "hedera-waiting-image-wrapper-no-anim" > <img src={hBarIcon} alt='Hello future'/></div>
        <h4 style={{
            paddingTop: '1rem'
          }}>
          Processing payment.Do not close this page.Please wait ...</h4> < />}
        {this.state.invalidRequest && this.state.hasPlugin && <div>Payment data not found. Please try again. This page will close in 3 seconds.</div>}
        {!this.state.hasPlugin && <div>Chrome Hedera Browser Extension is required.</div>}
      </div>);
    }

    return (<> {
      this.state.processingPayment && <div className="hedera-waiting-modal">
          <div className="hedera-waiting-image-wrapper"><img src={hBarIcon} alt='Hello future'/></div>
          <h4 style={{
              paddingTop: '1rem'
            }}>
            Waiting for payment...
          </h4>
        </div>
    } < HederaExtensionTag recipient = "0.0.1742" amount = {
      this.props.maximumAmount
    }
    type = 'maximum' memo = "MAXIMUM" pathname = "/" /> {
      React.cloneElement(this.props.children, {
        payWithHedera: this.payWithHedera.bind(this),
        askForApproval: this.askForApproval.bind(this)
      })
    }</>);
  }
}

HederaMicropayment.propTypes = {
  children: PropTypes.element.isRequired,
  popupPath: PropTypes.string,
  maximumAmount: PropTypes.string.isRequired
}

export async function detectPlugin() {
  return await fetch('chrome-extension://ligpaondaabclfigagcifobaelemiena/icons/icon16.png');
}

export default HederaMicropayment;
