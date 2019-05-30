export default {
  path: 'MyTemplates',
  name: 'MyTemplates',
  meta: {
    activeName: 'CreateMarketing',
    hideLastStep: true,
    breadcrumb: [{
      label: 'Marketing'
    }, {
      label: 'Create marketing',
      // to: '/Marketing'
    }, {
      label: 'Contents',
      name: 'Contents'
    }, {
      label: 'My template',
      name: 'Contents'
    }]
  },
  component: () => import('./MyTemplates.vue')
}
