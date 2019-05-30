export default {
  path: 'TestPreview',
  name: 'TestPreview',
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
  component: () => import('./test-preview.vue')
}
