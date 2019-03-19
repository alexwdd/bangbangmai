import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import store from "./store";
import config from "./config";
import axios from './httpConfig/http.js'
import Vant from 'vant';
import 'vant/lib/index.css';
import './assets/fonts/iconfont.css';

Vue.use(Vant);

Vue.config.productionTip = false
Vue.prototype.config = config
Vue.prototype.$http = axios

//全局守卫
router.beforeEach((to, from, next) => {
    const token = store.state.token ? store.state.token : window.sessionStorage.getItem('token');
    if (token) {
        next();
    } else if (to.path == '/login' || to.path == '/reg' || to.path == '/download') {
        next();
    } else {
        next('login');
    }
});

new Vue({
    data: {        
	},
	router,
	store,
    render: h => h(App),
}).$mount('#app')
