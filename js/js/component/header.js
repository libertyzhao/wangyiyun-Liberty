import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { changeMainPage } from '../redux/action.js';
import { routeTo } from '../config/config.js';
import '../../css/component/header.css';

class Header extends React.Component{
    render(){
        let {changeMainPage,liPressStyle} = this.props;
        return (
            <header className="header">
                <nav className="nav" >
                    <div className="search "><Link to={routeTo.search} className='link' /></div>
                    <ul className="dis_flex" >
                        <li className="disib musicTypeicon icon" style={liPressStyle[0]}>
                            <Link to='firstPage' className='link' onClick={changeMainPage.bind(null,1)} />
                        </li>
                        <li className="disib musicListicon icon  " style={liPressStyle[1]}>
                            <Link to='secondPage' className='link' onClick={changeMainPage.bind(null,2)} />
                        </li>
                        <li className="disib rankListicon icon " style={liPressStyle[2]}>
                            <Link to='thirdPage' className='link' onClick={changeMainPage.bind(null,3)} />
                        </li>
                    </ul>
                </nav>

            </header>
        )
    }
}

const mapStateToProps = (state,ownProps)=>{
    let { mainPage } = state.RenderPage,liPressStyle = [];
    liPressStyle[mainPage-1] = {'opacity': '1'};

    return {mainPage,liPressStyle};
};
const mapDispatchToProps = (dispatch,ownProps)=>{
    return {
        changeMainPage:(index)=>dispatch(changeMainPage(index))
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(Header);