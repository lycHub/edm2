<template>
   <Modal v-model="showModal" title="Add abstracts" spellcheck class="modal" @on-visible-change="$emit('on-visib-change', $event)">
      <i-Input type="textarea" :maxlength="200" v-model="abs" />
      <div slot="footer" class="footer">
        <span>{{Math.max(restCharLen, 0)}} characters</span>
        <div>
          <Button @click="onClose">Cancel</Button>
          <Button type="primary" @click="onSave">Save</Button>
        </div>
      </div>
    </Modal>
</template>
<script>
export default {
  name: 'Abstract',
  model: {
    prop: 'show',
    event: 'on-visib-change'
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    abstracts: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showModal: this.show,
      abs: this.abstracts || ''
    }
  },
  computed: {
    restCharLen() {
      return (200 - this.abs.length);
    }
  },
  watch: {
    show(newVal) {
      this.showModal = newVal;
    },
    abstracts(newVal) {
      // console.log('watch abstracts', newVal);

      this.abs = newVal || '';
    }
  },
  methods: {
    onSave() {
      this.$emit('on-change', this.abs);
      this.onClose();
    },
    onClose() {
      this.$emit('on-visib-change', false);
    }
  }
}
</script>
<style lang="less" scoped>
 .modal .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
