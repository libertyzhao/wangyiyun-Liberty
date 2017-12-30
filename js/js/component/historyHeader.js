import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { routeTo,comeFrom } from '../config/config.js';
import {changeDialogDisplay} from '../redux/action.js'
import '../../css/component/historyHeader.css'

class HistoryHeader extends React.Component{
    render(){
        let {changeDialogDisplay} = this.props;
        return (
            <header className="historyHeader">
                <div className="iconSize leftArrow" ><Link to={routeTo.home} className='link' /></div>
                <div className="con" >
                    <span className="leftLabel flex1">最近播放</span>
                    <span className="rightLabel"  onClick={changeDialogDisplay} >清空</span>
                </div>
            </header>
        );
    }
}

const mapStateToProps= (state,ownProps) => {
    return {
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        changeDialogDisplay:() => dispatch(changeDialogDisplay('show',comeFrom.history))
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(HistoryHeader);