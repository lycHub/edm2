export default {
  path: 'Contents',
  name: 'Contents',
  meta: {
    activeName: 'CreateMarketing',
    breadcrumb: [{
      label: 'Marketing'
    }, {
      label: 'Create marketing',
      // to: '/Marketing'
    }, {
      label: 'Contents',
      name: 'Contents'
    }]
  },
  component: () => import('./Contents.vue')
}
