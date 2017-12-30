/**
 * 音乐列表面板
 */

import React from 'react';
import Header from '../component/header.js';
import Swiper from '../utils/Swiper.js';
import RecommendList from '../component/recommendList.js';
import {carouselFigureImg} from '../config/config.js';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export default class MainPanel extends React.Component{
    render(){
        return (
            <article className="MainPanel height100" >
                <Header />
                {this.props.children}
            </article>

        );
    }
}
//
//const mapStateToProps= (state,ownProps) => {
//
//    return {
//    };
//}
//const mapDispatchToProps = (dispatch,ownProps) => {
//    return {
//    };
//}
//
//export default connect(mapStateToProps,mapDispatchToProps)(MainPanel);

