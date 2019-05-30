export default {
  path: '',
  name: 'BaseInformation',
  meta: {
    activeName: 'CreateMarketing',
    breadcrumb: [{
      label: 'Marketing'
    }, {
      label: 'Create marketing',
      // to: 'Marketing'
    }, {
      label: 'Basic information',
      name: 'BaseInformation'
    }]
  },
  component: () => import('./BaseInformation.vue')
}
