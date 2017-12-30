/**
 * 推荐歌单面板
 */

import React from 'react';
import '../../css/component/recommendList.css';
import {connect} from 'react-redux';
import {recommendImg} from '../config/config.js';

const src = './js/img/center.png';


class RecommendList extends React.Component{
    render(){
        let {RecommendListClass} = this.props,
            imgList = [];
        recommendImg.forEach((data,index)=>{
            imgList.push(
                <li className='recImg' key={index}>
                    <img className='' src={data.src} width="100%" />
                    <div className="recText">{data.text}</div>
                </li>
            )
        });
        return (
            <article className={`recommendList ${RecommendListClass}`}>
                <section className='dis_flex' >
                    <img src={src} width="100%" height="100%" />
                </section>
                <section className='musicRecommend'>
                    <div className='title' >
                        <span className="iconCom"></span>
                        <span>推荐歌单</span>
                    </div>
                    <ul className="c recImgCon">
                        {imgList}
                    </ul>
                </section>
            </article>
        )
    }
}

const mapStateToProps = (state,ownProps)=> {
    let {audioFooterOutDisplay} = state.RenderPage,
        RecommendListClass = '';
    audioFooterOutDisplay == 'none' ? '' : RecommendListClass = 'marginBottom2';
    return {
        RecommendListClass
    }
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return {

    }
}
export default connect(mapStateToProps,mapDispatchToProps)(RecommendList)







