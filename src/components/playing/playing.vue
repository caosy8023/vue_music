<template>
    <div class="playing">
        <mt-header fixed :title="$store.getters.playDetail.songname">
            <span slot="left" @click="$router.go(-1)">
			  	<img src="../../assets/arrow-down.png" width="26">
			</span>
          <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="content">
            <div class="main">
                <div class="title">
                    <p>{{$store.getters.playDetail.singername}}</p>
                </div>
                <div v-show="showImg" @click="lyrics" class="img" :style="'transform:rotate('+transform+'deg)'">
                    <img :src="img" alt="">
                </div>
                <div class="lyc" v-show="!showImg">
                    <p class="lyc-item" v-for="(item,index) in songLyrics" :key="index">{{item.text}} <span style="display:none">{{item.time}}</span></p>
                </div>
            </div>
            <div class="bottom">
                <div class="time">
                    <span style="color:white;position: relative;top:3px">{{timeFormate(currentTime)}}</span>
                    <div @click="switchProgress" class="wrap" style="display:inline-block">
                        <div @click="switchProgress" style="display:inline-block;border: 0.5px solid white;position: relative" class="progress" ref="progress">
                            <div class="progress-bar"></div>
                            <!-- <span class="progress-ball" ></span> -->
                        </div>
                    </div>
                    
                    <span style="color:white;position: relative;top:3px">{{timeFormate(allTime)}}</span>
                </div>
                <div class="paly-control">
                    <img class="kinds" src="../../assets/cycle-2.png" alt="">
                    <img @click="playPrev" class="prev" src="../../assets/back.png" alt="">
                    <img @click="playMusic2" v-if="!$store.getters.isPlay" class="play" src="../../assets/play-2.png" alt="">
                    <img @click="pauseMusic2" v-if="$store.getters.isPlay" class="play" src="../../assets/pause-2.png" alt="">
                    <img @click="playNext" class="next" src="../../assets/prev.png" alt="">
                    <img class="list" src="../../assets/list.png" alt="">
                </div>
            </div>
        </div>
        <div class="bg" :style="'background-image:url('+img+')'">

        </div>
        <div class="overlay">

        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'playing',
  components: {},
  props: {},
  data() {
    return {
        img:'',
        transform:0,
        musicTime:'',
        currentTime:'',
        allTime:0,
        showImg:true,
        songLyrics:'',
    };
  },
  watch: {
      '$store.getters.playDetail':{
          handler(newV,oldV){
              this.img = `http://imgcache.qq.com/music/photo_new/T002R150x150M000${this.$store.getters.playDetail.albummid}.jpg?max_age=2592000`
              this.getLyrics()
          },
          deep:true
      },
      '$store.getters.isEnd':{
          handler(newV,oldV){
              if(newV == false){
                  setTimeout(()=>{
                    var audio = document.getElementById('audio')
                    this.musicTime = this.timeFormate(audio.duration)
                    this.allTime = audio.duration
                    this.currentTime = audio.currentTime
                    console.log(this.currentTime)
                  },200)
              }
          },
          deep:true
      },
      'currentTime':{
          handler(newV,oldV){
            var div = document.querySelector('.lyc')
            var pNode = document.querySelectorAll('.lyc-item')
            this.songLyrics.forEach((item,index) => {
                if(item.time == this.timeFormate2(newV)){
                    var classList = pNode[index].classList
                    pNode[index].classList.add('active')
                    console.log(index)
                    for(var i=0;i<pNode.length;i++){
                        if(i !== index){
                            pNode[i].classList.remove('active')
                        }
                    }
                }
            })
          },
          deep:true
      }
  },
  computed: {},
  methods: {
      formateLyc(data,istotalTime){
        var lyricArr =[]
        // 在这里对data进行歌词处理
        // 转换其中的ascll
        var newdata = data.replace(/&#(\d+);/g,function(data){
            return String.fromCharCode(data.substr(2,2))
        })
        var dataArr = newdata.split('\n')
        for(var i =0;i<dataArr.length;i++){
            //以']'去分隔时间和歌词
            var timetext = dataArr[i].split(']')
            //需将时间的前半中括号去除,并将时间转换
            var  time = timetext[0].replace(/[\[]/g,'').split(':')
            
            if(istotalTime){
                var changetime = time[0] * 60 + parseInt(time[1])
            }else{
                var changetime = time[0] + ':'+ parseInt(time[1])
            } 
            //进行判断是否有歌词，没有的就跳过
            if(!timetext[1]){
                continue;
            }
            var text = timetext[1]
            var obj ={
                time:changetime,
                text:text
            }
            lyricArr.push(obj)
        }
        return lyricArr
      },
      lyrics(){
          this.showImg = false
      },
      playPrev(){
          var playAround = this.$store.getters.playAround
          if(playAround.prev == undefined){
            alert('歌曲已找不到')
            return
          }
          // console.log(playAround)
          this.play(playAround.prev.songmid,playAround.prev.songname,playAround.prev.singername,playAround.prev.albumname,playAround.prev.albummid,playAround.prev.index)
          var audio = document.getElementById('audio')
          this.allTime = audio.duration
      },
      playNext(){
          var playAround = this.$store.getters.playAround
          if(playAround.next == undefined){
            alert('歌曲已找不到')
            return
          }
          // console.log(playAround)
          this.play(playAround.next.songmid,playAround.next.songname,playAround.next.singername,playAround.next.albumname,playAround.next.albummid,playAround.next.index)
          var audio = document.getElementById('audio')
          this.allTime = audio.duration
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
            songmid:songmid,
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
      switchProgress(){
        var body = document.querySelector('body').offsetWidth/10
        var e = window.event
        var audio = document.getElementById('audio')
        var progress = document.querySelector('.progress-bar')
        progress.style = 'left:'+e.layerX+'px'
        this.currentTime = (e.layerX/(7.04*body))*this.allTime
        audio.currentTime = this.currentTime
      },
      touchstart(){
          var e = window.event
          var audio = document.getElementById('audio')
          var progress = document.querySelector('.progress-bar')
          progress.style = 'left:'+e.target.offsetLeft-54+'px'
          this.currentTime = ((e.touches[0].clientX-54)/264)*this.allTime
          audio.currentTime = this.currentTime
          console.log(e.touches[0].clientX)
      },
      back(){
          this.$router.go(-1)
      },
      playMusic2(){
          var audio = document.getElementById('audio')
          audio.play()
          this.$store.dispatch('IS_PLAY',true)
      },
      pauseMusic2(){
          var audio = document.getElementById('audio')
          audio.pause()
          this.$store.dispatch('IS_PLAY',false)
      },
      getImg(){
        this.img = `http://imgcache.qq.com/music/photo_new/T002R150x150M000${this.$store.getters.playDetail.albummid}.jpg?max_age=2592000`
        // console.log(this.img)
      },
      timeFormate(time){
          var m = parseInt(time/60)
          var s = parseInt(time%60)
          if(time/60 < 10){
              m = '0'+parseInt(time/60)
          }
          if(parseInt(time%60) < 10){
              s = '0'+parseInt(time%60)
          }
          return m+':'+s
      },
      timeFormate2(time){
          var m = parseInt(time/60)
          var s = parseInt(time%60)
          if(time/60 < 10){
              m = '0'+parseInt(time/60)
          }
          if(parseInt(time%60) < 10){
              s = parseInt(time%60)
          }
          return m+':'+s
      },
      getLyrics(){
          axios({
              url:'https://api.mlwei.com/music/api/',
              method:'get',
              params:{
                  key:523077333,
                  cache:1,
                  type:'lrc',
                  id:this.$store.getters.playDetail.songmid
              }
          }).then(res => {
            //   console.log(res)
              this.songLyrics = this.formateLyc(res.data)
          }).catch(err => {
              console.log(err)
          })
      }
  },
  created() {},
  mounted() {
      this.getLyrics()
      var _this = this
      this.getImg()
      setInterval(()=>{
          this.transform++
      },40)
      var audio = document.getElementById('audio')
      var progress = document.querySelector('.progress-bar')
      setTimeout(()=>{
        //   var audio = document.getElementById('audio')
          this.musicTime = this.timeFormate(audio.duration)
          this.allTime = audio.duration
          this.currentTime = audio.currentTime
        //   console.log(this.allTime,this.currentTime)
      },200)
      var body = document.querySelector('body').offsetWidth/10
      setTimeout(()=>{
        audio.addEventListener('timeupdate',function(){
            _this.currentTime = audio.currentTime
            _this.musicTime = _this.timeFormate(audio.duration)
            progress.style = 'left:'+(_this.currentTime/_this.allTime)*7.04*body+'px'
            // console.log(_this.currentTime,_this.musicTime,_this.allTime)
        })
      },100)
  }
};
</script>
<style lang="scss">
    .playing{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .mint-header{
            background: none;
            .mint-header-title{
                font-size: 18px;
            }
        }
        .content{
            position: relative;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            padding-top: 40px;
            .main{
                width: 100%;
                height: 488px;
                .title{
                    width: 100%;
                    height: 20px;
                    margin-top:10px;
                    color: white!important;
                    line-height: 20px;
                    text-align: center;
                    z-index: 1000000
                }
                .img{
                    margin-top:30px;
                    width: 330px;
                    height: 330px;
                    text-align: center;
                    margin-left: 22.5px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .lyc{
                    margin-top: 10px;
                    height: 430px;
                    overflow-x: hidden;
                    overflow-y: scroll;
                    .active{
                        color: aqua;
                        font-size: 18px;
                    }
                    p{
                        font-size: 16px;
                        text-align: center;
                        color: #f3e4e4;
                        margin-top: 10px;
                    }
                }
            }
            .bottom{
                width: 100%;
                height: 180px;
                .wrap{
                    width: 264px;
                    height: 20px;
                }
                .time{
                    padding: 0 20px;
                    .progress-bar{
                        position: absolute;
                        width: 6px;
                        top:-3px;
                        height: 6px;
                        background: #6f5f5f;
                        border-radius: 50%;
                    }
                }
                .progress{
                    width: 264px;
                }
                .paly-control{
                    width: 100%;
                    height: 50px;
                    margin-top: 10px;
                    padding: 0 20px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .kinds{
                        width: 24px;
                    }
                    .prev{
                        width: 32px;
                    }
                    .play{
                        width: 48px;
                    }
                    .next{
                        width: 32px;
                    }
                    .list{
                        width: 24px;
                    }
                }
            }
        }
        .bg{
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: no-repeat;
            background-size: cover;
            transform: scale(1.65);
            background-position: bottom center;
            filter: blur(15px);
            z-index: -2;
        }
        .overlay{
            background-color: rgba(0, 0, 0, 0.4);
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: -1
        }
    }
</style>