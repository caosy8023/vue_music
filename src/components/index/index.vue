<template>
    <div class="index">
        <mt-header v-if="show" fixed title="音乐馆"></mt-header>
        <mt-search
        @click="focus"
        v-model="value"
        cancel-text="取消"
        placeholder="搜索">
        </mt-search>
        <mt-swipe>
            <mt-swipe-item v-for="item in indexMsg.slider" :key="item.id">
                <a :href="item.linkUrl" target="_blank">
                    <img :src="item.picUrl" alt="" width="100%" height="100%">
                </a>
            </mt-swipe-item>
        </mt-swipe>
        <ul class="radio">
            <li class="radio-item" @click="$router.push({path:item.route})" v-for="item in radioList" :key="item.url">
                <img :src="item.url" alt="">
                <span>{{item.title}}</span>
            </li>
        </ul>
        <div class="title">热 门 推 荐</div>
        <div class="hot">
            <div class="content">
                <div class="main">
                    <div @click="play(item.data.songmid,item.data.songname,item.data.singer[0].name,item.data.albumname,item.data.albummid,index)" v-for="(item,index) in hotMusic" :key="index" class="hot-item">
                        <img :src="`http://imgcache.qq.com/music/photo_new/T002R150x150M000${item.data.albummid}.jpg?max_age=2592000`" alt="">
                        <div class="detail">
                            <div class="albumname">
                                专辑：{{item.data.albumname}}
                            </div>
                            <div class="albumname">
                                歌曲：{{item.data.songname}}
                            </div>
                            <div class="albumname">
                                演唱：{{item.data.singer[0].name}}
                            </div>
                            <div class="albumname">
                                点击量：{{item.data.switch}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'index',
  components: {},
  props: {},
  data() {
    return {
        value:'',
        show:true,
        indexMsg:{},
        radioList:[
            {url:require('./img/people.png'),title:'歌手',route:'/singerList'},
            {url:require('./img/paihang.png'),title:'排行',route:'/topList'},
            {url:require('./img/diantai.png'),title:'电台',route:'/radioList'}
        ],
        hotMusic:[]
    };
  },
  watch: {},
  computed: {
      
  },
  methods: {
      focus(){
          this.show = false
          console.log(11)
      },
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
            songname:songname,
            singername:singername,
            albumname:albumname,
            albummid:albummid
            }
            var playAround = {}
            if(index>0 && index<this.hotMusic.length - 1){
            playAround = {
                prev:{
                songmid:this.hotMusic[index-1].data.songmid,
                songname:this.hotMusic[index-1].data.songname,
                singername:this.hotMusic[index-1].data.singer[0].name,
                albumname:this.hotMusic[index-1].data.albumname,
                albummid:this.hotMusic[index-1].data.albumname,
                index:index-1
                },
                next:{
                songmid:this.hotMusic[index+1].data.songmid,
                songname:this.hotMusic[index+1].data.songname,
                singername:this.hotMusic[index+1].data.singer[0].name,
                albumname:this.hotMusic[index+1].data.albumname,
                albummid:this.hotMusic[index+1].data.albummid,
                index:index+1
                },
            }
            }
            if(index == 0){
            playAround = {
                prev:{
                songmid:this.hotMusic[this.hotMusic.length-1].data.songmid,
                songname:this.hotMusic[this.hotMusic.length-1].data.songname,
                singername:this.hotMusic[this.hotMusic.length-1].data.singer[0].name,
                albumname:this.hotMusic[this.hotMusic.length-1].data.albumname,
                albummid:this.hotMusic[this.hotMusic.length-1].data.albummid,
                index:this.hotMusic.length-1
                },
                next:{
                songmid:this.hotMusic[index+1].data.songmid,
                songname:this.hotMusic[index+1].data.songname,
                singername:this.hotMusic[index+1].data.singer[0].name,
                albumname:this.hotMusic[index+1].data.albumname,
                albummid:this.hotMusic[index+1].data.albummid,
                index:index+1
                },
            }
            }
            if(index == this.hotMusic.length - 1){
            playAround = {
                prev:{
                songmid:this.hotMusic[index-1].data.songmid,
                songname:this.hotMusic[index-1].data.songname,
                singername:this.hotMusic[index-1].data.singer[0].name,
                albumname:this.hotMusic[index-1].data.albumname,
                albummid:this.hotMusic[index-1].data.albummid,
                index:index-1
                },
                next:{
                songmid:this.hotMusic[0].data.songmid,
                songname:this.hotMusic[0].data.songname,
                singername:this.hotMusic[0].data.singer[0].name,
                albumname:this.hotMusic[0].data.albumname,
                albummid:this.hotMusic[0].data.albummid,
                index:0
                },
            }
            }
            // console.log(playAround)
            this.$store.dispatch('GET_PLAYAROUND',playAround)
            this.$store.dispatch('GET_PLAYDEFAIL',playDetail)
            this.$store.dispatch('GET_SONGLIST',this.hotMusic)
        }).catch(err => {
            console.log(err)
        })
        },
      getHotMusic(){
          axios({
              url:'/api/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
              method:'get',
              params:{
                //   tpl=3,
                //   page=detail,
                //   type=top,
                //   topid=36,
                  g_tk: 1604785682,
                  uin: 494873674, // qq acount
                  format: 'json',
                  inCharset: 'utf-8',
                  outCharset: 'utf-8',
                  notice: 0,
                  platform:'h5',
                  needNewCode: 0,
                  _: new Date().getTime(),
                  tpl:3,
                  page:'detail',
                  type:'top',
                  topid:36
              }
          }).then(res => {
              this.hotMusic = res.data.songlist
              console.log(res.data.songlist)
          }).catch(err => {
              console.log(err)
          })
      },
      getIndexMsg(){
          axios({
              method:'get',
              url:'/api/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
              params:this.basicParams
          }).then(res => {
              this.indexMsg = res.data.data
            //   console.log(this.indexMsg)
          }).catch(err => {

          })
      }
  },
  created() {},
  mounted() {
      this.getIndexMsg()
      this.getHotMusic()
  }
};
</script>
<style lang="scss">
.index{
    background-color: #f0f0f0;
    .clearfix::after,.clearfix::before{
        content: '';
        display: table;
        clear: both;
        zoom: 1;
    }
    .mint-header{
        background-color: #31c27c;
        font-size: 20px;
    }
    .mint-search{
        height: 53px;
        position: relative;
        top: 30px;
        .mint-searchbar{
            color: white;
            background-color: #31c27c;
            .mint-searchbar-cancel{
                font-size: 14px;
                font-weight: 400;
                color: white;
            }
            input::-webkit-input-placeholder{
                color: white;
            }
            .mint-searchbar-inner,input{
                background-color: #55a772;
                color: white;
            }
        }
    }
    .mint-swipe{
        padding-top: 28px;
        height: 150px;
        // background: #cccc;
    }
    .radio{
        display: flex;
        justify-content: space-between;
        padding: 20px;
        .radio-item{
            align-items: center;
            justify-content: center;
            flex: 1;
            display: flex;
            img{
                height: 30px;
                width: 30px;
                display: inline-block;
                margin-right: 10px;
            }
            span{
                font-size: 14px;
            }
        }
    }
    .title{
        position: absolute;
        top: 295px;
        right: 0;
        height: 41px;
        // bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 20px;
        background: #f0f0f0;
        // position: fixed
    }
    .hot{
        background: #f0f0f0;
        position: absolute;
        top: 335px;
        right: 0;
        bottom: 56px;
        left: 0;
        overflow-y: auto;
        overflow-x: hidden;
        .content{
            position: absolute;
            .main{
                .hot-item{
                    padding: 0 4px 2px 4px;
                    width: 100%;
                    display: flex;
                    img{
                        width: 150px;
                        height: 150px;
                    }
                    .detail{
                        box-sizing: border-box;
                        padding: 8px 10px;
                        margin-left: 4px;
                        height: 150px;
                        width: 213px;
                        background: white;
                        div{
                            height: 34px;
                            font-size: 14px;
                            line-height: 34px;
                        }
                    }
                }
                
            }
        }
    }
}
</style>