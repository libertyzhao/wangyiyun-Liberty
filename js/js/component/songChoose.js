import React from 'react';
import {iconImg,comeFrom} from '../config/config.js';
import {connect} from 'react-redux';
import {formatText} from '../utils/tool.js';
import {addNext,toSearchByQuery,deleteMusicBySong_id} from '../redux/action.js'
import '../../css/component/SongChoose.css';

class SongChoose extends React.Component{
    touchMove(e){
        e.preventDefault();
    }
    render(){
        let { songChooseDisplay,songChooseFillData,addNext,toSearchByQuery,deleteMusicBySong_id,deleteDisplay } = this.props;
        return (
            <section className={`songChoose ${songChooseDisplay}`} onTouchMove={this.touchMove.bind(this)} onWheel={this.touchMove.bind(this)}>
                <div className='listTitle'>
                    <span className='text'>歌曲： {songChooseFillData.title}</span>
                </div>
                <ul className='listCon'>
                    <li className='dis_flex single' onClick={addNext.bind(null,songChooseFillData)}>
                        <img className='iconImg' src={iconImg.next} alt="" />
                        <div className='flex1 borderBottom imp_text'>
                            <span>下一首播放</span>
                        </div>
                    </li>
                    <li className='dis_flex single'>
                        <img className='iconImg' src={iconImg.collect} alt="" />
                        <div className='flex1 borderBottom imp_text'>
                            <span>收藏到歌单</span>
                        </div>
                    </li>
                    <li className={`dis_flex single ${deleteDisplay}`} onClick={deleteMusicBySong_id.bind(null,songChooseFillData.song_id)}>
                        <img className='iconImg' src={iconImg.delete} alt="" />
                        <div className='flex1 borderBottom imp_text'>
                            <span>删除</span>
                        </div>
                    </li>
                    <li className='dis_flex single' onClick={toSearchByQuery.bind(null,songChooseFillData.author)}>
                        <img className='iconImg' src={iconImg.author} alt="" />
                        <div className='flex1 borderBottom imp_text'>
                            <span>歌手: {formatText(songChooseFillData.author)}</span>
                        </div>
                    </li>
                    <li className='dis_flex single' onClick={toSearchByQuery.bind(null,songChooseFillData.album_title)}>
                        <img className='iconImg' src={iconImg.album} alt="" />
                        <div className='flex1 borderBottom imp_text'>
                            <span>专辑: {songChooseFillData.album_title}</span>
                        </div>
                    </li>
                </ul>
            </section>
        )
    }
}
const mapStateToProps = (state,ownProps) => {
    let {songChooseDisplay,songChooseFillData} = state.RenderPage,
        deleteDisplay = '';
    songChooseDisplay == false ? songChooseDisplay = '' : songChooseDisplay ='translate0';

    if(location.hash.indexOf('search') != -1){
        deleteDisplay = 'none';
    }
    return {
        songChooseDisplay,songChooseFillData,deleteDisplay
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        addNext:(data) => dispatch(addNext(data)),
        toSearchByQuery:(query) => dispatch(toSearchByQuery(query)),
        deleteMusicBySong_id:(song_id) => dispatch(deleteMusicBySong_id(song_id,comeFrom.history))
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(SongChoose);