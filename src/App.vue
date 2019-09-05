<template>
  <div id="app">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    
    <div @click="goPlaying" v-show="$route.meta.tabbar" class="tabbar">
      <img :style="'transform:rotate('+transform+'deg)'" class="logo" src="https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6" alt="">
      <img v-show="!$store.getters.isPlay" class="play" @click.stop="playMusic" src="./assets/play-2.png" alt="">
      <img v-show="$store.getters.isPlay" class="play" @click.stop="pauseMusic" src="./assets/pause-2.png" alt="">
      <div class="detail">
        <!-- <marquee v-if="$store.getters.isPlay" direction="right">
        <span class="songname">{{$store.getters.playDetail.songname}}</span>
        <span class="singername">{{$store.getters.playDetail.singername}}</span>
        <span class="albumname">{{$store.getters.playDetail.albumname}}</span>
        </marquee>  -->
      <!-- <div v-if="!$store.getters.isPlay"> -->
        <span class="songname">{{$store.getters.playDetail.songname}}</span>
        <span class="singername">{{$store.getters.playDetail.singername}}</span>
        <span class="albumname">{{$store.getters.playDetail.albumname}}</span>
        <!-- </div> -->
      </div>
      <img class="list-green" src="./assets/list-green.png" alt="">
      <audio id="audio" ref="audio" hidden autoplay controls="controls" :src="$store.getters.play"></audio>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'App',
  data(){
    return{
      isPlay:false,
      songList:{},
      transform:0,
      interval:''
    }
  },
  mounted(){
    var _this = this
    // if(!this.$route.meta.tabbar){
    //   return
    // }
    // console.log(this.$store.getters.play)
    var audio = document.getElementById('audio')
    audio.pause()
    this.$store.dispatch('IS_PLAY',false)
    setTimeout(()=>{
      audio.addEventListener('ended',function(){
        _this.$store.dispatch('GET_ISEND',true)
        _this.$store.dispatch('IS_PLAY',false)
      })
    },200)
  },
  watch:{
    '$store.getters.isPlay':{
      handler(newV,oldV){
        if(newV == true){
          this.interval = setInterval(()=>{
              this.transform++
          },20)
        }
        if(newV == false){
          clearInterval(this.interval)
          // this.transform = 0
        }
        // if(newV == true){
        //   var audios = document.getElementById('audio')
        //   audios.play()
        //   console.log(audios)
        // }else{
        //   var audio = document.getElementById('audio')
        //   audio.pause()
        //   console.log(audio)
        // }
      },
      deep:true
    },
    '$store.getters.isEnd':{
      handler(newV,oldV){
        if(newV){
          // console.log(newV)
          var playAround = this.$store.getters.playAround
          if(playAround.next == undefined){
            return
          }
          // console.log(playAround)
          this.play(playAround.next.songmid,playAround.next.songname,playAround.next.singername,playAround.next.albumname,playAround.next.albummid,playAround.next.index)
          
        }
      },
      deep:true
    },
    '$route.path':{
      handler(newV,oldV){
        if(newV == '/playing'){

        }
      },
      deep:true
    }
  },
  methods:{
    goPlaying(){
      this.$router.push({path:'/playing'})
    },
    play(songmid,songname,singername,albumname,albummid,index){
      this.songList = this.$store.getters.songList
      // console.log(songmid)
      axios({
        method:'get',
        url:'/api/base/fcgi-bin/fcg_music_express_mobile3.fcg',
        params:{
          ...this.basicParams,
          guid:'2095717240',
          // vkey:'472C3A312C3593C042DC3A10BC20CDD41E3D1E47079A2B339663558CAFD3BBD4937803B7284583CC92B4576D439F48CA3C5501759C9FF371',
          filename:'C400'+songmid+'.m4a',
          uin:0,
          cid:'205361747',
          songmid:songmid
        }
      }).then(res => {
        var vkey = res.data.data.items[0].vkey
        var url = 'http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400'+songmid+'.m4a?guid=2095717240&vkey='+vkey+'&uin=0&fromtag=53'
        this.$store.dispatch('GET_PLAY',url)
        this.$store.dispatch('IS_PLAY',true)
        var playDetail = {
          songname:songname,
          singername:singername,
          albumname:albumname,
          albummid:albummid
        }
        var playAround = {}
        if(index>0 && index<this.songList.length - 1){
          playAround = {
            prev:{
              songmid:this.songList[index-1].data.songmid,
              songname:this.songList[index-1].data.songname,
              singername:this.songList[index-1].data.singer[0].name,
              albumname:this.songList[index-1].data.albumname,
              albummid:this.songList[index-1].data.albummid,
              index:index-1
            },
            next:{
              songmid:this.songList[index+1].data.songmid,
              songname:this.songList[index+1].data.songname,
              singername:this.songList[index+1].data.singer[0].name,
              albumname:this.songList[index+1].data.albumname,
              albummid:this.songList[index+1].data.albummid,
              index:index+1
            },
          }
        }
        if(index == 0){
          playAround = {
            prev:{
              songmid:this.songList[this.songList.length-1].data.songmid,
              songname:this.songList[this.songList.length-1].data.songname,
              singername:this.songList[this.songList.length-1].data.singer[0].name,
              albumname:this.songList[this.songList.length-1].data.albumname,
              albummid:this.songList[this.songList.length-1].data.albummid,
              index:this.songList.length-1
            },
            next:{
              songmid:this.songList[index+1].data.songmid,
              songname:this.songList[index+1].data.songname,
              singername:this.songList[index+1].data.singer[0].name,
              albumname:this.songList[index+1].data.albumname,
              albummid:this.songList[index+1].data.albummid,
              index:index+1
            },
          }
        }
        if(index == this.songList.length - 1){
          playAround = {
            prev:{
              songmid:this.songList[index-1].data.songmid,
              songname:this.songList[index-1].data.songname,
              singername:this.songList[index-1].data.singer[0].name,
              albumname:this.songList[index-1].data.albumname,
              albummid:this.songList[index-1].data.albummid,
              index:index-1
            },
            next:{
              songmid:this.songList[0].data.songmid,
              songname:this.songList[0].data.songname,
              singername:this.songList[0].data.singer[0].name,
              albumname:this.songList[0].data.albumname,
              albummid:this.songList[0].data.albummid,
              index:0
            },
          }
        }
        // console.log(playAround)
        this.$store.dispatch('GET_PLAYAROUND',playAround)
        this.$store.dispatch('GET_PLAYDEFAIL',playDetail)
      }).catch(err => {
        console.log(err)
      })
    },
    playMusic(){
      var audio = document.getElementById('audio')
      audio.play()
      this.$store.dispatch('IS_PLAY',true)
    },
    pauseMusic(){
      var audio = document.getElementById('audio')
      audio.pause()
      this.$store.dispatch('IS_PLAY',false)
    }
  }
}
</script>

<style lang="scss">
// .toggle-enter{
// 		opacity: 0;
// 		transform: translateX(100%);
// 	}
// 	.toggle-leave-to{
// 		opacity: 0;
// 		transform: translateX(-100%);
// 	}
// 	.toggle-enter-active,
// 	.toggle-leave-active{
// 		transition: all 0.5s ease;
// 		position: absolute;
// 	}
*{
  margin: 0;
  list-style: none;
  padding: 0;
  text-decoration: none;
}
#app {
  .tabbar{
    position: fixed;
    height: 56px;
    background-color: white;
    line-height: 56px;
    width: 100%;
    bottom: 0;
    .logo{
      height: 45px;
      width: 45px;
      margin-top: 5px;
      margin-left: 5px;
    }
    .play{
      position: absolute;
      height: 30px;
      width: 30px;
      top:9px;
      right: 55px;
    }
    .detail{
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      position: absolute;
      top: 12px;
      left: 70px;
      .songname{
        margin-right: 8px;
        font-size: 16px;
      }
      .singername{
        color: rgba(0,0,0,0.5);
        margin-right: 3px;
      }
      .albumname{
        color: rgba(0,0,0,0.5);
      }
    }
    .list-green{
      position: absolute;
      height: 30px;
      width: 30px;
      top:9px;
      right: 10px;
    }
    #audio{
      position: absolute;
      top: -56px;
    }
  }
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}
</style>
