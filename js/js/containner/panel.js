import React from 'react';
import MainPanel from './mainPanel.js';
import MusicPanel from './musicPanle.js';
import SearchListPanel from './SearchListPanel.js';
import {audioControllerAction} from '../config/config.js';
import { connect } from 'react-redux';
import {passonAudioa,checkNet,pushCurrentTime,audioController,changeBg,domLoaded,playOrPause,changeMainPage,changeDialogDisplay,clearMusicList} from '../redux/action.js';
import AudioFooterOut from '../component/audioFooterOut.js';
import AudioFooterOutMusicList from '../component/audioFooterOutMusicList.js';
import SongChoose from '../component/songChoose.js';
import '../../css/containner/panel.css';


class Panel extends React.Component{
    playMusic(musicState){
        this.refs.audioPlay.play();
        this.refs.audioPlay.pause();
    }
    componentDidMount(){
        this.props.paseonAudio(this.refs.audioPlay);
        this.props.domLoaded();
        let route = location.hash;
        if(route.indexOf('firstPage') != -1){
            this.props.changeMainPage(1);
        }else if(route.indexOf('secondPage') != -1){
            this.props.changeMainPage(2);
        }else if(route.indexOf('thirdPage') != -1){
            this.props.changeMainPage(3);
        }
    }
    touchMove(e){
        e.preventDefault();
    }
    render(){
        let {
            song_url,mainClass,musicState,pushCurrentTime,touch,audioController,bgDisplay,changeBg,domLoaded,playOrPause,dialogDisplay,changeDialogDisplay,clearMusicList,targetArr,floatInfoClass,floatInfoText
            } = this.props;
        touch == 'end' ? '' : pushCurrentTime = ()=>{};
        return (
            <div className="panel height100" onClick={this.playMusic.bind(this,musicState)}>
                <div className={`dialog ${dialogDisplay}`}>
                    <div className='dialog_title'>清空当前播放列表?</div>
                    <div className='dialog_choose'>
                        <span className='dialog_choose_item' onClick={changeDialogDisplay}>取消</span>
                        <span className='dialog_choose_item' onClick={clearMusicList.bind(null,targetArr)}>清空</span>
                    </div>
                </div>
                <div className={`floatInfo ${floatInfoClass}`}>
                    {floatInfoText}
                </div>
                <div className={`bg ${bgDisplay}`} onClick={changeBg} onTouchMove={this.touchMove.bind(this)} onWheel={this.touchMove.bind(this)}></div>
                <div className={`dialog_bg bg ${dialogDisplay}`} onClick={changeDialogDisplay} onTouchMove={this.touchMove.bind(this)} onWheel={this.touchMove.bind(this)}></div>
                <AudioFooterOutMusicList />
                <SongChoose />
                <div className={`height100 ${mainClass}`}>
                    {this.props.children}
                    <AudioFooterOut />
                    <audio src={song_url}  ref='audioPlay' onEnded={audioController.bind(null,audioControllerAction.end)} onTimeUpdate={pushCurrentTime} ></audio>
                </div>
                <MusicPanel />
            </div>
        );
    }
}
const mapStateToProps = (state,ownProps) => {
    let { song_url,netState,start } = state.musicPlay,
        { position,bgDisplay,isLocalData,dialogDisplay,targetArr,isClickMode } = state.RenderPage,
        { touch,musicState,audio } = state.AudioController,
        { mode } = state.localData,
        floatInfoClass = 'PNone',
        floatInfoText = '放松心情',
        mainClass = position != 'music' ? '' : 'animattion';
    bgDisplay == false ? bgDisplay = 'PNone' : bgDisplay ='';
    dialogDisplay == 'none' ? dialogDisplay = 'PNone' : dialogDisplay = '';
    //dialogDisplay == 'none' ? '' : bgDisplay+=' zindex';
    //start ? '': song_url = '';//即在点击播放之后，才上url,懒加载
    if( song_url != '' && audio.readyState == 4 && musicState == audioControllerAction.play ){
        audio.play();
    }
    song_url == '' ? song_url = './js/img/2.mp3' : '';

    //song_url != '' ? setTimeout(()=>{console.log(song_url); audio.play()},100) : ''; //play正在等待执行，却被中断
    if(!netState){
        floatInfoClass = '';
        if(isClickMode){
            if(mode == 0){ floatInfoText = '单曲循环' ;}
            else if(mode == 1){ floatInfoText = '随机播放' ;}
            else{ floatInfoText = '列表循环' ;}
        }else{ floatInfoText = '网速较慢' ;}
    }
    return {
        song_url,mainClass,touch,bgDisplay,dialogDisplay,targetArr,floatInfoClass,floatInfoText,musicState
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        paseonAudio:(audio) => dispatch(passonAudioa(audio)),
        pushCurrentTime:(e) => dispatch(pushCurrentTime(e)),
        audioController: (next) => dispatch(audioController(null,next)),
        changeBg:() => dispatch(changeBg()),
        domLoaded:() => dispatch(domLoaded()),
        playOrPause:() => dispatch(playOrPause(audioControllerAction.pause)),//处于pause状态,产生的效果是播放
        changeMainPage:(index) => dispatch(changeMainPage(index)),
        changeDialogDisplay:() => dispatch(changeDialogDisplay('none')),
        clearMusicList:(targetArr) => dispatch(clearMusicList(targetArr)),
        checkNet:() => dispatch(checkNet())

    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Panel);

