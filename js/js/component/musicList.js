import React from 'react';
import { timeFormat,formatText,getIndex } from '../utils/tool.js';
import {changeSongChooseDisplay,playSong} from '../redux/action.js';
import { connect } from 'react-redux';
import {iconImg,comeFrom,audioControllerAction} from '../config/config.js'
import '../../css/component/musicList.css';

class MusicList extends React.Component{
    render(){
        let {
            result,playSong,changeSongChooseDisplay
            } = this.props;
        return (
            <ul className="musicList">
                {
                    result.map((data,index)=>{
                        return ( 
                            <li key={index} className="singerMusicCon" onClick={playSong.bind(null,data,audioControllerAction.newMusic)}>
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
        );
    }
}
const mapStateToProps = (state,ownProps) => {
    let {result} = state.keywordSearchList;
    return {
        result
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        playSong:(data) => dispatch(playSong(data,comeFrom.search)),
        changeSongChooseDisplay: (data,e) => dispatch(changeSongChooseDisplay(e,data))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(MusicList);