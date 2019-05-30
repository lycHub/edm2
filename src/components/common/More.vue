<template>
  <Dropdown :placement="placement" trigger="click">
    <Tooltip :content="content" placement="top" v-if="showToolTip" transfer>
      <slot></slot>
    </Tooltip>
    <slot v-else></slot>
    <DropdownMenu slot="list" class="drop-down-menu">
      <slot name="items"></slot>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
  export default {
    name: 'More',
    props: {
      showToolTip: {
        type: Boolean,
        default: true
      },
      content: {
        type: String,
        default: 'More'
      },
      placement: {
        type: String,
        default: 'bottom-end'
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/styles/variable.less";
  .drop-down-menu{
    .drop-down-item{
      font-size: @font-size-normal !important;
    }
  }
</style>
