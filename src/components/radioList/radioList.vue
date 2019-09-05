<template>
    <div class="radioList">
        <mt-header title="电台">
          <mt-button @click="back" icon="back" slot="left"></mt-button>
        </mt-header>
    </div>
</template>

<script>
export default {
  name:'radioList',
  components: {},
  props: {},
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {
    back(){
      this.$router.go(-1)
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss">
.radioList{
  background-color: #f0f0f0;
  .mint-header{
    background-color:#31c27c;
    font-size: 20px;
    .mintui{
      font-size: 25px!important;
    }
  }
  }
</style>