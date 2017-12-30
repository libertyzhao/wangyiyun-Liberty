import React from 'react';
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Route from './router/route.js';
import '../css/common.css';

let root = document.getElementById('root');

ReactDOM.render(
    <Provider store = {store}>
        <Route/>
    </Provider>
    ,root
);
