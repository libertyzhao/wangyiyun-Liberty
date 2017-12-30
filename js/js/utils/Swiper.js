/**
 *
 * 图片轮播组件使用说明：
 *  所有可用的props: images、indicatorDots、autoPlay、cycleType、interval、selectCallback
 *
 *  1、页面头部组件,自带行内样式无需要引入CSS文件
 *  2、props说明：
 *         images：          图片url数组(如果传入的图片url数量为1则仅显不自动轮播)
 *         indicatorDots:    是否显示面板指示点
 *         autoPlay:         是否自动循环播放
 *         cycleType:        循环播放的类型(支持backAndForth和loop这两种方式,loop)
 *         interval:         自动切换时间间隔(毫秒)
 *         selectCallback    点击图片的回调函数(回传点击的图片的index)
 *
 *  <Swiper images={this.state.images} selectCallback={this.selectCallback.bind(this)}/>
 *
 */

 import React from "react"
let marginLeftValue = 0;
let imgIndex = 0;
let timer = null;
class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: this.props.images || [],
            indicatorDots: this.props.indicatorDots == undefined ? true : this.props.indicatorDots, //是否显示面板指示点
            autoPlay: this.props.autoPlay == undefined ? true : this.props.autoPlay,                //是否轮播
            cycleType: this.props.cycleType || "loop",
            interval: this.props.interval || 2000,   //轮播时间间隔
            currentImgIndex: 0                       //当前图片的index
        }
    }

    componentWillReceiveProps(props) {
        props.images && this.setState({
            images: props.images
        }, ()=>this.state.images.length > 1 && this.autoPlay());
    }

    componentDidMount() {
        let that = this;
        let banner = this.refs.banner;
        this.swipe(banner, function (direction) {
            that.imgChange(direction);
        });
        this.state.images.length > 1 && this.autoPlay();
    }


    componentWillUnmount() {
        timer && clearInterval(timer);
    }


    //图片显示切换(支持两种循环切换方式一种是首尾循环一种是来回循环)
    imgChange(direction) {
        let banner = this.refs.banner;
        let imgCount = this.state.images.length;
        let cycleType = this.state.cycleType;
        switch (cycleType) {
            case "backAndForth":  //eg：1->2->3->2->1
                (direction == "left") && imgIndex < imgCount - 1 && ++imgIndex && (marginLeftValue -= 100);
                (direction == "right") && imgIndex > 0 && imgIndex-- && (marginLeftValue += 100);
                break;
            case "loop":         //eg：1->2->3->1->2->3
                if (direction == "left" && imgIndex < imgCount) {
                    if (++imgIndex == imgCount) {
                        marginLeftValue = 0;
                        imgIndex = 0;
                    } else {
                        marginLeftValue -= 100;
                    }
                } else if (direction == "right" && imgIndex >= 0) {
                    if (--imgIndex == -1) {
                        marginLeftValue = -(imgCount - 1) * 100;
                        imgIndex = imgCount - 1;
                    } else {
                        marginLeftValue += 100;
                    }
                }
                break;
        }
        this.setState({
            currentImgIndex: imgIndex
        });
        banner.style.marginLeft = marginLeftValue + "%";
    }


    //自动循环轮播
    autoPlay() {
        if (!this.state.autoPlay) {
            return null;
        }
        let that = this;
        let imgCount = this.state.images.length;
        let direction = "left";
        let interval = this.state.interval;
        let cycleType = this.state.cycleType;
        timer && clearInterval(timer);
        timer = setInterval(()=> {
            imgIndex == 0 && (direction = "left");
            cycleType == "backAndForth" && (imgIndex == imgCount - 1) && (direction = "right");
            that.imgChange(direction);
        }, interval)
    }

    // 左右滑动
    swipe(element, fn) {
        let that = this;
        let isTouchMove;
        let startTx;
        let startTy;
        element.addEventListener('touchstart', function (e) {
            timer && clearInterval(timer);  //如果手动滑动图片则停止轮播
            let touches = e.touches[0];
            startTx = touches.clientX;
            startTy = touches.clientY;
            isTouchMove = false;
        }, false);
        element.addEventListener('touchmove', function (e) {
            isTouchMove = true;
            e.preventDefault();
        }, false);
        element.addEventListener('touchend', function (e) {
            that.autoPlay();             //滑动结束后,开启自动轮播
            if (!isTouchMove) {
                return;
            }
            let touches = e.changedTouches[0];
            let endTx = touches.clientX;
            let endTy = touches.clientY;
            let distanceX = startTx - endTx;
            let distanceY = startTy - endTy;
            if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                if (distanceX < -20) {
                    fn("right"); //向右滑动
                } else if (distanceX > 20) {
                    fn("left");  //向左滑动
                }
            }
        }, false);
    }

    // 点击图片
    tapImg(imgIndex) {
        let selectCallback = this.props.selectCallback;
        typeof selectCallback == "function" && selectCallback(imgIndex);
    }

    render() {
        let images = this.state.images;
        let screenWidth = document.documentElement.clientWidth;
        let currentImgIndex = this.state.currentImgIndex;
        let indicatorDots = this.state.indicatorDots;
        let isSelected = false;
        return (
            <div style={styles.bannerContainer}>
                <div ref="banner"
                     style={{width:images.length*screenWidth,height:"6rem",transition: "0.2s linear"}}>
                    {images.map((v, i)=> {
                        return <img src={v} key={"swiper-img"+i}
                                    style={{width:screenWidth,height:"6rem"}}
                                    onClick={this.tapImg.bind(this,currentImgIndex)}
                        />
                    })}
                </div>
                {indicatorDots && images.length > 1 && <div style={styles.indicatorDotsZone}>
                    {images.map((v, i)=> {
                        isSelected = i == currentImgIndex;
                        return <i style={{display: "inline-block",verticalAlign: "middle",
                                                    width: "5px",height: "5px",borderRadius: "50%",
                                                    background: isSelected ? "#ff6629" : "white",
                                                    marginLeft: "4px"}} key={"dot"+i}>

                        </i>
                    })}
                </div>}
            </div>
        )
    }
}

export default Swiper

const styles = {
    bannerContainer: {
        width: "100%",
        overflow: "hidden",
        position: "relative",
        padding: 0
    },
    indicatorDotsZone: {
        width: "100%",
        height: "26px",
        position: "absolute",
        left: 0,
        bottom: 0,
        textAlign: "center",
        color: "white",
        overflow: "hidden"
    }
};