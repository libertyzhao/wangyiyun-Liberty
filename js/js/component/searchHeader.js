/**
 * 音乐列表面板中的
 */

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {fetchSongsByQuery} from '../redux/action.js'
import {iconImg,routeTo} from '../config/config.js';
import '../../css/component/searchHeader.css'

class SearchHeader extends React.Component{
    _searchSongsByQuery(){
        this.props.searchSongsByQuery(this.refs.searchInput.value);
    }

    render(){
        let {searchSongsByQuery,keyword} = this.props;
        return (
            <header className="searchHeader">
                <div className="iconSize leftArrow" ><Link to={routeTo.home} className='link' /></div>
                <div className="con" >
                    <input ref="searchInput" className="searchInput" type="search" placeholder="搜索音乐、歌手" defaultValue={keyword}/>
                    <img className="iconSize" src={iconImg.search} alt="搜索歌曲" onClick={this._searchSongsByQuery.bind(this)}/>
                </div>
            </header>
        );
    }
}

const mapStateToProps= (state,ownProps) => {
    let {keyword} = state.keywordSearchList;
    return {
        keyword
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        searchSongsByQuery: (keyword) => dispatch(fetchSongsByQuery(keyword))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(SearchHeader);