import objectAssign from 'object-assign';
import {actionType,iconImg} from '../config/config.js';
import {StorageGetter} from '../utils/tool.js';

const initMusicState = {
    song_id:'',
    time:0,
    file_duration:200,
    src:'',
    lrclink:'',
    title: '',
    album_title: '',
    author:'',
    netState:true,
    song_url:'',
    pic_big:'',
    pic_big_clone:'',
    pre_pic_big:'',
    before_pic_big:'',//当前歌曲的上一首歌的图片
    next_pic_big:'',
    img_animation:false,//音乐面板背景切换动画的开关
    swip_animation:false,//唱片横向移动动画的开关
    lyric:[],
    lrcIndex:0,
    changeLyrc:false,
    start:false //playMusic底部点击播放时候，才给audio添加src
}

const initKeywordSearchListState = {
    keyword: '',
    isFetching: false,
    isFetchingLyrics:false,
    length: 0,
    result: []
}

const initAudioController = {
    audio:null,
    musicState:'pause',
    currentTime: 0,
    timer:null,
    touchTarget:null,
    touch:'end', //拖动进度条
    volume:0.1,
    MusicArr:[],
    startMoveX:0,
    touchMoveX:0,
    endMoveX:0,
    audioAction:'',//next   或者   pre，上一曲还是下一曲
    swipImgBool:false,  //是否开启滑动切歌,
    canSwipImgBool:true  //是否可以开始下一次的滑动切歌
}

const initRenderPage = {//StorageGetter('RenderPage') ||
    position:'main',
    musicListDisplay:'none',
    audioFooterOutDisplay:'none',
    mainPage:2,
    audioFooterOutMusicListDisplay:false,
    songChooseDisplay:false,
    bgDisplay:false,
    songChooseFillData:{},
    dialogDisplay:'none',
    targetArr:'',
    imgLoad:true,
    isClickMode:false,
}

const initLocalData = StorageGetter('localData') || {
    hash:{},//优化是否需要去重
    history:[],
    love:[],
    playing:[],
    index:0,//下标
    mode:2,//0单曲循环，1随机播放，2列表循环
    playMusic:null,//当前正在播放的歌曲数据
}

export const localData = (preState = initLocalData , action) => {
    switch(action.type){
        case actionType.ADD_HISTORY_MUSIC:
            return objectAssign({},preState,{
                history:action.musicArray
            });
        case actionType.ADD_HASH:
            return objectAssign({},preState,{
                hash:objectAssign({},preState.hash,action.hash)
            })
        case actionType.INIT_HASH:
            return objectAssign({},preState,{
                hash:{}
            })
        case actionType.ADD_PLAYING:
            return objectAssign({},preState,{
                playing:action.playing
            })
        case actionType.SAVE_PLAYING_INDEX:
            return objectAssign({},preState,{
                index:action.index
            })
        case actionType.CHANGE_MODE:
            return objectAssign({},preState,{
                mode:(preState.mode+1)%(iconImg.mode.length)
            })
        case actionType.SAVE_PLAY_MUSIC:
            return objectAssign({},preState,{
                playMusic:action.playMusic
            })
        default:
            return preState;
    }
}

export const musicPlay = (preState = initMusicState , action ) => {
    //let index = 0;
    switch(action.type){
        case actionType.PLAY_SONG:
            //preState.pic_big == action.item.songinfo.pic_big ? '' : index = 1;
            return objectAssign({},preState,{
                song_id: action.fetchSongId,
                title: action.item.songinfo.title,
                author: action.item.songinfo.author,
                album_title: action.item.songinfo.album_title,
                file_duration: action.item.bitrate.file_duration,
                //pic_big: action.item.songinfo.pic_big || preState.pic_big,
                pic_big_clone:action.item.songinfo.pic_big || '',
                before_pic_big:action.fetchSongId == preState.song_id  ? preState.before_pic_big: preState.pic_big,
                song_url: action.item.bitrate.show_link,
                lrclink: action.item.songinfo.lrclink,
                success:true
            });
        case actionType.SAVE_PRE_NEXT_PIC:
            return objectAssign({},preState,{
                pre_pic_big:action.pre_pic_big,
                next_pic_big:action.next_pic_big
            })
        case actionType.NET_STATE:
            return objectAssign({},preState,{
                netState:action.netState
            })
        case actionType.MUSIC_IMPORTANT_INFO:
            //preState.pic_big == action.item.pic_big ? '' : index = 1;
            return objectAssign({},preState,{
                title: action.item.title || '',
                author: action.item.author || '',
                album_title: action.item.album_title || '',
                //pic_big:action.item.pic_big || '',
                pic_big_clone:action.item.pic_big || '',
                before_pic_big:action.fetchSongId == preState.song_id ? preState.before_pic_big: preState.pic_big
            })
        case actionType.SAVE_IMG_ANIMATION:
            return objectAssign({},preState,{
                img_animation:action.img_animation
            })
        case actionType.SAVE_SWIP_ANIMATION:
            return objectAssign({},preState,{
                swip_animation:action.swip_animation
            })
        case actionType.START:
            return objectAssign({},preState,{
                start:true
            })
        case actionType.NULL_IMG_BG:
            //preState.pic_big == action.pic_big ? '' : index = 1;
            return objectAssign({},preState,{
                pic_big:action.pic_big || preState.pic_big,
                pic_big_clone:action.pic_big || '',
                before_pic_big:preState.pic_big == action.pic_big ? preState.before_pic_big: preState.pic_big
            })
        case actionType.INIT_PIC:
            return objectAssign({},preState,{
                pic_big:'',
                pic_big_clone:'',
                pre_pic_big:'',
                before_pic_big:'',
                next_pic_big:''
            })
        case actionType.SAVE_SONG_ID:
            return objectAssign({},preState,{
                song_id: action.song_id
            })
        case actionType.SAVE_LYRICS:
            return objectAssign({},preState,{
                lyric:action.lyric
            })
        case actionType.UPDATE_LRC_INDEX:
            return objectAssign({},preState,{
                lrcIndex:action.lrcIndex
            })
        case actionType.CHANGE_LYRIC_P:
            return objectAssign({},preState,{
                changeLyrc:action.changeLyrc !== undefined ? action.changeLyrc : !preState.changeLyrc
            })
        default :
            return preState;
    }
}

export const keywordSearchList = (preState = initKeywordSearchListState,action) => {
    switch(action.type){
        case actionType.SONGS_LIST:
            return objectAssign({},preState,{
                length: action.length,
                isFetching:false,
                keyword: action.keyword,
                result: action.result
            });
        case actionType.IS_FETCHING:
            return objectAssign({},preState,{
                isFetching:true,
                result:[]
            })
        case actionType.CLOSE_IS_FETCHING:
            return objectAssign({},preState,{
                isFetching:action.isFetching
            })
        case actionType.FETCHING_LYRICS:
            return objectAssign({},preState,{
                isFetchingLyrics:action.bool
            })
        case actionType.KEY_WORD:
            return objectAssign({},preState,{
                keyword: action.keyword
            });
        default://记得要加default，不然报错
            return preState;
    }
}

export const AudioController = (preState = initAudioController,action) => {
    switch(action.type){
        case actionType.AUDIO_DOM:
            return objectAssign({},preState,{
                audio:action.audio,
                volume:action.volume
            });
        case actionType.SAVE_START_MOVE_X:
            return objectAssign({},preState,{
                startMoveX:action.startMoveX,
                swipImgBool:action.swipImgBool
            })
        case actionType.SAVE_CAN_SWIP_IMG_BOOL:
            return objectAssign({},preState,{
                canSwipImgBool:action.canSwipImgBool
            })
        case actionType.SAVE_TOUCH_MOVE_X:
            return objectAssign({},preState,{
                touchMoveX:preState.endMoveX+action.touchMoveX
            })
        case actionType.SAVE_END_MOVE:
            return objectAssign({},preState,{
                touchMoveX:action.touchMoveX,
                endMoveX:action.touch,
                startMoveX:action.startMoveX
            })
        case actionType.SAVE_SWIP_IMG_STATE:
            return objectAssign({},preState,{
                swipImgBool:action.swipImgBool,
            })
        case actionType.SAVE_ACTION:
            return objectAssign({},preState,{
                audioAction:action.audioAction
            })
        case actionType.MUSIC_STATE:
            return objectAssign({},preState,{
                musicState:action.musicState
            })
        case actionType.SONG_TIME_UPDATE:
            return objectAssign({}, preState, {
                currentTime: action.currentTime,
                touch: action.touch || preState.touch
            })
        case actionType.PUSH_INDEX_TARGET:
            return objectAssign({},preState,{
                touchTarget:action.indexTarget,
                touch:action.touch
            })
        case actionType.SONG_VOL_UPDATE:
            return objectAssign({}, preState, {
                volume: action.volume
            })
        default :
            return preState;
    }
}

export const RenderPage = (preState = initRenderPage,action ) => {
    switch(action.type){
        case actionType.MUSIC_LISTSHOW:
            return objectAssign({},preState,{
                musicListDisplay:action.musicListDisplay
            });
        case actionType.CHANGE_POSITION:
            return objectAssign({},preState,{
                position:action.position || preState.position
                //audioFooterOutDisplay:action.audioFooterOutDisplay || preState.audioFooterOutDisplay
            });
        case actionType.SHOW_AUDIO_FOOTER:
            return objectAssign({},preState,{
                audioFooterOutDisplay:action.audioFooterOutDisplay
            });
        case actionType.IMG_LOAD:
            return objectAssign({},preState,{
                imgLoad:action.imgLoad
            })
        case actionType.CHANGE_MAIN_PAGE:
            return objectAssign({},preState,{
                mainPage:action.mainPage
            })
        case actionType.IS_CLICK_MODE:
            return objectAssign({},preState,{
                isClickMode:action.isClickMode
            })
        case actionType.CHANGE_DIALOG_DISPLAY:
            return objectAssign({},preState,{
                dialogDisplay:action.dialogDisplay
            })
        case actionType.SAVE_CLEAR_ALL_TARGET:
            return objectAssign({},preState,{
                targetArr:action.targetArr
            })
        case actionType.CHANGE_BG_DISPLAY:
            return objectAssign({},preState,{
                bgDisplay:action.bgDisplay
            })
        case actionType.CHANGE_BG:
            return objectAssign({},preState,{
                bgDisplay:false,
                audioFooterOutMusicListDisplay:false,
                songChooseDisplay:false
            })
        case actionType.CHANGE_AUDIO_FOOTER_OUT_MUSICLIST:
            return objectAssign({},preState,{
                audioFooterOutMusicListDisplay:true,
                bgDisplay:true
            })
        case actionType.CHANGE_SONG_CHOOSE:
            return objectAssign({},preState,{
                songChooseDisplay:true,
                bgDisplay:true,
                songChooseFillData:action.songChooseFillData
            })
        default :
            return preState;
    }
}


