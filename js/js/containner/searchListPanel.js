import React from 'react';
import SearchHeader from '../component/searchHeader.js';
import MusicList from '../component/musicList.js';
import {comeFrom} from '../config/config.js';
import { connect } from 'react-redux';
import {changeSongChooseDisplay} from '../redux/action.js'
import '../../css/containner/searchListPanel.css'

class SearchListPanel extends React.Component{
    render(){
        let {musicListDisplay,isFetching,move} = this.props;
        return (
            <article className="searchListPanel" >
                <SearchHeader />
                <span className={`best ${musicListDisplay}`}  >最佳匹配</span>
                <div className={`loading ${isFetching}`}>
                    <div className={`animation ${move}`}></div>
                    <span>努力加载中...</span>
                </div>
                <MusicList />
            </article>
        );
    }
}

const mapStateToProps = (state,ownProps) => {

    let {musicListDisplay} = state.RenderPage,
        {isFetching} = state.keywordSearchList,
        move = '';
    isFetching ? move = 'move': isFetching = 'none';//如果是正在加载，就给上动画

    return {
        musicListDisplay,isFetching,move
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {

    }
};
export default connect(mapStateToProps,mapDispatchToProps)(SearchListPanel);