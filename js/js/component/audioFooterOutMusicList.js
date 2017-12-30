import React from 'react';
import {iconImg,comeFrom} from '../config/config.js';
import {connect} from 'react-redux';
import Scroll from 'reactjs-scroll';
import {playSong,savePlayingIndex,deleteMusicBySong_id,changeDialogDisplay} from '../redux/action.js';
import {solveScrollBug,formatText} from '../utils/tool.js';
import '../../css/component/audioFooterOutMusicList.css';

class AudioFooterOutMusicList extends React.Component{
    componentDidUpdate(){
        solveScrollBug();//解决删除最底部正在播放列表中的歌曲，但是被删除的位置直接留白情况
    }
    render(){
        let { audioFooterOutMusicListDisplay,playing,playSong,song_id,savePlayingIndex,deleteMusicBySong_id,changeDialogDisplay } = this.props,
            props = {
                scrollBar:false,
                maxAmplitude:0,
                deceleration: 0.015,
                scrollSpeed: 5,
                durationSpeed: 1
            },
            colorClass;
        return (
            <section className={`audioFooterOutMusicList ${audioFooterOutMusicListDisplay}`}>
                <div className='listTitle'>
                    <span className='text'>收藏全部</span>
                    <span className='imp_text flex1'>播放列表 ({playing.length})</span>
                    <span className='text' onClick={changeDialogDisplay}>清空</span>
                </div>
                <div id='wrapper' className='ulCon flex1'>
                    <Scroll {...props} >
                    <ul className='listCon'>
                    {
                        playing.map((data,index) => {
                            colorClass = '';
                            song_id == data.song_id ? colorClass='color' : ''
                            return (
                                <li key={index} data-index={index} className='dis_flex single' onClick={playSong.bind(null,data,comeFrom.playing)}>
                                    { song_id == data.song_id ? <img className='sound' src={iconImg.sound} onLoad={savePlayingIndex.bind(null,index)} alt="" /> : ''}
                                    <div className='flex1'>
                                        <span className={`imp_text ${colorClass}`}>{formatText(data.title)}</span>
                                        <span className={`text ${colorClass}`}>- {formatText(data.author)}</span>
                                    </div>
                                    <img className='cancle' src={iconImg.cancle} onClick={deleteMusicBySong_id.bind(null,data.song_id)} />
                                </li>
                            )
                        })
                    }
                    </ul>
                    </Scroll>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state,ownProps) => {
    let {audioFooterOutMusicListDisplay} = state.RenderPage,
        {playing,history} = state.localData,
        {song_id} = state.musicPlay;
    audioFooterOutMusicListDisplay == false ? audioFooterOutMusicListDisplay = '' : audioFooterOutMusicListDisplay ='translate0';

    return {
        audioFooterOutMusicListDisplay,playing,song_id
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        playSong:(data,from) => dispatch(playSong(data,from)),
        savePlayingIndex:(index) => dispatch(savePlayingIndex(index)),
        deleteMusicBySong_id:(song_id,e) => dispatch(deleteMusicBySong_id(song_id,comeFrom.playing,e)),
        changeDialogDisplay:() => dispatch(changeDialogDisplay('show',comeFrom.playing))
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(AudioFooterOutMusicList);