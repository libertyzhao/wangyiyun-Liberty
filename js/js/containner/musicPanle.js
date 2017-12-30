/**
 * 音乐面板
 */

import React from 'react';
import {connect} from 'react-redux';
import AudioHeader from '../component/AudioHeader.js';
import ShowImgsing from '../component/showImgsing.js';
import AudioFooterMain from '../component/audioFooterMain.js';
import ShowLyrics from '../component/showLyrics.js';
import {changePosition,changeLyrcP,changeSongChooseDisplay} from '../redux/action.js';
import '../../css/containner/musicPanle.css';
import {iconImg,img_animationTime} from '../config/config.js';


class MusicPanle extends React.Component{
    render(){
        let {
            pic_big0,pic_big1,sing,MusicPanleDisplay,changePosition,changeLyrcP,pic_0_Style,pic_1_Style
            } = this.props;
        return (
            <article className="MusicPanle" style={MusicPanleDisplay} onClick={changeLyrcP}>
                <div className="musicBgCon">
                    <img className="musicBg zindex1" src={pic_big0} style={pic_0_Style} />
                    <img className="musicBg zindex2" src={pic_big1} style={pic_1_Style}/>
                </div>
                <div className="musicContain">
                    <AudioHeader sing={sing} changePosition={changePosition.bind(this,'main')} />
                    <ShowImgsing />
                    <ShowLyrics />
                    <AudioFooterMain />
                </div>
            </article>
        );
    }
}
//animat
const mapStateToProps = (state,ownProps) => {
    let { pic_big,before_pic_big,pre_pic_big,author,title,img_animation,song_id,pic_big_clone } = state.musicPlay,
        { position } = state.RenderPage,
        { musicState } = state.AudioController,
        sing = {
            textMusicName:title,
            textSinger:author
        },
        MusicPanleDisplay = position == 'music' ? {'transform':'translateX(0)'} : {},
        pic_0_Style = {},
        pic_1_Style = {},
        pic_big0 = before_pic_big,
        pic_big1 = pic_big;
    pic_big1 == '' ? pic_big1 = pic_big_clone : '';
    pic_big0 == '' ? pic_big0 = pre_pic_big : '';
    if(img_animation){ //淡入淡出
        pic_big0 = pic_big;
        pic_big1 = before_pic_big;
        pic_0_Style = {};
        pic_1_Style = {opacity:'0',transition: img_animationTime/1000+'s'};
    }

    return {
        sing,pic_big0,pic_big1,MusicPanleDisplay,pic_0_Style,pic_1_Style
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        changePosition:(position,e) => dispatch(changePosition(position,e)),
        changeLyrcP:() => dispatch(changeLyrcP())
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(MusicPanle);

