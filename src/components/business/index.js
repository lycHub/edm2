import Vue from 'vue'
import EdSelect from './ed-select/ed-select.vue'
import EdSelectItem from './ed-select/ed-select-item.vue'
import EdSelectCreate from './ed-select/ed-select-create.vue'
import Preview from './preview.vue'
import MultipleSelect from './test-mail/multiple-select.vue'
import EdFilter from './ed-filter.vue'
import TestMailPreview from './test-mail/test-mail-preview.vue'
import TestMailSend from './test-mail/test-mail-send.vue'
import TestMailHistory from './test-mail/test-mail-history.vue'


const components = {
  EdSelect, EdSelectItem, EdSelectCreate, Preview, MultipleSelect, EdFilter, TestMailPreview, TestMailSend, TestMailHistory
};

for (const attr in components) {
  if (components.hasOwnProperty(attr)) {
    const item = components[attr];
    Vue.component(item.name, item);
  }
}
