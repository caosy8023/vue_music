import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index/index'
import singerList from '@/components/singerList/singerList'
import topList from '@/components/topList/topList'
import radioList from '@/components/radioList/radioList'
import rankList from '@/components/rankList/rankList'
import singer from '@/components/singer/singer'
import playing from '@/components/playing/playing'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/index',
      component: index
    },
    {
      path: '/index',
      name:'index',
      component: index,
      meta:{
        tabbar:true,
        keepAlive:true
      }
    },
    {
      path: '/singerList',
      name:'singerList',
      component: singerList,
      meta:{
        tabbar:true,
        keepAlive:true
      }
    },
    {
      path: '/topList',
      name:'topList',
      component: topList,
      meta:{
        tabbar:true,
        keepAlive:true
      }
    },
    {
      path: '/radioList',
      name:'radioList',
      component: radioList,
      meta:{
        tabbar:true,
        keepAlive:true
      }
    },
    {
      path: '/rankList/:id',
      name:'rankList',
      component: rankList,
      meta:{
        tabbar:true,
        keepAlive:false
      }
    },
    {
      path: '/singer',
      name:'singer',
      component: singer,
      meta:{
        tabbar:true,
        keepAlive:false
      }
    },
    {
      path: '/playing',
      name:'playing',
      component: playing,
      meta:{
        tabbar:false,
        keepAlive:false
      }
    }
  ]
})
