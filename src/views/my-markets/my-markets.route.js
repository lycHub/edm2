import {removeStroge} from "../../utils/tool";

export default {
  path: '/MyMarkets',
  name: 'MyMarkets',
  meta: {
    activeName: 'MyMarkets',
    breadcrumb: [{
      label: 'Report form'
    }, {
      label: 'My marketing'
    }]
  },
  component: () => import('./MyMarkets.vue'),
  beforeEnter(to, from, next) {
    if (localStorage.getItem('marketingId')) {
      console.log('removeItem');
      removeStroge(['marketingId', 'marketingName', 'isEdit']);
    }
    next();
  }
}
