import React from 'react';
import { timeFormat,formatText,getIndex } from '../utils/tool.js';
import {iconImg} from '../config/config.js';
import { connect } from 'react-redux';
import {playSong,playHistoryAll,changeSongChooseDisplay} from '../redux/action.js'
import '../../css/component/historyMusicList.css';

class HistoryMusicList extends React.Component{
    render(){
        let {
            playSong,playAllClass,history,songImgDisplay,playHistoryAll,changeSongChooseDisplay,song_id,historyMusicListClass
            } = this.props;
        return (
            <div className={`historyMusicList ${historyMusicListClass}`}>
                <div className={`singerMusicTitle ${playAllClass}`} onClick={playHistoryAll} >
                    <img className='historyPlay' src={iconImg.historyPlay} alt="" />
                    <span className='musicName'>播放全部<span className='number'>( {history.length} )</span></span>
                </div>
                <ul className='musicListUl'>
                {
                    history.map((data,index)=>{
                        return (
                            <li key={index} className="singerMusicCon" onClick={playSong.bind(null,data,'history')}>
                                {song_id == data.song_id && songImgDisplay ? <img className='historyPlay' src={iconImg.sound} alt="" /> : ''}
                                <div className='flex1'>
                                    <span className="musicName textOverflow">{formatText(data.title)}</span>
                                    <br />
                                    <span className="musicAuthor textOverflow">{formatText(data.author)} - {formatText(data.album_title)}</span>
                                </div>
                                <img className='chooseImg' onClick={changeSongChooseDisplay.bind(null,data)} src={iconImg.choose}/>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
        );
    }
}
const mapStateToProps = (state,ownProps) => {

    let {history} = state.localData,
        {audioFooterOutDisplay} = state.RenderPage,
        {song_id} = state.musicPlay,
        playAllClass = '',
        songImgDisplay = true,
        historyMusicListClass = '';
    audioFooterOutDisplay == 'none' ? songImgDisplay = false : '';
    audioFooterOutDisplay == 'none' ? '' : historyMusicListClass = 'marginBottom2';
    history.length > 0 ? '' : playAllClass = 'none';
    return {
        history,playAllClass,songImgDisplay,song_id,historyMusicListClass
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        playSong:(data,from) => dispatch(playSong(data,from)),
        playHistoryAll:() => dispatch(playHistoryAll()),
        changeSongChooseDisplay: (data,e) => dispatch(changeSongChooseDisplay(e,data))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(HistoryMusicList);