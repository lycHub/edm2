<template>
  <div class="ed-select">
    <!--@on-visible-change="onVisibleChange"-->
    <Dropdown trigger="custom" :visible="visible" :placement="placement" @on-visible-change="onVisibleChange" class="drop-down">
      <div @click="toggleMenu">
        <slot name="handle"></slot>
      </div>
      <DropdownMenu slot="list" @click.native="onMenuClick" class="dropdown-menu" :style="{width: panelWidth + 'px'}">
        <DropdownItem>
          <div class="ed-select-wrap">
            <div class="search" v-show="filterable">
              <i-Input v-model.trim="searchWord" :placeholder="placeholder" icon="ios-search" size="large" @on-keyup="onFilter(searchWord)" />
            </div>
            <div class="list-wrap">
              <template v-if="count">
                <slot></slot>
                <EdLoadingMore v-show="showLoadMoreSpin"></EdLoadingMore>
              </template>
              <template v-else>
                <slot name="no-result">
                  <!--如果外面不用这个slot, 就显示默认内容-->
                  <span class="no-result">No result</span>
                </slot>
              </template>
            </div>
            <div class="new-item" v-show="creatable">
              <Button size="large" v-btn-style :disabled="editing" @click="creating = true" v-show="!creating">{{createLabel}}</Button>
              <EdSelectCreate :showPass="showPass" v-model.trim="newItemName" v-show="creating" @on-ok="onCreated" @on-close="creating = false"></EdSelectCreate>
            </div>
          </div>
        </DropdownItem>
        <EdSpin v-if="showSpin"></EdSpin>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
  import {findComponentsDownward} from "iview/src/utils/assist";
  import DropDownMixin from '../../../mixins/drop-down';
  import { close } from 'fs';
  import { setTimeout } from 'timers';
  import { throttle } from "throttle-debounce";
  export default {
    name: 'EdSelect',
    mixins: [DropDownMixin],
    props: {
      data: Array,

      showPass: {
        type: Boolean,
        default: false
      },

      // 数据条数
      count: Number,

      panelWidth: {
        type: Number,
        default: 350
      },

      createLabel: {
        type: String,
        default: 'Create a new folder'
      },

      filterable: {
        type: Boolean,
        default: true
      },
      creatable: {
        type: Boolean,
        default: true
      },

      // 搜索框文字
      placeholder: {
        type: String,
        default: 'Searching'
      }
    },
    data() {
      return {
        edge: 30,
        // 是否正在新建
        creating: false,

        // 是否正在编辑
        editing: false,
        newItemName: '',
         childrenItems: []
      }
    },
    watch: {
      /*data: {
        handler(newVal) {
          console.log('data', newVal);
        },
        immediate: true
      }, */
      data() {
        this._refreshChildren();
      },
      visible(newVal) {
        if (newVal) {
          this._refreshChildren();
        }
      },
      creating(newVal) {
        this.childrenItems.map(item => item.creating = newVal);
      }
    },
    methods: {
      /*handleReachBottom () {
        console.log('bb');
        return new Promise(resolve => {
          console.log('cc');
          setTimeout(() => {
            const last = this.list1[this.list1.length - 1];
            for (let i = 1; i < 11; i++) {
              this.list1.push(last + i);
            }
            console.log('aa');
            resolve();
          }, 2000);
        });
      },*/
     onVisibleChange(visib) {
        if (!visib) {
          this.childrenItems.forEach(item => item.editing = false);
          this.editing = false;
        }
      },
      onStartEditing(id) {
//        console.log('childrenItems', this.childrenItems);
        this.childrenItems.map(item => item.editing = item.id === id);
        this.editing = true;
      },

      // 确认新建
      onCreated(emailPassword) {
       if (this.newItemName) {
         this.$emit('on-add', {
           newItemName: this.newItemName,
           emailPassword
         });
         this.searchWord = '';
//         this.newItemName = '';
       }else {
         this.$Message.warning("category's name is required");
       }
      },
      onClose(id) {
        this.childrenItems.find(item => item.id === id).editing = false;
        this.editing = false;
      },

      // 搜索
      onSearch(q) {
//        console.log('q', q);
        this.$emit('on-search', this.searchWord);
      },

      _refreshChildren() {
        this.$nextTick(() => {
          this.childrenItems = findComponentsDownward(this, 'EdSelectItem');
        });
      }
    },
    created() {
      this.onFilter = throttle(500, q => this.onSearch(q));
    },
   /* mounted() {
      setTimeout(() => {
        this.childrenItems = findComponentsDownward(this, 'EdSelectItem');
         console.log('mounted :', this.childrenItems);
      }, 1000);
    }*/
  }
</script>
<style scoped lang="less">
  @import "../../../assets/styles/variable";

  .ed-select {
    .drop-down{
      min-width: 100%;
      .dropdown-menu{
        position: relative;
        //border: 1px solid @border-blue;
        .ed-select-wrap{
          .search{
            width: 90%;
            height:36px;
            margin: 0 auto;
          }
          .list-wrap{
            font-size: @font-size-normal;
            color: @font-color-normal;
            .no-result{
              display: block;
              margin-top: 15px;
            }



          }
          .new-item{
            text-align: center;
            padding-top: 15px;
          }
        }
      }
    }
  }
</style>
