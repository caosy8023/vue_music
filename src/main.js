// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible/flexible.js'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import Mui from 'vue-awesome-mui';

Vue.use(Mui);
Vue.use(Mint)
Vue.config.productionTip = false
console.log(2222)
Vue.prototype.basicParams = {
  g_tk: 1604785682,
  uin: 494873674, // qq acount
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  platform:'h5',
  needNewCode: 0,
  _: new Date().getTime()
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
