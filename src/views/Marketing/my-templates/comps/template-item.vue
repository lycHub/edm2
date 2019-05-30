<template>
  <div>
    <Card class="template-item">
      <div class="info">
        <div class="thumbnail" @click="onPriview">
          <img :src="item.coverImg">
        </div>
        <div class="bottom">
          <!-- @click="onSelect" -->
          <span v-if="!isEditing" @dblclick="onEditing">{{item.name}}</span>
          <i-Input v-else v-model="value" :maxlength="50" size="large" @on-enter="onEnter" @on-blur="isEditing = false" />
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import Emitter from 'iview/src/mixins/emitter';
export default {
  name: "TemplateItem",
  props: {
    item: Object
  },
  mixins: [ Emitter ],
  data() {
    return {
      // 是否正在修改
      isEditing: false,
      value: this.item.name
    };
  },
  methods: {
    onSelect() {
      this.dispatch('MyTemplates', 'on-selected', this.item.id);
    },
    onEditing() {
      this.$emit('on-editing', this.item.id);
    },
    onEnter() {
      if (this.value.length > 50) {
        this.$Message.warning("template's name cannot be longer than 50 characters");
      }else if (!this.value) {
        this.$Message.warning("template's name is required");
      }else {
        this.dispatch('MyTemplates', 'on-edited', {
          id: this.item.id,
          name: this.value,
          child: this
        });
      }
    },
    onPriview() {
      this.dispatch('MyTemplates', 'on-preview', this.item.id);
    }
  },
  mounted() {
    // 修改后
    this.$on('on-edited', () => this.isEditing = false);
  }
};
</script>

<style lang="less" scoped>
@import "../../../../assets/styles/variable";
@import "../../../../assets/styles/mixin";
.template-item {
  text-align: center;
  box-shadow: 0 1px 5px #808695;
  &:hover {
    border: 1px solid @border-blue;
  }
  .thumbnail {
    height: 240px;
    overflow: hidden;
    text-align: initial;
    &:hover {
      cursor: zoom-in;
    }
    /* img {
      display: block;
      width: 100%;
      height: 100%;
    } */
  }
  .bottom {
    margin-top: 25px;
    .no-wrap;
    span {
      cursor: pointer;
    }
  }
}
</style>
