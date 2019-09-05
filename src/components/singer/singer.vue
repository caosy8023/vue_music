<template>
    <div class="singer">
        <mt-header fixed title="">
          <mt-button @click="back" icon="back" slot="left"></mt-button>
          <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <div class="content">
          <div class="top">
            <div :style="'background-image:url('+img+')'" class="cover-wrap">
              <p class="name">{{singerData.singer_name}}</p>
              <p class="fans">粉丝：{{parseInt(singerData.fans/10000)}}万</p>
            </div>
          </div>
          
            <mt-navbar fixed v-model="selected">
              <mt-tab-item id="1">单曲</mt-tab-item>
              <mt-tab-item id="2">详情</mt-tab-item>
            </mt-navbar>
          <div class="song">
            <mt-tab-container v-model="selected">
              <mt-tab-container-item id="1">
                <div @click="play(item.musicData.songmid,item.musicData.songname,item.musicData.singer[0].name,item.musicData.albumname,item.musicData.albummid,index)" v-for="(item,index) in songList1" :key="index" class="song-item">
                  <div class="item-top">
                    {{index+1}} <span>{{item.musicData.songname}}</span>
                  </div>
                  <div class="item-bottom">
                    <span v-for="item1 in item.musicData.singer" :key="item1.id">{{ item1.name+' '}}</span>
                    <span>{{item.musicData.albumname}}</span>
                  </div>
                </div>
              </mt-tab-container-item>
              <mt-tab-container-item ref="detail" id="2">
                  <div class="detail">
                    <p  v-html="singerData.SingerDesc"
							style="color: rgba(0, 0, 0, .5);
							padding: 0 15px;
							font-size: 14px;
							line-height: 22px;
							margin-top: 20px;"></p>
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
  name:'singer',
  components: {},
  props: {},
  data() {
    return {
        img:'',
        selected:'1',
        songList1:[],
        singerData:{},
        singerDetail:{}
    };
  },
  watch: {},
  computed: {},
  methods: {
    play(songmid,songname,singername,albumname,albummid,index){
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
        if(index>0 && index<this.songList1.length - 1){
          playAround = {
            prev:{
              songmid:this.songList1[index-1].data.songmid,
              songname:this.songList1[index-1].data.songname,
              singername:this.songList1[index-1].data.singer[0].name,
              albumname:this.songList1[index-1].data.albumname,
              albummid:this.songList1[index-1].data.albumname,
              index:index-1
            },
            next:{
              songmid:this.songList1[index+1].data.songmid,
              songname:this.songList1[index+1].data.songname,
              singername:this.songList1[index+1].data.singer[0].name,
              albumname:this.songList1[index+1].data.albumname,
              albummid:this.songList1[index+1].data.albummid,
              index:index+1
            },
          }
        }
        if(index == 0){
          playAround = {
            prev:{
              songmid:this.songList[this.songList1.length-1].data.songmid,
              songname:this.songList[this.songList1.length-1].data.songname,
              singername:this.songList[this.songList1.length-1].data.singer[0].name,
              albumname:this.songList[this.songList1.length-1].data.albumname,
              albummid:this.songList[this.songList1.length-1].data.albummid,
              index:this.songList.length-1
            },
            next:{
              songmid:this.songList1[index+1].data.songmid,
              songname:this.songList1[index+1].data.songname,
              singername:this.songList1[index+1].data.singer[0].name,
              albumname:this.songList1[index+1].data.albumname,
              albummid:this.songList1[index+1].data.albummid,
              index:index+1
            },
          }
        }
        if(index == this.songList1.length - 1){
          playAround = {
            prev:{
              songmid:this.songList1[index-1].data.songmid,
              songname:this.songList1[index-1].data.songname,
              singername:this.songList1[index-1].data.singer[0].name,
              albumname:this.songList1[index-1].data.albumname,
              albummid:this.songList1[index-1].data.albummid,
              index:index-1
            },
            next:{
              songmid:this.songList1[0].data.songmid,
              songname:this.songList1[0].data.songname,
              singername:this.songList1[0].data.singer[0].name,
              albumname:this.songList1[0].data.albumname,
              albummid:this.songList1[0].data.albummid,
              index:0
            },
          }
        }
        // console.log(playAround)
        this.$store.dispatch('GET_PLAYAROUND',playAround)
        this.$store.dispatch('GET_SONGLIST',this.songList1)
        this.$store.dispatch('GET_PLAYDEFAIL',playDetail)
      }).catch(err => {
        console.log(err)
      })
    },
    back(){
      this.$router.go(-1)
    },
    getSinger(){
        axios({
            url:'/api/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
            method:'get',
            params:{
                ...this.basicParams,
                begin: 0,
                num: 30,
                order: 'listen',
                from: 'h5',
                songstatus: 1,
                singermid:this.$router.currentRoute.query.id
            }
        }).then(res => {
            this.singerData = res.data.data
            this.songList1 = res.data.data.list
            var songList = []
            for(let i=0;i<this.songList1.length;i++){
              this.songList1[i].data = this.songList1[i].musicData
            }
            console.log(this.songList1)
        }).catch(err => {
            console.log(err)
        })
    }
  },
  created() {
    // this.getRankList()
    this.img = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${this.$router.currentRoute.query.id}.jpg?max_age=2592000`
    this.getSinger()
  },
  mounted() {
      
  },
};
</script>
<style lang="scss">
  .singer{
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
        .name{
            position: absolute;
            top:190px;
            text-align: center;
            font-size: 16px;
            color: white;
            margin-bottom: 5px;
            width: 100%;
        }
        .fans{
            position: absolute;
            top:210px;
            text-align: center;
            font-size: 14px;
            color: white;
            width: 100%;
        }
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
        .detail{
          padding: 5px 15px;
          color: rgba(0, 0, 0, 0.5);
          font-size: 14px;
        }
        padding-top: 15px;
        position: absolute;
        .song-item{
          height: 60px;;
          width: 100%;
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