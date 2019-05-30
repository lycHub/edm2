import Vue from 'vue'
import Router from 'vue-router'
import Marketing from './views/Marketing/Marketing.route'
import MyMarkets from './views/my-markets/my-markets.route'
import MarketDetail from './views/market-detail/market-detail.route'
import Copy from './views/copy/copy.route'

import { LoadingBar } from 'iview'
Vue.use(Router)


const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: { name: 'MyMarkets' }},
    Marketing, MyMarkets, MarketDetail, Copy,
    { path: '*', redirect: { name: 'MyMarkets' }}
  ]
});

router.beforeEach(function(to, from, next) {
  LoadingBar.start();
  next();
});

router.afterEach(function () {
  LoadingBar.finish();
});


export default router;
