/**
 * 唱片面板
 */

import React from 'react';
import '../../css/component/showImgsing.css';
import {iconImg,audioControllerAction,delayAndSwipTime} from '../config/config.js';
import {touchMoveMusicImg,touchStartMoveMusicImg,touchEndMoveMusicImg} from '../redux/action.js';
import {connect} from 'react-redux';


class ShowImgsing extends React.Component{
    render(){
        let {animationRotate,turn,pic_big,pre_pic_big,next_pic_big,display,touchMoveMusicImg,musicImgStyle,touchStartMoveMusicImg,touchEndMoveMusicImg} = this.props;
        return (
            <div className={`showImgsing ${display}`}>
                <div className="line"></div>
                <div className="soundsCon" style={turn}>
                    <img className="sounds" src="./js/img/ab6.png" />
                </div>
                <div className='musicImgCon c'  onTouchMove={touchMoveMusicImg} onTouchStart={touchStartMoveMusicImg} onTouchEnd={touchEndMoveMusicImg}  style={musicImgStyle}>
                    <div className='pof width100'>
                        <div className="musicDetailCon rotateImg" style={animationRotate}>
                            <div className="musicDetail" >
                                <img className='img' src={pic_big} />
                            </div>
                        </div>
                    </div>
                    <div className='poa left100 width100'>
                        <div className="musicDetailCon rotateImg" style={animationRotate}>
                            <div className="musicDetail" >
                                <img className='img' src={next_pic_big} />
                            </div>
                        </div>
                    </div>
                    <div className='poa right100 width100'>
                        <div className="musicDetailCon rotateImg" style={animationRotate}>
                            <div className="musicDetail" >
                                <img className='img' src={pre_pic_big} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="musicOpa"></div>
                <div className="topIcon">
                    <img className="s1" src={iconImg.inLove} alt=""/>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state,ownProps) => {
    let { pic_big,changeLyrc,pre_pic_big,next_pic_big,before_pic_big,netState,swip_animation,pic_big_clone } = state.musicPlay,
        {musicState,touchMoveX,endMoveX,startMoveX,audioAction,swipImgBool} = state.AudioController,
        animationRotate = musicState=='play' ? {'animationPlayState': 'running'} : {},
        turn = musicState=='play' ? {transform: 'rotate(-7deg)'} : {},
        display = changeLyrc == false ? 'x' : 'none',
        musicImgStyle = {};
    pic_big == '' ? pic_big = pic_big_clone : '';
    //console.log(swip_animation);
    if(swip_animation){//开关先打开了，但是数据没有发生改变,因为index的延迟更新导致next_pic和pre_pic的延迟更新，出现动画闪烁

        let a = '',
            width = document.documentElement.clientWidth;
        if(audioAction == audioControllerAction.next ){
            touchMoveX = -width ;
            next_pic_big = pic_big_clone;
        }
        else if(audioAction == audioControllerAction.pre ){
            touchMoveX = width;
            pre_pic_big = pic_big_clone;
        }
        musicImgStyle.transition= 0.5+'s';
    }
    swipImgBool ? musicImgStyle.transition= '0.3s' : '';//开始滑动
    musicImgStyle.transform = `translate3D(${touchMoveX}px,0,0)`;
    return {
        pic_big,animationRotate,turn,display,musicImgStyle,pre_pic_big,next_pic_big
    };
};
const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        touchMoveMusicImg:(e)=>dispatch(touchMoveMusicImg(e)),
        touchStartMoveMusicImg:(e)=>dispatch(touchStartMoveMusicImg(e)),
        touchEndMoveMusicImg:(e)=>dispatch(touchEndMoveMusicImg(e))
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(ShowImgsing);