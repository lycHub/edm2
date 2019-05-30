<template>
  <div class="preview-wrap">
    <div class="top">
      <h3>Preview</h3>
      <div class="plateform">
        <Button
          icon="md-desktop"
          class="btn"
          @click="mode='pc'"
          v-if="mode === 'phone'"
          v-btn-style="'blue'">On PC</Button>
        <Button
          icon="md-phone-portrait"
          class="btn"
          size="large"
          @click="mode='phone'"
          v-else
          v-btn-style="'blue'">On phone</Button>
      </div>
    </div>
    <div class="container">
      <Preview
        :mode="mode"
        :delFile="delFile"
        :abstracts="abstracts"
        :contents="contents"
        :contentFiles="contentFiles"
        :showAbstracts="showAbstracts"
        @on-change-abstracts="$emit('on-change-abstracts', $event)"
        @on-delete-file="$emit('on-delete-file', $event)">
      </Preview>
    </div>
  </div>
</template>

<script>
export default {
  name: "TestMailPreview",
  props: {
    delFile: {
      type: Boolean,
      default: true
    },
    showAbstracts: {
      type: Boolean,
      default: true
    },
    abstracts: {
      type: String,
      default: ''
    },
    initMode: {
      type: String,
      default: 'pc'
    },
    contents: {
      type: String,
      default: ''
    },
    contentFiles: {
      type: Array,
      default() {
        return [];
      }
    }

  },
  data() {
    return {
      mode: this.initMode
    };
  }
  /*watch: {
    contents(newVal) {
      console.log('preview content :', newVal);
    }
  }*/
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
.preview-wrap {
  padding: 0 15px;
  border-right: 1px solid @border-prev;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h3 {
      font-size: @font-size-mid;
    }
  }
}
</style>
