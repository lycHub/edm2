import BaseInformation from './BaseInformation/BaseInformation.route'
import Contents from './Contents/Contents.route'
import MyTemplates from './my-templates/MyTemplates.route'
import SendTime from './send-time/SendTime.route'
import Editor from './editor/Editor.route'
import TestPreview from './test-preview/test-preview.route'

export default {
  path: '/Marketing',
  // name: 'Marketing',
  component: () => import('./Marketing.vue'),
  children: [BaseInformation, Contents, Editor, TestPreview, MyTemplates, SendTime]
}
