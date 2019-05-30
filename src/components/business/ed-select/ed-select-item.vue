<template>
  <div class="list-item">
    <div class="item-wrap" v-if="!editing" :style="{'color': active ? '#0099cc' : ''}">
      <div class="info">
        <slot></slot>
      </div>
      <div class="operators">
        <Icon v-show="editable" custom="i-icon icon-bianji" size="25" :class="editClass" @click="onStartEditing" />
        <Icon v-show="deletable" type="ios-trash" size="25" @click="$emit('on-delete', id)" />
      </div>
    </div>

    <div class="item-wrap" v-else>
      <EdSelectCreate v-model="newItemName" @on-ok="onConfirmEdit" @on-close="onClose"></EdSelectCreate>
    </div>
  </div>
</template>
<script>
  import {findComponentUpward} from "iview/src/utils/assist";

  export default {
    name: 'EdSelectItem',
    props: {
      id: {
        type: [Number, String],
        required: true
      },

      // 是否可删除
      deletable: {
        type: Boolean,
        default: true
      },

      // 是否可编辑
      editable: {
        type: Boolean,
        default: true
      },

      label: {
        type: [Number, String],
        default: ''
      },
      activedId: [Number, String]
    },
    data() {
      return {
        editing: false,
        newItemName: this.label,
        creating: false,
        // editable: true
      }
    },
    computed: {
      editClass() {
          return this.creating ? 'edit disabled' : 'edit'
      },
      active() {
        return this.activedId === this.id;
      }
    },
    watch: {
      label(newVal) {
        this.newItemName = newVal;
      },
      editing(newVal) {
//        console.log('editing', newVal, this.label);
        if (!newVal) {
          this.newItemName = this.label;
        }
      }
    },
    mounted() {
      this.parent = findComponentUpward(this, 'EdSelect');
    },
    methods: {
      onStartEditing() {
        if (this.creating) return;
//        this.$emit('on-editing', id);
        this.parent.onStartEditing(this.id);
      },
      onClose() {
//        this.newItemName = '';
        this.parent.onClose(this.id);
      },
      onConfirmEdit() {
        if (this.newItemName) {
          this.$emit('on-confirm-edit', {
          id: this.id,
          name: this.newItemName
        });
          this.parent.searchWord = '';
//        this.newItemName = '';
        }else{
          this.$Message.warning("category's name is required!");
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import "../../../assets/styles/variable";
  @import "../../../assets/styles/mixin";
  .list-item{
    padding: 10px 0;
    .item-wrap{
      display: flex;
      /*justify-content: space-between;*/
      align-items: center;

      &:hover{
        .operators{
          visibility: visible;
        }
      }

      /*.info{
        max-width: 232px;
        .no-wrap;
      }*/

      .operators{
        margin-left: 28px;
        visibility: hidden;
        .edit{
          margin-right: 10px;
          &.disabled{
            cursor: not-allowed;
          }
        }
      }
    }
  }
</style>
