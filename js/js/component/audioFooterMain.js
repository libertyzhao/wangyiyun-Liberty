/**
 * 音乐面板底部
 */

import React from 'react';

import ProgressCon from './progressCon.js';
import {iconImg,audioControllerAction} from '../config/config.js';
import {connect} from 'react-redux';
import {audioController,changeMode,changeAudioFooterOutMusicList} from '../redux/action.js';
import "../../css/component/audioFooterMain.css";

class AudioFooterMain extends React.Component{
    render(){
        let {startOrStop,audioController,mode,changeMode,changeAudioFooterOutMusicList} = this.props;
        return (
            <div className="audioFooterMain">
                <ProgressCon />
                <div className="iconCon">
                    <img className="s1 left5" onClick={changeMode} src={iconImg.mode[mode]} alt=""/>
                    <img className="s2" onClick={audioController.bind(null,audioControllerAction.pre)} src={iconImg.inLeft} alt=""/>
                    <img className="s3" onClick={audioController.bind(null,audioControllerAction.play_pause)} src={startOrStop} alt=""/>
                    <img className="s2" onClick={audioController.bind(null,audioControllerAction.next)} src={iconImg.inRight} alt=""/>
                    <img className="s1 right5" onClick={changeAudioFooterOutMusicList} src={iconImg.inMusicList} alt="音乐列表"/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state,ownProps) =>{
    let {musicState} = state.AudioController,
        {mode} = state.localData,
        startOrStop = musicState == audioControllerAction.play ? iconImg.inStop : iconImg.inStart;
    return {
        startOrStop,mode
    }
};
const mapDispatchToProps = (dispatch,ownProps) =>{
    return {
        audioController:(action,e) => dispatch(audioController(e,action)),
        changeMode:(e) => dispatch(changeMode(e)),
        changeAudioFooterOutMusicList:(e) => dispatch(changeAudioFooterOutMusicList(e))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(AudioFooterMain);

