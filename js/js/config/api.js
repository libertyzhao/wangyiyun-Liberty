//api
const apiPath = {
    url:"http://music.163.com/api/search/get/",
    search_method:"baidu.ting.search.common",
    song_method: 'baidu.ting.song.play',
    channel_method: 'baidu.ting.billboard.billList'
};

document.cookie = 'appver = 2.0.2';
class Api{
    getSearch(param,type = 1,limit = 20,offset = 1){
        return `${apiPath.url}?s=${param}&type=${type}&limit=${limit}&offset=${offset}`
    }
}

export default new Api();