import { createStore,combineReducers,applyMiddleware,compose } from 'redux';
import * as reducers from './reducers.js';
import thunk from 'redux-thunk';//改造store.dispatch，使它可以接受回调函数作为参数

var store = createStore(
    combineReducers(reducers),//将多个reducer方法合并成一个，即一个switch分支
    applyMiddleware(thunk)//将多个中间件按顺序执行
);

export default store;