//轮播图
export const carouselFigureImg = [
    './js/img/banner1.png',
    './js/img/banner2.png',
    './js/img/banner3.png',
    './js/img/banner4.png'
];

//推荐歌单六张图和描述
export const recommendImg = [
    {src:'./js/img/es1.png',text:'当粤语歌谈论生活时它谈些什么'},
    {src:'./js/img/es2.png',text:'华语歌手演唱的英文歌sadfsadf曲中的饿巅峰之作'},
    {src:'./js/img/es3.png',text:'华语经典老歌'},
    {src:'./js/img/es1.png',text:'当粤语歌谈论生活时它谈些什么'},
    {src:'./js/img/es2.png',text:'华语歌手演唱的英文歌曲中的饿巅峰之作'},
    {src:'./js/img/es3.png',text:'华语经典老歌，永恒不朽'}
];

export const checkNetTime = 5000;  //检查网络，用户点击歌曲，5S之后如果发现播放歌曲的时间小于等于1，就提示。

export const fetchSongTime = 500; //查找歌曲的节流时间

export const img_animationTime = 1000; //音乐面板淡入淡出动画时间，包括图片左右归位时间

export const floatTime = 2000; //音乐面板，网速提示，单曲随机列表循环的浮动通知时间

export const audioTime = 500; //唱片起伏动画

export const delayAndSwipTime = 800; //延迟执行背景切换动画和图片滑动动画的时间，注意这两个必须一样


//图标
export const iconImg = {
    leftArrow:"./js/img/a_w_arrow.png",
    outLeft:"./js/img/b_w_left.png",
    outRight:"./js/img/b_w_right.png",
    outStart:"./js/img/b_w_start.png",
    outStop:"./js/img/b_w_stop.png",
    inLove:"./js/img/a_w_love.png",
    inLoveLight:"./js/img/a_w_loveLight.png",
    inLeft:"./js/img/a_w_left.png",
    inRight:"./js/img/a_w_right.png",
    inStop:"./js/img/a_w_stop.png",
    inStart:"./js/img/a_w_start.png",
    inMusicList:"./js/img/a_w_3.png",
    mode:["./js/img/a_w_0.png","./js/img/a_w_1.png","./js/img/a_w_2.png"],
    //inSingle:"./js/img/a_w_0.png",
    //inRandom:"./js/img/a_w_1.png",
    //inLoop:"./js/img/a_w_2.png",
    animation:["./js/img/a0_.png","./js/img/a0a.png","./js/img/a0b.png","./js/img/a0c.png"],
    searchCancel:"./js/img/cancel.png",
    search:"./js/img/search.png",
    vol:"./js/img/vol.png",
    history:'./js/img/a68.png',
    mobile:'./js/img/a62.png',
    sound:'./js/img/sound.png',
    choose:'./js/img/xn.png',
    historyPlay:'./js/img/xt.png',
    cancle:'./js/img/cancle.png',
    next:'./js/img/o1.png',
    collect:'./js/img/o2.png',
    delete:'./js/img/o3.png',
    author:'./js/img/o4.png',
    album:'./js/img/o5.png',
    music_bg:'./js/img/music_bg.png',

    loveSong:'./js/img/love.png'

}

//api
export const api = {
    lrcData:'http://musicdata.baidu.com', //搜索列表中出的的lrc地址，差域名，这个二级域名就是的
    url:"http://tingapi.ting.baidu.com/v1/restserver/ting",
    search_method:"baidu.ting.search.common",
    song_method: 'baidu.ting.song.play',
    channel_method: 'baidu.ting.billboard.billList'
};

//actionType
export const actionType = {
    SONGS_LIST : 'SONGS_LIST',
    PLAY_SONG : 'PLAY_SONG',
    AUDIO_DOM : 'AUDIO_DOM',
    MUSIC_STATE:'MUSIC_STATE',
    MUSIC_LISTSHOW:'MUSIC_LISTSHOW',
    CHANGE_POSITION:'CHANGE_POSITION',
    SHOW_AUDIO_FOOTER:'SHOW_AUDIO_FOOTER',
    SONG_TIME_UPDATE:'SONG_TIME_UPDATE',
    PUSH_INDEX_TARGET:'PUSH_INDEX_Target',
    SAVE_LYRICS:'SAVE_LYRICS',
    UPDATE_LRC_INDEX:'UPDATE_LRC_INDEX',
    CHANGE_LYRIC_P:'CHANGE_LYRIC_P',
    SONG_VOL_UPDATE:'SONG_VOL_UPDATE',
    CHANGE_MAIN_PAGE:'CHANGE_MAIN_PAGE',
    CHANGE_AUDIO_FOOTER_OUT_MUSICLIST:'CHANGE_AUDIO_FOOTER_OUT_MUSICLIST',
    ADD_HISTORY_MUSIC:'ADD_HISTORY_MUSIC',
    ADD_PLAYING:'ADD_PLAYING',
    SAVE_PLAYING_INDEX:'SAVE_PLAYING_INDEX',
    CHANGE_MODE:'CHANGE_MODE',
    CHANGE_SONG_CHOOSE:'CHANGE_SONG_CHOOSE',
    CHANGE_BG:'CHANGE_BG',
    KEY_WORD:'KEY_WORD',
    SAVE_SONG_ID:'SAVE_SONG_ID',
    SAVE_PLAY_MUSIC:'SAVE_PLAY_MUSIC',
    SAVE_SONG_URL:'SAVE_SONG_URL',
    CHANGE_IS_LOCALDATA:'CHANGE_IS_LOCALDATA',
    CHANGE_DIALOG_DISPLAY:'CHANGE_DIALOG_DISPLAY',
    CHANGE_BG_DISPLAY:'CHANGE_BG_DISPLAY',
    SAVE_CLEAR_ALL_TARGET:'SAVE_CLEAR_ALL_TARGET',
    IS_FETCHING:'IS_FETCHING',
    NULL_IMG_BG:'NULL_IMG_BG',
    'MUSIC_IMPORTANT_INFO':'MUSIC_IMPORTANT_INFO',
    FETCHING_LYRICS:'FETCHING_LYRICS',
    ADD_HASH:'ADD_HASH',
    IMG_LOAD:'IMG_LOAD',
    NET_STATE:'NET_STATE',
    START:'START',
    IS_CLICK_MODE:'IS_CLICK_MODE',
    CLOSE_IS_FETCHING:'CLOSE_IS_FETCHING',
    SAVE_IMG_ANIMATION:'SAVE_IMG_ANIMATION',
    SAVE_START_MOVE_X:'SAVE_START_MOVE_X',
    SAVE_TOUCH_MOVE_X:'SAVE_TOUCH_MOVE_X',
    SAVE_END_MOVE:'SAVE_END_MOVE',
    SAVE_PRE_NEXT_PIC:'SAVE_PRE_NEXT_PIC',
    SAVE_ACTION:'SAVE_ACTION',
    SAVE_SWIP_IMG_STATE:'SAVE_SWIP_IMG_STATE',
    INIT_HASH:'INIT_HASH',
    SAVE_SWIP_ANIMATION:'SAVE_SWIP_ANIMATION',
    SAVE_CAN_SWIP_IMG_BOOL:'SAVE_CAN_SWIP_IMG_BOOL',
    INIT_PIC:'INIT_PIC',
}

//router
export const routeTo = {
    home:'/',
    secondPage:'secondPage',
    firstPage:'firstPage',
    historyMusic:'historyMusic',
    search:'search',
    thirdPage:'thirdPage'
}

//audioController
export const audioControllerAction = {
    play_pause:'play_pause',
    play:'play',
    pause:'pause',
    newMusic:'newMusic',
    next:'next',
    pre:'pre',
    end:'end',
    delete:'delete',
    newMusic:'newMusic',
}

//comeFrom    ,对于history和playing，不只是指的从哪里来，指的也可能是loaclData中的目标数组
export const comeFrom = {
    main:'main',
    nextOrPre:'nextOrPre',
    nextSong:'nextSong',
    playing:'playing',
    history:'history',// history 和 playing和reducer中的localData数组对应
    music:'music',
    search:'search',
}
