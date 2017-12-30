import React from 'react';
import {iconImg} from '../config/config.js';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { routeTo } from '../config/config.js';
import '../../css/component/historyPlay.css';

class HistoryPlay extends React.Component{
    render(){
        let {songImgDisplay,history} = this.props;
        return (
            <ul className='historyPlay marginTop23'>
                <li className='liNav'>
                    <img className='liHistory' src={iconImg.mobile} />
                    <div className="text">
                        <div className='flex1'>本地音乐<span className='number'>( {history.length} )</span></div>
                        <img className='liSound'  />
                    </div>
                </li>
                <li className='liNav'>
                    <Link to={routeTo.historyMusic} className='link' />
                    <img className='liHistory' src={iconImg.history} />
                    <div className="text">
                        <div className='flex1'>最近播放<span className='number'>( {history.length} )</span></div>
                        { songImgDisplay ? <img className='liSound'  src={iconImg.sound}/> : ''}
                    </div>
                </li>
            </ul>
        );
    }
}
const mapStateToProps = (state,ownProps) => {

    let {audioFooterOutDisplay} = state.RenderPage,
        {history} = state.localData,
        songImgDisplay = true;
    audioFooterOutDisplay == 'none' ? songImgDisplay = false : '';
    return {
        songImgDisplay,history
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(HistoryPlay);