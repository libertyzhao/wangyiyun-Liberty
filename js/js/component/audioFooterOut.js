
import React from 'react';
import { Link } from 'react-router';
import {iconImg,comeFrom,audioControllerAction} from '../config/config.js';
import { connect } from 'react-redux';
import {formatText} from '../utils/tool.js';
import {audioController,changePosition,changeAudioFooterOutMusicList,changeImgLoad} from '../redux/action.js';
import '../../css/component/audioFooterOut.css';

//<Link to='music' className='link' />

class AudioFooterOut extends React.Component{
    render(){
        let {
            audioController,startOrStop,author,title,pic_big_clone,changePosition,audioFooterOutDisplay,progressStyle,changeAudioFooterOutMusicList
            } = this.props;
        return (
            <footer className={`AudioFooterOut ${audioFooterOutDisplay}`}  >
                <div className="main" >
                    <a className='link' onClick={changePosition.bind(this,comeFrom.music)}></a>
                    <div className="iconContainner" >
                        <img className="liImg z10" onClick={changeAudioFooterOutMusicList}  src={iconImg.outLeft} alt="音乐列表"/>
                        <img className="liImg z10" onClick={audioController.bind(null,audioControllerAction.play_pause)}  src={startOrStop} alt="播放/暂停"/>
                        <img className="liImg z10" onClick={audioController.bind(null,audioControllerAction.next)}  src={iconImg.outRight} alt="下一曲"/>
                    </div>
                    <div className="imgCon">
                        <img className="img" onError={changeImgLoad.bind(null,false)} onLoadedData ={changeImgLoad.bind(null,false)} src={pic_big_clone} />
                    </div>
                    <div className="text" >
                        <span className="textMusicName" >{formatText(title)}</span>
                        <br />
                        <span className="textSinger" >{formatText(author)}</span>
                    </div>
                </div>
                <div className="progress" style={progressStyle} >
                </div>
            </footer>
        );
    }
}

const mapStateToProps = (state,ownProps) => {
    let {musicState,currentTime} = state.AudioController,
        {author,title,pic_big_clone,pic_big,success,file_duration} = state.musicPlay,
        {audioFooterOutDisplay,position} = state.RenderPage,
        {playing} = state.localData,
        startOrStop = musicState == audioControllerAction.play ? iconImg.outStop : iconImg.outStart,
        precent = (1-parseInt(currentTime)/parseInt(file_duration))*100+'%',
        progressStyle = {transform: `translate(-${precent},0)`};
    playing.length == 0 ? audioFooterOutDisplay = 'none' : '';
    //pic_big == '' ? '' : pic_big_clone = pic_big;//ddddddd
    return {
        startOrStop,title,author,pic_big_clone,audioFooterOutDisplay,progressStyle
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        audioController:(action,e) => dispatch(audioController(e,action)),
        changePosition:(position) => dispatch(changePosition(position)),
        changeAudioFooterOutMusicList:() => dispatch(changeAudioFooterOutMusicList()),
        changeImgLoad:(bool) => dispatch(changeImgLoad(bool))
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(AudioFooterOut);