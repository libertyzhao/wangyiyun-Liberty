import fetchJsonp from 'fetch-jsonp';
import {api,actionType,routeTo,comeFrom,audioControllerAction,fetchSongTime,img_animationTime,floatTime,audioTime,delayAndSwipTime,checkNetTime} from '../config/config.js';
import {offsetLeft,formatLrc,getIndex,StorageSetter,filter,deleteItem,solveScrollBug,findItem,cloneObj,throttle,throttle1} from '../utils/tool.js';
import objectAssign from 'object-assign';

function receiveSongsListInfo(keyword,data){//收到歌曲列表
    console.log('歌曲列表：');
    console.log(data);
    let result = data.song_list;
    return {
        type: actionType.SONGS_LIST,
        length: result.length,
        keyword: keyword,
        result: result
    };
}

function FetchingMusicList(){ //正在搜索歌曲列表
    return {
        type:actionType.IS_FETCHING
    }
}

function saveFetchingListState(isFetching){
    return {
        type:actionType.CLOSE_IS_FETCHING,
        isFetching:isFetching
    }
}

function showMusicList(display){
    return {
        type: actionType.MUSIC_LISTSHOW,
        musicListDisplay:display //无意义，只是替换掉class的none
    }
}

function showAudioFoot(show = 'show'){ //默认参数是显示
    return {
        type: actionType.SHOW_AUDIO_FOOTER,
        audioFooterOutDisplay:show //无意义，只是替换掉class的none
    }
}

function receiveSongInfo(data){
    console.log('歌曲：');
    console.log(data);

    return {
        type: actionType.PLAY_SONG,
        fetchSongId: data.songinfo.song_id,
        item: data
    };
}

function audioAct(musicState){ //保存audio当前的状态
    //console.log('执行'+musicState);
    return {
        type:actionType.MUSIC_STATE,
        musicState:musicState
    }
}

function receiveLyrics(data){
    //console.log('歌词'+data);
    let lyric = formatLrc(data);
    return {
        type:actionType.SAVE_LYRICS,
        lyric:lyric
    }
}

function updateCurrentTime(currentTime){
    //console.log('updateCurrentTime');
    return {
        type: actionType.SONG_TIME_UPDATE,
        currentTime: parseInt(currentTime)
    };
}
function updateLrcIndex(lrcIndex){
    return {
        type: actionType.UPDATE_LRC_INDEX,
        lrcIndex: lrcIndex
    };
}

function saveMainPage(index){
    return {
        type:actionType.CHANGE_MAIN_PAGE,
        mainPage:index
    }
}

function saveHistoryMusic(musicArray){
    return {
        type:actionType.ADD_HISTORY_MUSIC,
        musicArray:musicArray
    }
}

function addLocalData(music,from){ //
    return (dispatch,getState) => {
        dispatch(pushPlaying(music,from));//导入歌曲到正在播放列表
        dispatch(unshiftHistory(music));//将歌曲添加到最近播放
    }
}

function pushPlaying(music,from){ //将歌单或者单曲导入到正在播放列表中
    return (dispatch,getState) => {
        let localData = getState().localData;
        if(from in localData){//判断是搜索列表中点击的单曲还是其他歌单
            dispatch(addPlaying(localData[from]));//将歌曲列表导入正在播放列表中
        }else{
            dispatch(addPlaying([music]));//将歌曲导入正在播放列表中,注意这里将歌曲对象用数组包一下
        }
    }
}

function unshiftHistory(music){ //将歌曲立即插入最近播放列表头部
    return (dispatch,getState) => {
        let localData = getState().localData,
             musicArr = localData.history.concat(),//不能直接操作getState获取的对象
             oldData = music;

        if(!music.pic_big){ //如果没有pic_big证明是搜索列表的烂数据，则用history中的数据(history中的数据也可能是烂数据)
            music = findItem(music.song_id,localData.history.concat());
            music ? '' : music = oldData ; //成功在history中找到数据，则使用，否则用老数据
        }
        musicArr.unshift(music);//添加之后可能有songid重复的情况
        music.song_id in localData.hash ? musicArr = filter(musicArr) : '';//去掉最近播放列表中重复的
        dispatch(saveHistoryMusic(musicArr));
    }

}

function addHash(songid){ //将数据添加到哈希表
    let obj = {};
    obj[songid] = true;
    return {
        type:actionType.ADD_HASH,
        hash:obj
    }
}

function addPlaying(playing){ //添加列表或歌曲到正在播放列表
    return {
        type:actionType.ADD_PLAYING,
        playing:playing
    }
}

export function changeLyrcP(bool,lrclink){//切换音乐和歌词的显示
    return (dispatch,getState) => {
        dispatch(saveLyrcP(bool));
        getState().musicPlay.changeLyrc && getState().musicPlay.lyric.length == 0 ?
            dispatch(fetchLyrics(getState().musicPlay.lrclink)) : '';//惰性获取歌词(1、在歌词面板下。2、没有歌词),请求歌曲先删上一个的歌词，然后自己有歌词只请求一次
    }
}

function saveLyrcP(bool){ //保存音乐面板位置，是在歌词界面还是唱片界面
    return {
        type:actionType.CHANGE_LYRIC_P,
        changeLyrc:bool
    }
}

export function changeBg(){//遮罩层和弹出层全部隐藏
    return {
        type:actionType.CHANGE_BG
    }
}

export function changeAudioFooterOutMusicList(e){//切换外部底部控制栏的音乐列表显示
    e && e.stopPropagation();
    return {
        type:actionType.CHANGE_AUDIO_FOOTER_OUT_MUSICLIST
    }
}

export function changeSongChooseDisplay(e,songChooseFillData){ //切换底部弹出的歌曲选项
    e && e.stopPropagation();
    return {
        type:actionType.CHANGE_SONG_CHOOSE,
        songChooseFillData:songChooseFillData
    }
}

export function addNext(musicData){ //注意这里的异步操作的执行顺序，必须先删除数组，更新index下标，再获取新下标
    return (dispatch,getState) =>{
        let length = getState().localData.playing.length,
            song_id = musicData.song_id,
            from = comeFrom.nextSong;
        if(length > 0){ //如果正在播放列表中有数据则插入
            dispatch(deleteMusicBySong_id(song_id,comeFrom.playing));//先删掉，而不是插入再去重，因为去重是去掉后面出现的。
            dispatch(insertMusicNext(musicData,1));//插入到正在播放列表中的下一个
            dispatch(changeBg());
            dispatch(saveLocalData());//将音乐列表放入local缓存中
        }else{//如果没数据则直接播放这首歌
            dispatch(changeBg());
            dispatch(changePosition(comeFrom.music));//改变面板，进入音乐面板
            dispatch(quickRespond(musicData,comeFrom.nextSong));//快速响应
            dispatch(fetchSong(song_id,from));//找歌
        }
    }
}

function insertMusicNext(musicData,i,del = 0){ //将歌曲插入
    return (dispatch,getState) => {
        let localData = getState().localData ,
            playing = localData.playing.concat(),
            index = localData.index;
        playing.splice(index+i,del,musicData); //插入index+i，或者直接替换当前index
        dispatch(addPlaying(playing));//将歌曲列表导入正在播放列表中
    }
}

function saveSong_id(song_id){
    return {
        type:actionType.SAVE_SONG_ID,
        song_id:song_id
    }
}

function fetchsongTime({dispatch,song_id,from}){
    dispatch(fetchSong(song_id,from));
}

export function clearMusicList(target){ // 清空歌曲列表
    return (dispatch,getState) => {
        getState().localData[target] = [];//只能这样获取对应的未知的歌单，并且清理歌单所有内容
        if(target == comeFrom.playing){
            dispatch(playOrPause(audioControllerAction.play));//将正在播放的歌曲暂停
            dispatch(showAudioFoot('none'));//隐藏底部控制栏，切断一切操控audio的路径
            dispatch(savePlayingMusicData(null));//删除正在播放的歌曲数据
            dispatch(quickReceiveMusicInfo({item:{}})); //将缓存记录删掉
            dispatch(initPic());//将缓存记录删掉
            dispatch(audioAct(audioControllerAction.pause));
        }else if(target == comeFrom.history){
            dispatch(initHash());//如果清空了最近播放列表，将哈希表置空
        }
        //dispatch(changePosition(comeFrom.main));//回到主面板，因为有可能在音乐面板点击这个
        //dispatch(saveSong_id(''));//置空
        dispatch(savePosition(comeFrom.main));//回到主面板，因为有可能在音乐面板点击这个
        dispatch(changeDialogDisplay('none'));//关闭弹窗
        dispatch(changeBg());//关闭列表
        dispatch(saveLocalData());//将音乐列表放入local缓存中
    }
}

function initPic(){
    return {
        type:actionType.INIT_PIC
    }
}

function pushNextAndPrePic(index){
    return (dispatch,getState) => {
        let playing = getState().localData.playing,
            length = playing.length;
        if(length > 0){
            let pre_pic_big = playing[(index-1+length)%length].pic_big,
                next_pic_big = playing[(index+1+length)%length].pic_big;
            dispatch(saveNextAndPrePic({pre_pic_big,next_pic_big}));
        }
    }
}

function saveNextAndPrePic({pre_pic_big = '',next_pic_big = ''}){
    return {
        type:actionType.SAVE_PRE_NEXT_PIC,
        pre_pic_big:pre_pic_big,
        next_pic_big:next_pic_big
    }
}

export function deleteMusicBySong_id(song_id,target,e){//根据song_id删除歌曲，target代表是删除哪个歌单下面的歌曲
    let e_index = '';
    if(e){
        e.stopPropagation();
        e_index = e ? e.target.parentNode.dataset.index : '';
    }
    return (dispatch,getState) =>{
        let localData = getState().localData,
            index = localData.index,
            obj = deleteItem(localData[target],song_id,index);//返回一个对象，当删除的歌曲的下标在index之前时，index-1
        localData[target] = obj.arr;//这种直接获取state，并且更新的方法有点粗暴，尽量少用，除非必要
        if(target == comeFrom.playing){
            dispatch(savePlayingIndex(obj.index));//是否需要更新保存正在播放歌曲的下标,只有playing需要更新下标
            if(parseInt(e_index) === index){//如果删除的是正在播放的歌曲，
                let music = localData[target];
                if(music[index] ||  music[0]){ // 播放歌单中下一首歌,如果下一首没歌就放第一首
                    let musicItem = music[index] || music[0],
                        song_id = musicItem.song_id,
                        act = audioControllerAction.play;;
                    dispatch(quickRespond(musicItem,comeFrom.playing));//快速响应
                    dispatch(checkLyric(song_id));//检测歌词情况，可能在歌词面板
                    dispatch(fetchSong(song_id,audioControllerAction.delete));//播放歌曲
                    throttle(timeAudioAct,{dispatch,act},audioTime);//改变唱片动画，继续动画
                }else{// 正在播放的歌单被删完，停止播放
                    dispatch(playOrPause(audioControllerAction.play));//将正在播放的歌曲暂停
                    dispatch(showAudioFoot('none'));//隐藏底部控制栏，切断一切操控audio的路径
                    dispatch(quickReceiveMusicInfo({item:{}})); //将缓存记录删掉
                    dispatch(initPic());//将缓存记录删掉
                    dispatch(savePosition(comeFrom.main));//回到主面板，因为有可能在音乐面板点击这个
                    dispatch(audioAct(audioControllerAction.pause));
                    dispatch(changeBg());//关闭列表
                }
                dispatch(savePlayingMusicData(null));//删除正在播放的歌曲数据
            }
        }else{
            dispatch(changeBg());//对非playing数组，遮罩层和弹出层全部隐藏
        }
        dispatch(saveLocalData());//将音乐列表放入local缓存中
    }
}

export function changeMainPage(index){//改变三个面板中的哪一个（非音乐）
    return (dispatch,getState) => {
        dispatch(saveMainPage(index));
        StorageSetter('RenderPage',getState().RenderPage);
    }
}

function saveDialogDisplay(dialogDisplay){
    return {
        type:actionType.CHANGE_DIALOG_DISPLAY,
        dialogDisplay:dialogDisplay
    }
}
function saveClearAllTarget(targetArr){ //将动作发起者保存
    return {
        type:actionType.SAVE_CLEAR_ALL_TARGET,
        targetArr:targetArr
    }
}

export function changeDialogDisplay(dialogDisplay,targetArr){  //弹出清空的窗体
    return (dispatch,getState) => {
        dispatch(saveDialogDisplay(dialogDisplay));//改变清空的弹窗
        dispatch(saveClearAllTarget(targetArr));//将动作发起者保存
    }
}

export function changePosition(position,e){//跳转music面板和主面板
    e && e.stopPropagation();
    return (dispatch,getState) => {
        if( position == comeFrom.main){
            dispatch(saveLyrcP(false));
            dispatch(showAudioFoot());
        }
        dispatch(savePosition(position));
    }
}
function savePosition(position){
    return {
        type:actionType.CHANGE_POSITION,
        position:position
    }
}

export function passonAudioa(audio){ //保存audio
    return {
        type:actionType.AUDIO_DOM,
        audio:audio,
        volume:audio.volume
    }
}

export function savePlayingIndex(index){//保存正在播放列表的歌曲的数组下标
    return (dispatch,getState) => {
        dispatch(pushNextAndPrePic(getState().localData.index));//将当前正在播放歌曲的上一首和下一首的图片放到缓存中
        dispatch(pushPlayingIndex(index));
    }
}

function pushPlayingIndex(index){ //保存当前正在播放歌曲的下标
    return {
        type:actionType.SAVE_PLAYING_INDEX,
        index:index
    }
}

function saveMode(){
    return {
        type:actionType.CHANGE_MODE
    }
}

export function changeMode(e){//改变歌曲播放模式
    e && e.stopPropagation();
    return (dispatch,getState) => {
        dispatch(saveNet(false));//打开浮动通知开关
        dispatch(isClickMode(true));
        dispatch(saveMode());
        throttle(time,dispatch,floatTime);//函数节流,关闭浮动通知开关
    }
}

function time(dispatch){
    dispatch(saveNet(true));//关闭浮动通知开关
    dispatch(isClickMode(false));
}

function saveKeyWord(keyword){
    return {
        type:actionType.KEY_WORD,
        keyword:keyword
    }
}

export function toSearchByQuery(query){ //跳转到搜索面板自动搜索
    location.href = '#/'+routeTo.search;
    return (dispatch,getState) => {
        dispatch(changeBg());//遮罩层和弹出层全部隐藏
        dispatch(fetchSongsByQuery(query));
        dispatch(saveKeyWord(query));
    }
}

export function playHistoryAll(){ //最近播放列表，播放全部
    return (dispatch,getState) => {
        let music = getState().localData.history[0],
            song_id = music.song_id,
            from = comeFrom.history;
        dispatch(changePosition(comeFrom.music));//改变面板，进入音乐面板
        dispatch(quickRespond(music,from));
        dispatch(fetchSong(song_id,from));
    }
}

export function fetchSongsByQuery(keyword){//搜索歌曲
    return (dispatch,getState) => {
        let url = `${api.url}?method=${api.search_method}&query=${keyword}&page_no=1&page_size=20`;
        dispatch(FetchingMusicList());//开始请求歌曲列表
        dispatch(showMusicList('none'));//隐藏搜索列表中的最佳匹配
        return fetchJsonp(url, {
            timeout: 200000,
            jsonpCallback: "callback"
        }).then(res => res.json())
        .then(data=> {
                if(!data.error_code){
                    dispatch(receiveSongsListInfo(keyword, data));//收到歌曲列表
                    dispatch(showMusicList('show'));//展示歌曲列表
                }else{
                    dispatch(saveFetchingListState(false));//开始请求歌曲列表
                }
        }).catch(err=>console.log(err));
    }
}

function defaultImg(pic_big){
    return {
        type:actionType.NULL_IMG_BG,
        pic_big:pic_big
    }
}

function quickReceiveMusicInfo(data){
    return {
        type:actionType.MUSIC_IMPORTANT_INFO,
        item:data
    }
}

function quickSaveMusicInfo(data){
    return (dispatch,getState) => {
        let localData = getState().localData,
            song_id = data.song_id,
            oldData = data,
            renderPageData = getState().RenderPage,
            index = localData.index;
        if(!data.pic_big && song_id in localData.hash ){//说明从搜索列表中点击而来,因为搜索列表中没有图片数据，这里查找最近播放的哈希表，如果有song_id，说明最近播放列表中有，则用最近播放列表中的数据。
            data = findItem(song_id,localData.history.concat());//用concat防止误操作直接更改state
            data ? '' : data = oldData ; //成功在history中找到数据，则使用，否则用老数据
            //console.log('使用hash数据');
        }
        //if(data.pic_big){
        //    var obj = new Image();
        //    obj.src = data.pic_big;
        //    obj.onload = () => {
        //        dispatch(defaultImg(obj.src));
        //    }
        //}
        //data.pic_big = '' ;//关闭通道
        dispatch(pushNextAndPrePic(index));//因为index靠标签的load事件来更新上下图片是有延迟的，标签被更新意味着已经渲染了一次页面，然后load才更新上下图片，导致动画闪烁
        dispatch(quickReceiveMusicInfo(data)); //存入重要数据
        //if(renderPageData.position == comeFrom.music && renderPageData.audioFooterOutMusicListDisplay == false){//音乐界面并且正在播放歌曲的列表关闭才需要看动画
        throttle(timeOpenImgAnimation,{dispatch,getState},delayAndSwipTime);//多少毫秒后打开音乐面板背景切换动画

        //dispatch(toggleSwipAnimation(true));
        //window.timeSwipAnimation ? '' : window.timeSwipAnimation = throttle1(timeToggleSwipAnimation,{dispatch,swip_animation:false},delayAndSwipTime,delayAndSwipTime);  //拖动防抖
        //timeSwipAnimation();

        dispatch(toggleSwipAnimation(true));
        throttle(timeToggleSwipAnimation,{dispatch,swip_animation:false},delayAndSwipTime);//多少毫秒后打开音乐面板背景切换动画
        //setTimeout(()=>{ dispatch(toggleSwipAnimation(false)) },delayAndSwipTime);//swip动画结束后，中间图片会展示pic_big，所以此时的pic_big一定要已经更新成新图片，不然会闪屏
    }
}

function timeCloseImgAnimation({dispatch}){
    dispatch(toggleImgAnimation(false));//关闭动画
}

function timeOpenImgAnimation({dispatch,getState}){
    throttle(timeCloseImgAnimation,{dispatch},img_animationTime);//多少毫秒后关闭动画
    dispatch(toggleImgAnimation(true));//打开动画
    dispatch(defaultImg(getState().musicPlay.pic_big_clone));//并且更新pic_big为最新

}

function toggleImgAnimation(img_animation){ //打开或者关闭音乐面板背景切换动画
    return {
        type:actionType.SAVE_IMG_ANIMATION,
        img_animation:img_animation
    }
}

function timeToggleSwipAnimation({dispatch,swip_animation}){
    dispatch(toggleSwipAnimation(false));//关闭动画
}

function toggleSwipAnimation(swip_animation){
    return {
        type:actionType.SAVE_SWIP_ANIMATION,
        swip_animation:swip_animation
    }
}

function initHash(){
    return {
        type:actionType.INIT_HASH
    }
}

//放歌目前有四个来源，3个歌曲列表，一个audiocontroller
export function playSong(data,from){ //列表中点歌
    return (dispatch,getState) => {
        //dispatch(defaultImg());//将图片置为空，即显示默认的图片
        data = formatLrcData(data); //将搜索列表数据中的歌词数据补充完整
        let localData = getState().localData,
            song_id = data.song_id;
        getState().RenderPage.audioFooterOutDisplay == 'none' ?
            dispatch(changePosition(comeFrom.music)): '' ;//跳转到music面板
        dispatch(quickRespond(data,from))//快速响应
        if(from == comeFrom.search){ //从查找面板中点击歌曲，放入当前播放歌曲的下一首，并且播放它
            dispatch(addNext(data));
            localData.playing.length != 0 ?  //等于0时，addNext就会自动播放歌曲，并且length为0，计算index的时候做被除数报错
                dispatch(audioController(null,audioControllerAction.next)) : '';
        }else{
            //dispatch(playOrPause(audioControllerAction.pause));
            dispatch(fetchSong(song_id,from));//这里应该不需要节流，就上下一曲的底部控制栏节流就好了
        }
    }
}

export function changeImgLoad(bool){
    return {
        type:actionType.IMG_LOAD,
        imgLoad:bool
    }
}

function formatLrcData(data){
    if(!data.lrclink.startsWith('http')){ //
        data.lrclink = api.lrcData + data.lrclink;
    }
    return data;
}

function quickRespond(data,from){  //这几个属性能够让页面快速响应，让用户感觉速度非常快
    return (dispatch,getState) => {
        dispatch(updateLrcIndex(0));//将歌词位置置为0
        getState().AudioController.audio.pause();//暂停
        getState().AudioController.audio.currentTime = 0;//快速置0
        getState().musicPlay.song_url = '';//快速置空 
        dispatch(updateCurrentTime(0));//将已播放的歌曲时间置为0
        dispatch(quickSaveMusicInfo(data));//快速存储歌曲重要信息
        dispatch(saveSong_id(data.song_id));//立刻存入song_id，让播放列表中下一首歌曲立刻变红
        from == comeFrom.search ? "" : dispatch(pushPlaying(data,from));//导入歌曲到正在播放列表
        dispatch(unshiftHistory(data));//立即将歌曲插入最近播放列表首部

        //let sameFormatData = {
        //    songinfo:{},
        //    bitrate:{}
        //},
        //    {song_id,title,author,album_title,pic_big = ''} = data;
        //sameFormatData.songinfo = {
        //    song_id,title,author,album_title,pic_big
        //};//保证数据格式一样
        //dispatch(savePlayingMusicData(sameFormatData));//存储正在播放歌曲信息
        dispatch(receiveLyrics(''));//避免重复请求歌词，置空，然后changeLyrcP不会再请求歌词
        dispatch(saveLocalData());//将音乐列表放入local缓存中
    }
}

export function checkNet(songid){ //当网速过慢的时候给用户提示
    //console.log('开始检查网络');
    return (dispatch,getState) => { //干等5S没反应
        //console.log('当前状态:'+getState().AudioController.audio.currentTime);
        if(getState().AudioController.audio.currentTime <= 1){
            dispatch(saveNet(false));//打开浮动开关，网络不稳定
            setTimeout(() => {
                dispatch(saveNet(true));//关闭浮动开关
            },floatTime);
        }
    }
}

function saveNet(netState){
    return {
        type:actionType.NET_STATE,
        netState:netState
    }
}

//from代表从哪个歌单点击过来
export function fetchSong(songid,from){//点击搜索的音乐列表的歌曲，播放
    return (dispatch,getState)=>{
        let url = `${api.url}?method=${api.song_method}&songid=${songid}`,
            index = getState().localData.index;

        window.timeCheckNet ? '' : window.timeCheckNet = throttle1(({dispatch})=>{dispatch(checkNet(songid))},{dispatch},checkNetTime);
        timeCheckNet();
        dispatch(pushNextAndPrePic(index)); //将当前正在播放歌曲的上一首和下一首的图片放到缓存中
        dispatch(saveSong_id(songid));//发请求之前保存id

        return fetchJsonp(url,{  //异步可能存在点N个歌曲，加载数据不同，导致不同歌曲的信息在页面来回切换的情况
            timeout:200000,
            jsonpCallback:"callback"
        }).then(res=>res.json())
        .then(data=>{
            dispatch(receiveSongDataDo(data,from));
        }).catch(err=>console.log(err));
    }
}

function receiveSongDataDo(data,from){ //其实from只是作为 一种信号
    return (dispatch,getState) => {
        if(data.songinfo.song_id == getState().musicPlay.song_id){  //当接收到的数据id和最后一次发起请求时id相同，才有效
            let {song_id,title,author,album_title,pic_big,lrclink} = data.songinfo,
                {show_link} = data.bitrate,
                localData = getState().localData,
                music = cloneObj(data),
                index = getState().localData.index;
            if(!(song_id in localData.hash)){ //不在哈希表中
                var obj = new Image();
                obj.src = pic_big;
                obj.onload = () => { //图片整个载入，不是从上到下一点点的加载
                    dispatch(defaultImg(pic_big));
                }
                getState().musicPlay.changeLyrc ? dispatch(fetchLyrics(data.songinfo.lrclink)) : '';//id不再哈希表中并且是歌词面板则直接获取歌词，不再哈希表说明在fetchsong中没有找歌词
                dispatch(addHash(song_id));//放入哈希表中，哈希表作为history去重的优化，图片加载方式的判断。
                music.songinfo.pic_big = '';//关闭通道
            }
            dispatch(insertMusicNext({song_id,title,lrclink,pic_big,author,album_title},0,1));//将playing的脏数据替换成干净数据
            dispatch(pushNextAndPrePic(index)); //将当前正在播放歌曲的上一首和下一首的图片放到缓存中
            dispatch(receiveSongInfo(music));//收到歌曲信息
            if(from == audioControllerAction.delete){
                if(getState().AudioController.musicState != audioControllerAction.pause) { //如果是删除歌曲，并且audio状态也是暂停，就不直接播放
                    dispatch(audioController(null,audioControllerAction.newMusic));
                }
            }else{
                dispatch(audioController(null,audioControllerAction.newMusic));
            }
            from == comeFrom.nextOrPre || from == audioControllerAction.delete ? from = comeFrom.playing : dispatch(changeLyrcP(false,lrclink));//为next的时候不改变歌词和音乐背景的切换,也不获取歌词，即歌词页面按上下一曲时，获取歌词靠下面的

            //虽然在快速响应方法中已经存了playing和history，但是注意从搜索列表中过来的数据是没有picbig的，所以这里任然要存一次带有picbig的数据版本
            //下面savePlayingMusicData(data)也是一样
            dispatch(addLocalData({song_id,title,lrclink,pic_big,author,album_title},from));//将歌曲添加到最近播放中,将歌曲列表导入正在播放列表中,放在from设置之下

            //from !== comeFrom.nextSong ? dispatch(audioController(null,audioControllerAction.newMusic)) : '';//下一首播放则继续播放当前歌曲，否则重新放歌

            //dispatch(showAudioFoot());//展示main和search面板的底栏(这个时候是隐藏的)
            dispatch(savePlayingMusicData(data));//存储正在播放歌曲信息
            dispatch(saveLocalData());//将音乐列表放入local缓存中
        }
    }
}

function isFetchingLyrics(bool){
    return {
        type:actionType.FETCHING_LYRICS,
        bool:bool
    }
}

export function fetchLyrics(lrcUrl){//歌词
    return (dispatch,getState) => {
        if(lrcUrl){
            dispatch(isFetchingLyrics(true));//切换歌曲时，让歌词界面显示正在载入歌词
            fetch(lrcUrl).then(res => res.text())
                .then(data => {
                    dispatch(receiveLyrics(data));//存歌词
                    dispatch(isFetchingLyrics(false));//结束查找歌词
                }).catch(err => console.log(err));
        }
    }
}

function savePlayingMusicData(playMusic){
    return {
        type:actionType.SAVE_PLAY_MUSIC,
        playMusic:playMusic
    }
}

function Start(){ //domload之后，若有缓存歌曲，第一次根据start来懒加载src
    return {
        type:actionType.START
    }
}

function isClickMode(isClickMode){
    return {
        type:actionType.IS_CLICK_MODE,
        isClickMode:isClickMode
    }
}

function checkLyric(song_id){//检测歌词情况
    return (dispatch,getState) => {
        let historyMusic = findItem(song_id,getState().localData.history.concat())
        if(historyMusic && historyMusic.lrclink && getState().musicPlay.changeLyrc){
            dispatch(fetchLyrics(historyMusic.lrclink));//有歌词地址并且在歌词界面就先找歌词
        }else{
            dispatch(isFetchingLyrics(true));//切换歌曲时，让歌词界面显示正在载入歌词
        }
    }
}

function saveAction(audioAction){ //保存用户当前使用上一曲还是下一曲切换歌曲的，方便切换动画
    return {
        type:actionType.SAVE_ACTION,
        audioAction:audioAction
    }
}

function nextOrPre(step,from){ //下一曲或上一曲,循环
    return (dispatch,getState) => {
        let localData = getState().localData,
            length = localData.playing.length,
            index = (localData.index+step+length)%length, //加length防止-1的情况，第0首的上一首就是最后一首
        //console.log(localData.index + '    '+step+'    '+ localData.playing.length);
            music = localData.playing[index],
            song_id = music.song_id,
            act = audioControllerAction.play;

        dispatch(playOrPause(audioControllerAction.play));//暂停,且暂停唱片动画
        throttle(timeAudioAct,{dispatch,act},audioTime);//改变唱片动画，继续动画
        //
        //tTimeout(()=>{
        //    dispatch(audioAct(audioControllerAction.play));
        //},500);
        dispatch(saveAction(from));//保存用户当前使用上一曲还是下一曲切换歌曲的，方便切换动画

        from = comeFrom.nextOrPre;
        dispatch(savePlayingIndex(index));//存一下正在播放的歌曲在数组的下标
        dispatch(quickRespond(music,comeFrom.playing));//快速响应
        dispatch(checkLyric(song_id));//检测歌词情况
        throttle(fetchsongTime,{dispatch,song_id,from},fetchSongTime);
    }
}

function timeAudioAct({dispatch,act}){
    dispatch(audioAct(act));
}

export function domLoaded(){//第一次加载页面，若有音乐缓存，则显示
    return (dispatch,getState) => {
        let musicData = getState().localData.playMusic;
        if(musicData ){
            //let pic_big = musicData.songinfo.pic_big;
            //if(pic_big){
            //    var obj = new Image();
            //    obj.src = pic_big;
            //    obj.onload = () => {
            //        dispatch(defaultImg(pic_big));
            //    }
            //}
            //musicData.songinfo.pic_big = '';

            let {song_id,title,author,album_title,pic_big,lrclink} = musicData.songinfo;
            dispatch(unshiftHistory({song_id,title,author,album_title,pic_big,lrclink})); //注意数据格式,防止因为网络不好，点击歌曲，导致最近播放列表变化，但是实际的播放歌曲的id却没有存储的情况
            dispatch(receiveSongInfo(musicData));//存储歌曲信息
            dispatch(defaultImg(pic_big));//存储图片信息
            dispatch(changePosition(comeFrom.main));
        }
    }
}

export function playOrPause(musicState){ //播放或暂停
    return (dispatch,getState) => {
        let audio = getState().AudioController.audio;
        if(musicState == audioControllerAction.play){
            audio.readyState == 4 ? audio.pause() : '';
            musicState = audioControllerAction.pause;
        }else{
            audio.readyState == 4 ? audio.play() : '';//audio还没有src的时候，用audio.play会报错
            musicState = audioControllerAction.play;
            dispatch(Start());//开始播放
        }
        dispatch(audioAct(musicState));//改变歌曲状态，是正在放还是暂停
    }
}

export function audioController(e,action){
    console.log('执行了： '+action);
    e && e.stopPropagation();//仅仅是音乐播放面板阻止歌词切换事件冒泡
    return (dispatch,getState)=>{
        let musicState = getState().AudioController.musicState;
        switch(action){
            case audioControllerAction.play_pause:{ //播放或暂停
                dispatch(playOrPause(musicState));
                break;
            }
            case audioControllerAction.newMusic :{ //在列表中单击歌曲，播放新歌曲
                dispatch(playOrPause(audioControllerAction.newMusic));
                break;
            }
            case audioControllerAction.next :{ //下一曲
                dispatch(nextOrPre(1,audioControllerAction.next));
                break;
            }
            case audioControllerAction.pre :{ //上一曲
                dispatch(nextOrPre(-1,audioControllerAction.pre));
                break;
            }
            case audioControllerAction.end :{ //一首歌结束
                let mode = getState().localData.mode;
                if(mode == 0){ //单曲循环
                    dispatch(nextOrPre(0));
                }else if(mode == 1){ //随机播放
                    let random = parseInt(Math.random()*10000);
                    dispatch(nextOrPre(random));
                }else if(mode == 2){ //列表循环
                    dispatch(nextOrPre(1));
                }else{
                    console.err('你是什么mode？：'+mode);
                }
                break;
            }
            default :
                console.log('你什么也没做');
        }

    }
}


export function pushCurrentTime(e,_currentTime,_duration){ //歌曲进度条
    return (dispatch,getState) => {
        let {
            currentTime = _currentTime,
            duration = _duration
            } = e.target;
        currentTime = currentTime >= duration ? duration : currentTime;
        let index = getState().musicPlay.lrcIndex,
        lyric = getState().musicPlay.lyric;
        //lyric[index] && console.log('11  '+"   "+index+"   "+lyric[index][0]+"     "+currentTime);
        if(lyric && lyric[index]){
            if( lyric[index+1] && lyric[index][0] <= currentTime && lyric[index+1][0] <= currentTime){ //自己比他小，下一级比他小，可能进行长距离向右拖拽
                dispatch(updateLrcIndex(getIndex(lyric, currentTime)));//进度条往回拉，歌词往回跳
            }else if(lyric[index-1] && lyric[index][0] >= currentTime && lyric[index-1][0] >= currentTime){ //同上，向左拖拽
                dispatch(updateLrcIndex(getIndex(lyric, currentTime)));//进度条往回拉，歌词往回跳
            }
        }else if(lyric[index] && lyric[index][0] <= currentTime ){//歌词下一句下一句，没有进行拖拽进度条
            dispatch(updateLrcIndex(index+1));//更新index
        }
        dispatch(updateCurrentTime(currentTime));
    }
}

export function touchMoveMusicImg(e){
    e && e.stopPropagation();
    return (dispatch,getState) => {
        dispatch(audioAct(audioControllerAction.pause));//停止旋转，将唱片机动画暂停

        //let touchMoveX = e.touches[0].pageX - getState().AudioController.startMoveX;
        //console.log('移动位置： '+touchMoveX);
        //dispatch(saveTouchMoveX(touchMoveX));

        window.timeTouchMoveMusicImg ? '' : window.timeTouchMoveMusicImg = throttle1(dispatchTouchMoveMusicImg,{e,dispatch,getState},50,50);  //拖动防抖
        timeTouchMoveMusicImg();
    }
}
function dispatchTouchMoveMusicImg({e,dispatch,getState}){
    if(e.touches && getState().AudioController.canSwipImgBool){  //进行滑动切歌，必须要等上次的动画完全播放完毕
        let touchMoveX = e.touches[0].pageX - getState().AudioController.startMoveX;
        dispatch(saveTouchMoveX(touchMoveX));
        dispatch(saveSwipImgState(true));
    }
}

export function touchStartMoveMusicImg(e){
    //console.log('开始位置： '+e.touches[0].pageX);
    return {
        type:actionType.SAVE_START_MOVE_X,
        startMoveX:e.touches[0].pageX
    }
}
function saveTouchMoveX(touchMoveX){
    return {
        type:actionType.SAVE_TOUCH_MOVE_X,
        touchMoveX:touchMoveX
    }
}
export function touchEndMoveMusicImg(e){
    e && e.stopPropagation();
    return (dispatch,getState) => {
        let moveX = getState().AudioController.touchMoveX ,
            clientWidth = window.document.documentElement.clientWidth,
            audioAction = '';
        if(clientWidth/2 < Math.abs(moveX)){
            if(moveX > 0){
                audioAction = audioControllerAction.pre;
            }else{
                audioAction = audioControllerAction.next;
            }
            window.timeSaveCanSwipImgBool ? '' : window.timeSaveCanSwipImgBool = throttle1(({dispatch})=>{
                dispatch(SaveCanSwipImgBool(true));
            },{dispatch},img_animationTime+300,img_animationTime+300,img_animationTime+300);  //xxx秒之后才允许再次滑动切歌,xxx秒执行一次，第三个参数表示就算在防抖阶段执行的那一次，也要延迟xxx秒执行，给300毫秒的缓冲，快速滑动的时候会顿一下
            timeSaveCanSwipImgBool();
            dispatch(SaveCanSwipImgBool(false)); //关闭左右滑动开关
        }
        throttle(dispatchSaveSwipImgState,{dispatch},400);//有400毫秒的唱片左右滑动的动画时间
        //throttle1(timeSaveCanSwipImgBool,{dispatch},700,700);
        dispatch(defaultTouchMoveStartX(moveX));
        dispatch(audioController(null,audioAction));
        getState().AudioController.audio.paused ? '' : dispatch(audioAct(audioControllerAction.play));//开始旋转，将唱片机动画打开,如果本来就是暂停，就不动
    }
}


function SaveCanSwipImgBool(canSwipImgBool){
    canSwipImgBool ? console.log('打开') : console.log('关闭');
    return {
        type:actionType.SAVE_CAN_SWIP_IMG_BOOL,
        canSwipImgBool:canSwipImgBool
    }
}

function defaultTouchMoveStartX(moveX){
    return {
        type:actionType.SAVE_END_MOVE,
        startMoveX:0,
        touch:0,
        moveX:moveX,
        touchMoveX:0
    }
}

function dispatchSaveSwipImgState({dispatch}){
    dispatch(saveSwipImgState(false))
}

function saveSwipImgState(swipImgBool){
    return {
        type:actionType.SAVE_SWIP_IMG_STATE,
        swipImgBool:swipImgBool
    }
}

export function changeProgress(audio,e){//歌曲进度条
    return (dispatch,getstate) => {
        let target = getstate().AudioController.touchTarget,//touchmove的event不一样
            offset = e.touches[0].pageX-offsetLeft(target);
        let referTime = 0;
        if(audio.duration){
            referTime = parseInt(offset/target.clientWidth*audio.duration);
        }
        referTime > 0 ?
            dispatch(pushCurrentTime(e,referTime,getstate().AudioController.audio.duration)) :
            dispatch(pushCurrentTime(e,0,getstate().AudioController.audio.duration));//对拖到最左边进行处理
    }
}

export function changeVol(audio,e){
    let offset = e.touches[0].pageX-offsetLeft(e.touches[0].target.parentNode);
    let volume = offset/e.touches[0].target.parentNode.clientWidth;
    volume > 1 ? volume = 1 : '';
    volume < 0 ? volume = 0 : '';
    audio.volume = volume;
    return {
        type: actionType.SONG_VOL_UPDATE,
        volume: volume
    }
}

export function pushIndexTarget(e){
    return {
        type:actionType.PUSH_INDEX_TARGET,
        indexTarget:e.touches[0].target.parentNode,//存入的为进度条的target
        touch:'start'
    }
}

export function touchendCurrentTime(audio,curTime){
    //console.log('touchendCurrentTime');
    audio.currentTime = curTime;
    return {
        type: actionType.SONG_TIME_UPDATE,
        currentTime: curTime,
        touch:'end'
    }
}

function saveLocalData(){
    return (dispatch,getState) => {
        StorageSetter('localData',getState().localData);
    }
}


