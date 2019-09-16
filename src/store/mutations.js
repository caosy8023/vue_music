import {GET_PLAY,IS_PLAY,GET_PLAYDEFAIL,GET_ISEND,GET_PLAYAROUND,GET_SONGLIST} from './mutation-types'
export default {
    [GET_PLAY](state,data){
        state.playMusic = data
        state.isEnd = false
        localStorage.setItem('playMusic',JSON.stringify(state.playMusic))
        // console.log(state.playMusic)
    },
    [IS_PLAY](state,data){
        // console.log(data)
        state.isPlay = data
    },
    [GET_PLAYDEFAIL](state,data){
        state.playDetail = data
        localStorage.setItem('playDetail',JSON.stringify(state.playDetail))
        console.log(state.playDetail)
    },
    [GET_ISEND](state,data){
        state.isEnd = data
        // console.log(state.isEnd)
    },
    [GET_PLAYAROUND](state,data){
        state.playAround = data
        localStorage.setItem('playAround',JSON.stringify(state.playAround))
        // console.log(state.playAround)
    },
    [GET_SONGLIST](state,data){
        state.songList = data
        localStorage.setItem('songList',JSON.stringify(state.songList))
        // console.log(state.songList)
    }
    
}