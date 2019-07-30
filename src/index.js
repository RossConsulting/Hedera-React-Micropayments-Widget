import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import HederaMicropayment from './HederaMicropayment';

ReactDOM.render(<HederaMicropayment maximumAmount="100000">
  <App/>
</HederaMicropayment>, document.getElementById('root'));
