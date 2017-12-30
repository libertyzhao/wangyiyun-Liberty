/**
 * 音乐面板中的头部
 */

import React from 'react';
import '../../css/component/audioHeader.css';
import  '../redux/reducers.js';
import {connect} from 'react-redux';
import {formatText} from '../utils/tool.js';
import {iconImg} from '../config/config.js';

export default class AudioHeader extends React.Component{
    render(){
        let {changePosition,sing} = this.props;
        return (
            <header className='AudioHeader' >
                <img className='img' src={iconImg.leftArrow} onClick={changePosition}/>
                <div className='text'>
                    <span className='textMusicName'>{formatText(sing.textMusicName)}</span>
                    <br />
                    <span className='textSinger'>{formatText(sing.textSinger)}</span>
                </div>
            </header>
        );
    }
}
