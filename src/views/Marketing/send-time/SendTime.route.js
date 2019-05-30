export default {
  path: 'SendTime',
  name: 'SendTime',
  meta: {
    activeName: 'CreateMarketing',
    hideLastStep: true,
    breadcrumb: [{
      label: 'Marketing'
    }, {
      label: 'Create marketing',
      // to: '/Marketing'
    }, {
      label: ' Choose sending time',
      name: 'SendTime'
    }]
  },
  component: () => import('./SendTime.vue')
}
