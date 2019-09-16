<template>
    <div class="rankList">
        <mt-header fixed title="">
          <mt-button @click="back" icon="back" slot="left"></mt-button>
          <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="content">
          <div class="top">
            <div :style="'background-image:url('+img+')'" class="cover-wrap">
              
            </div>
          </div>
          
            <mt-navbar fixed v-model="selected">
              <mt-tab-item id="1">单曲</mt-tab-item>
              <mt-tab-item id="2">详情</mt-tab-item>
            </mt-navbar>
          <div class="song">
            <mt-tab-container v-model="selected">
              <mt-tab-container-item id="1">
                <div @click="play(item.data.songmid,item.data.songname,item.data.singer[0].name,item.data.albumname,item.data.albummid,index)" v-for="(item,index) in songList" :key="index" class="song-item">
                  <div class="item-top">
                    {{index+1}} <span>{{item.data.songname}}</span>
                  </div>
                  <div class="item-bottom">
                    {{parseInt(item.in_count*100)+'%' }}
                    <span v-for="item1 in item.data.singer" :key="item1.id">{{ item1.name+' '}}</span>
                    <span>{{item.data.albumname}}</span>
                  </div>
                </div>
              </mt-tab-container-item>
              <mt-tab-container-item ref="detail" id="2">
                  <div class="detail">
                    
                  </div>
              </mt-tab-container-item>
            </mt-tab-container>
          </div>
          
        </div>
        
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'rankList',
  components: {},
  props: {},
  data() {
    return {
        rankData:'',
        img:'',
        selected:'1',
        songList:'',
        playAround:{},
        id:this.$route.params.id
    };
  },
  watch: {
    // '$store.getters.isEnd':{
    //   handler(newV,oldV){
    //     if(newV){
    //       var playAround = this.$store.getters.playAround
    //       if(playAround.next == undefined){
    //         return
    //       }
    //       console.log(playAround)
    //       this.play(playAround.next.songmid,playAround.next.songname,playAround.next.singername,playAround.next.albumname,playAround.next.index)
    //     }
    //   },
    //   deep:true
    // }
  },
  computed: {},
  methods: {
    play(songmid,songname,singername,albumname,albummid,index){
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
              albummid:this.songList[index-1].data.albumname,
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
        this.$store.dispatch('GET_SONGLIST',this.songList)
      }).catch(err => {
        console.log(err)
      })
    },
    back(){
      this.$router.go(-1)
    },
    getRankList(){
      axios({
        url:'/api/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
        method:'get',
        params:{
          ...this.basicParams,
          type: 'top',
          page: 'detail',
          topid: this.id
        }
      }).then(res => {
          this.rankData = res.data
          this.img = this.rankData.topinfo.pic_v12
          this.songList = res.data.songlist
          // console.log(this.songList)
          var div = document.querySelector('.detail')
          div.innerHTML = this.rankData.topinfo.info
      }).catch(err => {
         console.log(err)
      })
    },
  },
  created() {
    this.getRankList()
  },
  mounted() {
    // console.log(this.$route.params.id)
  },
};
</script>
<style lang="scss">
  .rankList{
    .mint-header{
      background: none;
      font-size: 20px;
      .mintui{
        font-size: 25px!important;
      }
    }
    .content{
      position: absolute;
      margin-bottom: 56px;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      // overflow: hidden;
      .top{
        background-color: #f8f5f5;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
      }
      .song{
        position: absolute;
        overflow: auto;
        top: 310px;
        left: 0;
        bottom: 0;
        right: 0;
      }
      .cover-wrap{
        position: absolute;
        background-repeat:no-repeat;
        background-color: #36343a;
        background-size:cover;
        width: 100%;
        height: 260px;
      }
      .mint-navbar{
        top:260px;
        // position: absolute;
        .mint-tab-item{
          .mint-tab-item-label{
            font-size: 16px;
          }
        }
        .is-selected{
          border-color: #31c27c;
          color: #31c27c;
        }
      }
      .mint-tab-container{
        width: 375px;
        .detail{
          padding: 5px 15px;
          color: rgba(0, 0, 0, 0.5);
          font-size: 14px;
        }
        padding-top: 15px;
        position: absolute;
        .song-item{
          height: 60px;;
          width: 375px;
          line-height: 50px;
          padding: 5px 15px;
          .item-top{
            color: rgb(255, 69, 0);
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            white-space: nowrap;
            width: 315px;
            overflow: hidden;
            -o-text-overflow:ellipsis;
            text-overflow: ellipsis;
            span{
              display: inline-block;
              margin-left: 15px;
              font-size: 16px;
              color:black;
            }
          }
          .item-bottom{
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            white-space: nowrap;
            width: 315px;
            overflow: hidden;
            color: rgba(0, 0, 0, 0.5);
            span{
              display: inline-block;
              margin-left: 5px;
            }
          }
        }
      }
    }
    
  }
</style>