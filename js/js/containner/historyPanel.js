import React from 'react';
import HistoryHeader from '../component/HistoryHeader.js';
import HistoryMusicList from '../component/HistoryMusicList.js';
import '../../css/containner/historyPanel.css'

export default class HistoryPanel extends React.Component{
    render(){
        return (
            <article className="historyPanel" >
                <HistoryHeader />
                <HistoryMusicList/>
            </article>
        );
    }
}
