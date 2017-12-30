
import React from 'react';
import HistoryPlay from '../component/historyPlay.js';
import SongSheet from '../component/songSheet.js';

export default class SecondPage extends React.Component{
    render(){
        return (
            <section className='secondPage borderTransparent' >
                <HistoryPlay />
                <SongSheet />
            </section>

        );
    }
}


