export default {
  path: '/MarketDetail/:id',
  name: 'MarketDetail',
  props: true,
  meta: {
    activeName: 'MyMarkets',
    breadcrumb: [{
      label: 'Marketing'
    }, {
      label: 'Regular marketing'
    }, {
      label: 'Member email marketing'
    }]
  },
  component: () => import('./market-detail.vue')
}
