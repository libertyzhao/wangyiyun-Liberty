import React from 'react';
import Swiper from '../utils/Swiper.js';
import RecommendList from '../component/recommendList.js';
import {carouselFigureImg} from '../config/config.js';
import '../../css/containner/firstPage.css';

export default class FirstPage extends React.Component{
    render(){
        return (
            <section className='firstPage' >
                <ul className="nav navBar">
                    <li className="navBottom active">个性推荐</li>
                    <li className="navBottom">歌单</li>
                    <li className="navBottom">排行榜</li>
                </ul>
                <Swiper images={carouselFigureImg} interval={4000} />
                <RecommendList />
            </section>
        )
    }
}


