export default {
  path: 'Editor',
  name: 'Editor',
  meta: {
    activeName: 'CreateMarketing',
    breadcrumb: [{
      label: 'Marketing'
    }, {
      label: 'Create Marketing',
      // to: '/Marketing'
    }, {
      label: 'Contents',
      name: 'Contents'
    }]
  },
  component: () => import('./Editor.vue')
}
