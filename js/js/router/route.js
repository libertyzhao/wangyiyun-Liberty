import React from 'react';
import {Router,Route,IndexRoute,IndexRedirect,hashHistory} from 'react-router';
import { createHashHistory } from 'history';
import {routeTo} from '../config/config.js';
import Panel from '../containner/Panel.js';
import MainPanel from '../containner/mainPanel.js';
import SecondPage from '../containner/secondPage.js';
import AudioFooterOut from '../component/audioFooterOut.js';
//import MusicPanel from '../containner/musicPanle.js';
//import SearchListPanel from '../containner/SearchListPanel.js';
//import FirstPage from '../containner/firstPage.js';

//按需加载模块
let SearchListPanel = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('../containner/SearchListPanel.js').default);
    },'SearchListPanel');
};
let HistoryPanel = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('../containner/HistoryPanel.js').default);
    },'HistoryPanel');
};
let FirstPage = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('../containner/FirstPage.js').default);
    },'FirstPage');
};
let ThirdPage = (location,cb) => {
    require.ensure([],require => {
        cb(null,require('../containner/ThirdPage.js').default);
    },'ThirdPage');
};

const routes = (
    <Route path={routeTo.home} component={Panel}>
        <IndexRedirect to={`/${routeTo.secondPage}`} />
        <Route  path={`/${routeTo.secondPage}`} component={MainPanel} >
            <IndexRoute component={SecondPage} />
            <Route path={`/${routeTo.firstPage}`} getComponent={FirstPage}/>
            <Route path={`/${routeTo.thirdPage}`} getComponent={ThirdPage}/>
        </Route >
        <Route path={`/${routeTo.historyMusic}`} getComponent={HistoryPanel}/>
        <Route path={`/${routeTo.search}`} getComponent={SearchListPanel}/>
    </Route>
);

export default class RouteRoot extends React.Component{
    render(){
        return <Router history={hashHistory} routes={routes}/>;
    }
};
