<template>
  <div class="multiple-select">
    <div class="trigger" @click="toggleMenu">
      <div class="selections">
        <div class="selected-tag" v-for="(item, index) in selectedEmails" :key="index">
          <span>{{item}}</span>
          <Icon type="ios-close" size="20" class="icon" @click="onDeleteEmail(item)" />
        </div>
        <input class="input" ref="input" :style="{ width: inputLength + 'px' }" v-model="q">
      </div>
    </div>
    <!--<span>At most 5 email addresses.</span>-->
    <transition name="drop">
      <div class="panel" v-show="visible" @click="onMenuClick">
        <div class="selectedEmails">
          <EdScroll
            v-if="datas.length"
            :data="datas"
            ref="edScroll"
            :maxHeight="150"
            @on-pull-up="onPullUp">
            <div class="item-group">
              <Checkbox class="item" :disabled="selectedEmails.length >= 5" :value="selectedEmails.includes(item.email)" :label="item.id" v-for="item in datas" :key="item.id" @on-change="onChange($event, item.email)">
                <span class="label">{{item.email}}</span>
              </Checkbox>
            </div>
          </EdScroll>
          <p class="no-result" v-else>no result</p>
          <!-- <EdLoadingMore v-show="true"></EdLoadingMore> -->
          <EdLoadingMore v-show="showLoadMoreSpin"></EdLoadingMore>
        </div>
        <div class="add">
          <i-Input placeholder="New address" class="input" v-model="newEmail" @keyup.enter.native="onAdd"  />
          <Icon type="md-checkmark" size="20" class="icon" @click="onAdd"/>
        </div>
        <EdSpin v-if="showSpin"></EdSpin>
      </div>
    </transition>
  </div>
</template>

<script>
  import DropDownMixin from "../../../mixins/drop-down";
  import { findComponentDownward } from "iview/src/utils/assist";
  import { throttle } from "throttle-debounce";
  import { setTimeout } from 'timers';
  import {validEmail} from "../../../utils/tool";

  export default {
    name: "MultipleSelect",
    mixins: [DropDownMixin],
    props: {
      datas: {
        type: Array,
        default: []
      },
      value: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        inputLength: 20,
        selectedEmails: this.value,
        q: "",
        newEmail: ''
      };
    },

    watch: {
      value(newVal) {
        this.selectedEmails = newVal;
      },
      selectedEmails(newVal) {
        this.$emit('on-change', newVal);
      },
      q(newVal) {
        this.inputLength = newVal.length * 12 + 20;
        this.handleKeyUp();
      },
      visible(newVal) {
        // console.log('visib :', newVal);
        if (newVal) {
          this.$nextTick(() => {
            this.edScroll = this.$refs['edScroll'] || null;
            this.edScroll && this.edScroll.refresh();
          });
        }
      }
    },
    methods: {
      onChange(check, email) {
        if (check) {
          if (this.selectedEmails.length < 5) {
            this.selectedEmails.push(email);
          }
        }else {
          const index = this.selectedEmails.findIndex(val => val === email);
          if (index !== -1) {
            this.selectedEmails.splice(index, 1);
          }
        }
      },

      // 删除选中的标签
      onDeleteEmail(email) {
        const index = this.selectedEmails.findIndex(val => val === email);
        if (index !== -1) {
          this.selectedEmails.splice(index, 1);
        }
      },

      toggleMenu() {
        this.selfClick = true;
        // this.$emit('on-visible-change', !this.visible);
        this.$emit("on-visible-change", true);
        this.$refs["input"].focus();
      },
      onPullUp() {
        if (this.edScroll) {
          this.$emit('on-pull-up', this.edScroll);
        }
      },

      // 新增邮箱
      onAdd() {
        if (validEmail(this.newEmail)) {
          this.$emit('on-add', this.newEmail);
          this.newEmail = '';
        }else {
          this.$Message.error('Please enter the correct mailbox');
        }
      }
    },

    created() {
      this.edScroll = null;
      this.handleKeyUp = throttle(500, () => {
        this.$emit("on-filter", this.q);
      });
    }
  };
</script>

<style lang="less" scoped>
  @import "../../../assets/styles/variable";
  .drop-enter-active,
  .drop-leave-active {
    transition: transform, opacity .3s;
    opacity: 1;
    transform: scaleY(1);
  }
  .drop-enter,
  .drop-leave-to {
    opacity: 0;
    transform: scaleY(0.8);
  }

  .multiple-select {
    position: relative;
    font-size: @font-size-mid;
    .trigger {
      .selections {
        user-select: none;
        cursor: pointer;
        background-color: @color-white;
        border-radius: 4px;
        border: 1px solid @border-prev;
        /*min-height: 36px;*/
        padding: 2px 8px;
        .selected-tag {
          display: inline-block;
          height: 26px;
          line-height: 26px;
          margin: 2px 8px 2px 0;
          padding: 0 8px;
          border: 1px solid #e8eaec;
          border-radius: 3px;
          background-color: @bg-shallow-blue;
          cursor: pointer;
          .icon {
            color: @color-primary;
            vertical-align: sub;
          }
        }
        .input {
          display: inline-block;
          width: 100%;
          height: 32px;
          line-height: 1.5;
          padding: 4px 7px;
          font-size: @font-size-normal;
          border: 1px solid @color-white;
          border-radius: 4px;
          color: @font-color-dull-prey;
          background-color: @color-white;
          transition: width 0.2s;
        }
      }
    }

    .panel {
      width: 100%;
      margin: 5px 0;
      padding: 5px 0;
      background-color: #fff;
      box-sizing: border-box;
      border-radius: 4px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      position: absolute;
      .selectedEmails {
        .item-group {
          .item {
            display: block;
            font-size: @font-size-normal;
            padding: 12px 10px;
            .label {
              padding-left: 8px;
            }
          }
        }
        .no-result{
          padding: 10px;
        }
      }
      .add {
        position: absolute;
        width: 100%;
        // width: 890px;
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 5px 10px;
        /*top: 295px;*/
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        border-top: 1px solid @color-white;
        .input {
          // width: 40%;
          min-width: 250px;
          margin-right: 15px;
        }
        .icon {
          color: @font-color-green;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
  }
</style>
