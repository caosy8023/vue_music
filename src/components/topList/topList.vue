<template>
    <div class="topList">
        <mt-header fixed title="排行">
          <mt-button @click="back" icon="back" slot="left"></mt-button>
        </mt-header>
        <div class="main">
          <div class="title">
            Q Q 音 乐 巅 峰 榜
          </div>
          <div class="list">
            <div @click="goRanklist(item.id)" class="list-item" v-for="item in topList" :key="item.id">
              <div class="left">
                <img v-lazy="item.picUrl" :src="item.picUrl" alt="">
              </div>
              <div class="right">
                <div class="right-item" v-for="(items,index) in item.songList" :key="index">
                  {{index+1}} {{items.songname}}<span> - {{items.singername}}</span>
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
  name:'topList',
  components: {},
  props: {},
  data() {
    return {
      topList:[]
    };
  },
  watch: {},
  computed: {},
  methods: {
    goRanklist(id){
      this.$router.push({name:'rankList',params:{id:id}})
    },
    back(){
      this.$router.go(-1)
    },
    
    getTopList(){
      axios({
        method:'get',
        url:'/api/v8/fcg-bin/fcg_myqq_toplist.fcg',
        params:this.basicParams
      }).then(res => {
        // console.log(res.data)
        var data = res.data
        var first = data.indexOf('(')+1
        var last = data.lastIndexOf(')')
        this.topList = JSON.parse(data.substring(first,last)).data.topList
        // console.log(this.topList)
      }).catch(err => {

      })
    }
  },
  created() {},
  mounted() {
    this.getTopList()
  }
};
</script>
<style lang="scss">
  .topList{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #F4F4F4;
    overflow: hidden;
    .mint-header{
      background-color:#31c27c;
      font-size: 20px;
      .mintui{
        font-size: 25px!important;
      }
    }
    .main{
      background-color: #f0f0f0;
      position: absolute;
      overflow: auto;
      padding-top: 40px;
      margin-bottom: 56px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .title{
        width: 100%;
        height: 50px;
        background-color: #f0f0f0;
        font-size: 16px;
        text-align: center;
        line-height: 50px;
      }
      .list{
        .list-item{
          height: 125px;
          margin: 0 5px 5px 5px;
          display: flex;
          justify-content: space-between;
          .left{
            width: 125px;
            img{
              width: 100%;
              height: 100%;
            }
            image[lazy=loading] {
              width: 125px;
              height: 125px;
            }
          }
          .right{
            display: flex;
            flex-wrap: wrap;
            align-content: space-around;
            background-color: white;
            width: 215px;
            margin-left: 5px;
            padding: 15px 10px;
            .right-item{
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow:ellipsis;
              font-weight: 500;
              font-size: 13px;
              span{
                color: rgba(0, 0, 0, 0.5)
              }
            }
          }
        }
      }
    }
  }
  
</style>