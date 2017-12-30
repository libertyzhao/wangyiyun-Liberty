import React from 'react';
import {iconImg} from '../config/config.js';
import '../../css/component/songSheet.css';

export default class SongSheet extends React.Component{
    render(){
        return (
            <div className='songSheet'>
                <div className='title padding8'><span className='titleText flex1'>创建的歌单( 23 )</span><img className=' titleChooseImg' src={iconImg.choose}/></div>
                <ul className='padding8'>
                    <li className='Songs'>
                        <div className='love'><img className='loveImg' src={iconImg.loveSong}/></div>
                        <div className="text flex1 height100" >
                            <div className="flex1">
                                <span className="textSongSheetName" >我喜欢的音乐</span>
                                <span className="songNum" >1首</span>
                            </div>
                            <img className='titleChooseImg' src={iconImg.choose}/>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}