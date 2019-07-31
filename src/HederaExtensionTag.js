import React from "react";
import PropTypes from "prop-types";

export default class HederaExtensionTag extends React.Component {
  componentDidMount() {
    // do nothing
    if (this.props.type !== "maximum") {
      setTimeout(() => {
        window.location.href =
          window.location.origin +
          "/hedera-process-payment?status=SUCCESS&id=" +
          this.props.sessionId;
      }, 6500); // assume success after 6.5 seconds
    }
  }

  render() {
    return (
      <hedera-micropayment
        data-submissionnode={randomiseSubmissionNode()}
        data-paymentserver="https://mps.dailytimestamp.com"
        data-recipientlist={`[{ "to": "${this.props.recipient}", "tinybars": "${
          this.props.amount
        }" }]`}
        data-type={this.props.type}
        data-memo={this.props.memo}
        data-extensionid="ligpaondaabclfigagcifobaelemiena"
        data-contentid={this.props.contentId}
        data-redirect={
          '{ "nonPayingAccount": "' +
          this.props.pathname +
          "?status=NON_PAYING_ACCOUNT&id=" +
          this.props.sessionId +
          '", "noAccount": "' +
          this.props.pathname +
          "?status=NO_ACCOUNT&id=" +
          this.props.sessionId +
          '", "homePage": "' +
          this.props.pathname +
          "?status=HOME_PAGE&id=" +
          this.props.sessionId +
          '"}'
        }
        data-time={(new Date() / 1e3) | 0}
      />
    );
  }
} //TODO investigate where HOME_PAGE is used

const randomiseSubmissionNode = () => {
  return "0.0." + (Math.floor(Math.random() * 9) + 3);
};

HederaExtensionTag.propTypes = {
  type: PropTypes.oneOf(["maximum", "article", "video"]).isRequired,
  recipient: PropTypes.string.isRequired,
  memo: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  contentId: PropTypes.string,
  sessionId: PropTypes.string,
  pathname: PropTypes.string.isRequired
};
