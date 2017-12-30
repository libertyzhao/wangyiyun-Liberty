import React from 'react';
import "../../css/component/progressCon.css";
import { timeFormat } from '../utils/tool.js';
import Progress from '../component/progress.js';
import {changeProgress,pushIndexTarget,touchendCurrentTime} from '../redux/action.js';
import {connect} from 'react-redux';

class ProgressCon extends React.Component{
    render(){
        let {file_duration,currentTime,progressStyle,changeProgress,audio,pushIndexTarget,timeFormat_curTime,touchendCurrentTime} = this.props;
        return (
            <div className="progress">
                <span className="time start">{timeFormat_curTime}</span>
                <div className='progressCon'>
                    <Progress progressStyle={progressStyle} onTouchEnd={touchendCurrentTime.bind(this,audio,currentTime)}  onTouchStart={pushIndexTarget}  onTouchMove={changeProgress.bind(this,audio)} />
                </div>
                <span className="time end">{file_duration}</span>
            </div>
        );
    }
}

const mapStateToProps = (state,ownProps)=>{
    let {file_duration} = state.musicPlay,
        {currentTime,audio} = state.AudioController,
        precent = (1-parseInt(currentTime)/parseInt(file_duration))*100+'%',
        progressStyle = {transform: `translate(-${precent},0)`},
        timeFormat_curTime = timeFormat(currentTime);

    file_duration = timeFormat(file_duration);
    return {file_duration,currentTime,progressStyle,audio,timeFormat_curTime};
}
const mapDispatchToProps = (dispatch,ownProps)=>{
    return {
        changeProgress:(audio,e) => dispatch(changeProgress(audio,e)),
        pushIndexTarget:(e) => dispatch(pushIndexTarget(e)),
        touchendCurrentTime:(audio,currentTime) => dispatch(touchendCurrentTime(audio,currentTime))
    };
}
export default connect(mapStateToProps,mapDispatchToProps)(ProgressCon);