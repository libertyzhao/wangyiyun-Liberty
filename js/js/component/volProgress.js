import React from 'react';
import objectAssign from 'object-assign';

const Progressstyle = {
    grayLine:{
        display:'inline-block',
        //width: '9.8rem',
        width:'96.33%',
        height:'0.1rem',
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: 'absolute',
        top: '0',
        bottom: '0',
        margin: 'auto 0',
        'marginRight':'0.6rem'
    },
    redLine:{
        backgroundColor: '#cd3d3d',
        width: '100%',
        height: '0.1rem',
        position: 'absolute',
        transform: 'translate(-100%,0)'
    },
    circle:{
        position: 'absolute',
        width: '0.6rem',
        height: '0.6rem',
        right: '-0.6rem',
        top: 0,
        bottom: 0,
        margin: 'auto 0',
        backgroundColor: 'white',
        borderRadius: '1rem'
    },
    progressCon:{
        position: 'relative',
        width: '100%',
        height: '1rem',
        overflow: 'hidden',
        display: 'inline-block',
        left: '0.1rem',
        'margin':'0 0.5rem 0 0.7rem'
    }

};

export default class VolProgress extends React.Component{
    render(){
        let { onTouchEnd,onTouchStart,onTouchMove,progressStyle,progressBgStyle,circle } = this.props,
            redLineStyle = objectAssign(Progressstyle.redLine,progressStyle),
            grayLineStyle = objectAssign(Progressstyle.grayLine,progressBgStyle),
            circleStyle = objectAssign(Progressstyle.circle,circle);
        return (
            <div style={Progressstyle.progressCon}>
                <div style={grayLineStyle}>
                    <div style={redLineStyle}>
                        <div onTouchEnd={onTouchEnd}  onTouchStart={onTouchStart}  onTouchMove={onTouchMove} style={circleStyle} ></div>
                    </div>
                </div>
            </div>
        );
    }
}
