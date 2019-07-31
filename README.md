# Hedera React Micropayments Widget

A React component to facilitate Hedera micropayments via the Hedera Chrome extension.

## What is Hedera Hashgraph?
Hedera is a decentralized public network that utiltizes the Hashgraph consensus algorithm to overcome the traditional limitations of blockchain and allow one to create next era of fast, fair, and secure applications.

## Including the widget in your project

```
npm install @rossconsulting/hedera-react-micropayment-plugin
```

And import the component, and its optional provided styling, as follows:

```jsx
import HederaMicropayment from '@rossconsulting/hedera-react-micropayment-plugin'
import '@rossconsulting/hedera-react-micropayment-plugin/css/index.css'
```

## Usage

The widget injects a `payWithHedera` function as a prop to the component that it wraps. 

`payWithHedera` is called with the payment details, a success callback and a failure callback. 

Do note that the payment is handled in a new page (default pathname `[origin]/hedera-process-payment`) which self closes once done.

### Configuring the widget

The widget must wrap your main component as it will handle the rendering for the popup page. The widget requires only the `maximumAmount` prop to ask for expense approval from the user. An optional `popupPath` can be supplied  - this is used by the popup page to process payment. The `popupPath` route must be controlled by the widget only.

`HederaMicropayment` can only have one child.

```jsx
<HederaMicropayment maximumAmount="100000" popupPath="/hedera-process-payment">
  <App/>
</HederaMicropayment>
```

Once this is done, you will have 2 methods available as props in your application:
-   `payWithHedera`
-   `askForApproval` (available but implementation not complete)


#### payWithHedera (amount, recipient, memo, productId, successCallback, failureCallback)

- `amount`: Amount to be paid in tinybars
- `recipient`: Hedera account number of the recipient. (0.0.xxxx)
- `memo`: Memo to be included in the transaction
- `productId`: ID for product/service bought
- `successCallback`: Callback for success scenario.
- `failureCallback`: Callback for failure scenario. A reasonCode (string) is passed as parameter to this function.

Example call:

```jsx
this.props.payWithHedera(amount, "0.0.1742", "Hello Future!", "future007",
  () => {
    console.log('success callback!');
    this.setState({
      ...
    });
  },
  (reasonCode) => {
    console.log('failure callback!', reason);
    this.setState({
      ...
    });
  });
```

Failure Reason Code:
- `BLOCKED_POPUP`: Popup was blocked by the browser.
- `CANNOT_CONFIRM_PAYMENT`: User canceled/closed popup unexpectedly.
- `NO_ACCOUNT`: User is not currently logged in the Chrome widget.
- `INSUFFICIENT_AMOUNT`: Either insufficient amount in the user's wallet or the user didn't approve that payment amount.

### askForApproval(maxAmount)

Not implemented yet - Use to ask the user for a new maximum amount threshold.

### detectPlugin()

A function is also available in HederaMicropayment to check for the Hedera Chrome Brower Extension. It returns a `Promise`.

```jsx
import {detectPlugin} from 'HederaMicropayment';

detectPlugin().then(r => {
  this.setState({hasPlugin: true});
}).catch(e => {
  this.setState({hasPlugin: false});
});
```

## Contributing to this Project

We welcome participation from all developers!

For instructions on how to contribute to this repo, please review the [Contributing Guide](CONTRIBUTING.md).

## License Information

Licensed under Apache License,Version 2.0 – see [LICENSE](LICENSE) in this repo or [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).


# Installation of tooling

1. Install `phantomjs` yourself via your OS package manager, since it fails via NPM dependency
2. Install `nwb` with `sudo npm i -g --unsafe-perm nwb`
3. Now you can run the `npm` commands in `package.json` (e.g. `npm run build`)

# TODOs

1. How to bundle images (`hbar-icon-white.png`) with this module?