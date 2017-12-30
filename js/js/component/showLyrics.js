import React from 'react';
import VolProgress from '../component/volProgress.js';
import Progress from '../component/progress.js';
import { formatLrc } from '../utils/tool.js';
import { connect } from 'react-redux';
import {iconImg} from '../config/config.js';
import {changeVol,pushVolTarget,touchendVol} from '../redux/action.js';
import '../../css/component/showLyrics.css';

class ShowLyrics extends React.Component{
    render(){
        let {arrLyric,conStyle,display,progressStyle,progressBgStyle,circle,changeVol,volume,audio} = this.props;
        return (
            <div className={display}>
                <div className='volCon'>
                    <img className="vol" src={iconImg.vol} alt=""/>
                    <VolProgress progressStyle={progressStyle} progressBgStyle={progressBgStyle} circle={circle} onTouchMove={changeVol.bind(this,audio)}/>
                </div>
                <div className='ShowLyrics'>
                    <ul className='lyricsCon' style={conStyle}>{arrLyric}</ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state,ownProps) => {
    let { lyric,lrcIndex,changeLyrc } = state.musicPlay,
        { volume,audio} = state.AudioController,
        { isFetchingLyrics } = state.keywordSearchList,
        precent = (1-volume)*100+'%',
        arrLyric = [],
        conStyle = {transform:`translate(0,${8-lrcIndex*1.5}rem)`},
        display = changeLyrc==true ? '' : 'none',
        progressStyle = {'backgroundColor':'rgba(255, 255, 255, 0.6)',transform: `translate(-${precent},0)`},
        progressBgStyle = {'backgroundColor':'rgba(150,150,150, 0.698039)'},
        circle = {'width':'0.4rem','height':'0.4rem','right':'-0.4rem'};
    lyric.forEach(( item,index )=>{
        let active = (lrcIndex) == index ? 'active' : '',
            className = `aLyric ${active}`;
        arrLyric.push(<li className={className} key={index} data-time={item[0]}>{item[1]}</li>);
    });
    if(isFetchingLyrics){
        arrLyric = [<li key='0' className='isFetching'>加载歌词中...</li>];
    }
    return {
        arrLyric,conStyle,display,progressStyle,progressBgStyle,circle,volume,audio
    };
}
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        changeVol:(audio,e) => dispatch(changeVol(audio,e))
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ShowLyrics)