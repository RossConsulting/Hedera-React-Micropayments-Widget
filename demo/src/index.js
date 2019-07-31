import React, { Component } from "react";
import { render } from "react-dom";
import HederaMicropayment from "../../src";
import "../../css/index.css";
import App from "./App";

render(
  <HederaMicropayment maximumAmount="100000">
    <App />
  </HederaMicropayment>,
  document.querySelector("#demo")
);
