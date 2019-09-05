import {GET_PLAY,IS_PLAY,GET_PLAYDEFAIL,GET_ISEND,GET_PLAYAROUND,
    GET_SONGLIST} from './mutation-types'
export default {
    [GET_PLAY](context,data){
        context.commit('GET_PLAY',data)
    },
    [IS_PLAY](context,data){
        context.commit('IS_PLAY',data)
    },
    [GET_PLAYDEFAIL](context,data){
        context.commit('GET_PLAYDEFAIL',data)
    },
    [GET_ISEND](context,data){
        context.commit('GET_ISEND',data)
    },
    [GET_PLAYAROUND](context,data){
        context.commit('GET_PLAYAROUND',data)
    },
    [GET_SONGLIST](context,data){
        context.commit('GET_SONGLIST',data)
    }
}