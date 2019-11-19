import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import configureStore from './redux/store';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import '@clr/ui/clr-ui.min.css';
import '@clr/icons/clr-icons.min.css';
import '@webcomponents/custom-elements/custom-elements.min.js';
import '@clr/icons/clr-icons.min.js';

const store = configureStore();

const rootElement = document.getElementById('root');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
