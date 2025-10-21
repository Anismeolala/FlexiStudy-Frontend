import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { App as AntdApp } from "antd";
import store from "./redux/store";
import "antd/dist/reset.css";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AntdApp>
  <Provider store={store}>
    <App />
  </Provider>
  </AntdApp>
);
