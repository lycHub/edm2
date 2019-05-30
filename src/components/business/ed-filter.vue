<template>
  <div class="ed-filter">
    <!--@on-visible-change="onVisibleChange"-->
    <Dropdown trigger="custom" :visible="visible" :placement="placement" class="drop-down">
      <div @click="toggleMenu">
        <slot name="handle"></slot>
      </div>
      <DropdownMenu slot="list" @click.native="onMenuClick" class="dropdown-menu" :style="{width: panelWidth + 'px'}">
        <DropdownItem  class="dropdown-item">
          <div class="control">
            <slot></slot>
          </div>
          <div class="btns">
            <Button v-btn-style="'green'" class="btn" size="large" @click="$emit('on-ok')">OK</Button>
            <!--<Button v-btn-style size="large" @click="$emit('on-visible-change', false)">Reset</Button>-->
            <Button v-btn-style size="large" @click="onCancel">{{cancelText}}</Button>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
  import DropDownMixin from '../../mixins/drop-down'
  export default {
    name: 'EdFilter',
    mixins: [DropDownMixin],
    props: {
      panelWidth: {
        type: Number,
        default: 330
      },
      cancelText: {
        type: String,
        default: 'Cancel'
      }
    },
    methods: {
      onCancel() {
        this.$emit('on-visible-change', false);
        this.$emit('on-cancel');
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "~assets/styles/variable.less";
  .ed-filter{
    .drop-down .dropdown-menu{
      position: relative;
      // border: 1px solid @border-blue;
      .dropdown-item{
        .control{
          padding: 15px 0;
        }
        .btns{
          margin-top: 15px;
          text-align: center;
          .btn{
            margin-right: 8px;
          }
        }
      }
    }

  }
</style>
