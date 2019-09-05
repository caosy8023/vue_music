import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
Vue.use(Vuex)
var playMusic = JSON.parse(localStorage.getItem('playMusic'))
var playDetail = JSON.parse(localStorage.getItem('playDetail'))
var playAround = JSON.parse(localStorage.getItem('playAround'))
var songList = JSON.parse(localStorage.getItem('songList'))
if(playMusic == null || playMusic == undefined){
    playMusic = 'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003NGKTc2tabpb.m4a?guid=2095717240&vkey=9FC6618705BF6EE117BC9A791D8DC93CF13F8D6FE3911D0974061258E5202B9204EDAA0323E1DF597C44A9FD88F416BD11399A302ADF9951&uin=0&fromtag=53'
}
if(playDetail == null || playDetail == undefined){
    playDetail = {
        songname:'笑场',
        singername:'薛之谦',
        albumname:'尘'
    }
}
if(playAround == null || playAround == undefined){
    playAround = {
        
    }
}
if(songList == null || songList == undefined){
    playAround = []
}
const state = {
    playMusic:playMusic,
    isPlay:false,
    playDetail:playDetail,
    isEnd:false,
    playAround:playAround,
    songList:songList
}
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
