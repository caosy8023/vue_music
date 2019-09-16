<template>
    <div class="singerList">
        <mt-header fixed title="歌手">
          <mt-button @click="back" icon="back" slot="left"></mt-button>
        </mt-header>
        <div class="content">
          <mt-index-list>
            <mt-index-section v-for="item in sort" :key="item" :index="item">
              <mt-cell v-for="item2 in singerSort(item)" :key="item2.Fsinger_mid">
                 <img @click="getSinger(item2.Fsinger_mid)" class="avator" :src="getAvator(item2.Fsinger_mid)">&nbsp;&nbsp;&nbsp;
                 <span  @click="getSinger(item2.Fsinger_mid)">{{item2.Fsinger_name}}</span>
              </mt-cell>
            </mt-index-section>
          </mt-index-list>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'singerList',
  components: {},
  props: {},
  data() {
    return {
      sort:['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
   'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
   singList:[],
   arr1:[]
    };
  },
  watch: {},
  computed: {},
  methods: {
    back(){
      this.$router.go(-1)
    },
    getSingerList(){
      axios({
        method:'get',
        url:'/api/v8/fcg-bin/v8.fcg',
        params:{
          g_tk: 1604785682,
          uin: 494873674, // qq acount
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform:'h5',
          needNewCode: 0,
          _: new Date().getTime(),
          page: 'list',
          channel: 'singer',
          pagesize: 100,
          hostUin: 0,
          pagenum: 1,
          key: 'all_all_all',
          hostUin:0
        }
      }).then(res => {
        this.singList = res.data.data.list
        // console.log(this.singList)
      }).catch(err => {

      })
    },
    singerSort(Findex){
      var arr = []
      this.singList.forEach((item,index) => {
        if(item.Findex == Findex){
          arr.push(item)
        }
      })
      return arr
    },
    getAvator(img) {
      // console.log(img)
      return img ? `https://y.gtimg.cn/music/photo_new/T001R300x300M000${img}.jpg?max_age=2592000` : '';
    },
    getSinger(id){
      this.$router.push({path:'/singer',query:{id:id}})
    }
  },
  created() {},
  mounted() {
    var _this = this
    this.getSingerList()
  }
};
</script>
<style lang="scss">
  .singerList{
    background-color: #f0f0f0;
    .mint-header{
      background-color:#31c27c;
      font-size: 20px;
      .mintui{
        font-size: 25px!important;
      }
    }
    .content{
      position: absolute;
      padding-top: 40px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin-bottom: 56px;
      .mint-indexlist{
        height: 571px;
        .mint-indexlist-content{
          .mint-cell{
            .mint-cell-wrapper{
              .mint-cell-value{
                width: 100%;
                padding-left: 15px;
                color: black;
                .avator{
                  width: 38px;
                  height: 38px;
                  border-radius: 50%;
                  
                }
              }
              .mint-cell-title{
                flex: 0;
              }
            }
          }
          height: 571px!important;
          .mint-indexsection-index{
            font-size: 16px;
          }
        }
      }
    }
  }
</style>