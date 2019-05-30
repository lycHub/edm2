<template>
  <div class="subject-tool">
    <!--@paste="onPaste"-->
    <!--<div
      class="content"
      contenteditable="true"
      @mouseup="changePoi"
      @keyup.left="changePoi"
      @keyup.right="changePoi"
      @keyup="onKeyUp"
      ref="content"
    ></div>-->

    <input
      class="content"
      @mouseup="changePoi"
      @keyup="changePoi"
      ref="content" v-model="content" />




    <!--start-->
    <!--<Dropdown trigger="click" placement="bottom-end" class="drop-down">
      <div class="emoji" @click="addEmoji">
        <Icon custom="i-icon icon-emoji" size="25"/>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem>
          <div class="emoji-wrap">classify-wrap</div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>-->



    <emoji-picker @emoji="insert" style="position: relative;">
      <div slot="emoji-invoker" slot-scope="{ events }" v-on="events">
        <Button><Icon custom="i-icon icon-emoji" size="25"/></Button>
      </div>
      <div slot="emoji-picker" slot-scope="{ emojis, insert, display }" style="position: absolute;width: 500px;top:0;">
        <div>
          <div v-for="(emojiGroup, category) in emojis" :key="category">
            <h5>{{ category }}</h5>
            <div>
                <span
                  v-for="(emoji, emojiName) in emojiGroup"
                  :key="emojiName"
                  @click="insert(emoji)"
                  :title="emojiName">{{ emoji }}</span>
            </div>
          </div>
        </div>
      </div>
    </emoji-picker>
    <!--end-->
    <Dropdown trigger="click" placement="bottom-end" class="drop-down" @on-click="selectPersonal">
      <div class="personality">个性化
        <Icon type="ios-arrow-down"></Icon>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in personalities" :key="item.value" :name="item.value">
          <div class="personality-wrap">{{item.label}}</div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
  import Emoji from './emoji/emoji.vue'
  export default {
    name: "Subject",
    components: {
      'emoji-picker': Emoji
    },
    props: {
      value: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        personalities: [
          {
            label: "联系人名字",
            value: "$[FNAME|Customer]$"
          },
          {
            label: "联系人姓",
            value: "$[LNAME|Customer]$"
          }
        ],
        content: this.value
      };
    },
    watch: {
      content(newVal) {
        this.$emit("input", newVal);
      }
    },
    methods: {
      insert(emoji) {
        this.content += emoji;
        this.poi = this.content.length;
      },
      selectPersonal(name) {
//      console.log('selectPersonal', this.poi);
        const html = this.content;
        const strStart = html.substr(0, this.poi);
        const strEnd = html.substr(this.poi);
        this.content = strStart + name + strEnd;
      },
      changePoi(evt) {
        this.poi = evt.target.selectionEnd;
//      console.log('poi', this.poi);
      }
    },
    created() {
      this.poi = 0;
    },
    mounted() {
      setTimeout(() => {
        this.content = this.value;
      }, 500);
    }
  };
</script>
<style lang="less" scoped>
  @import "~assets/styles/variable";
  .subject-tool {
    display: flex;
    align-items: center;
    width: 655px;
    border-radius: 3px;
    border: solid 1px @border-prev;
    background-color: @color-white;
    height: 37px;
    .content {
      width: 500px;
      height: 100%;
      border-color: transparent;
      font-size: @font-size-normal;
      text-indent: 8px;
    }
    .drop-down {
      .emoji {
        padding: 2px 10px;
        border-left: 1px solid @border-prev;
        border-right: 1px solid @border-prev;
        cursor: pointer;
      }
      .emoji-wrap {
        width: 518px;
      }
      .personality {
        width: 106px;
        height: 35px;
        text-align: center;
        cursor: pointer;
        background-color: @bg-btn-shallow-prev;
      }
      .personality-wrap {
        width: 622px;
        font-size: @font-size-normal;
      }
    }
  }
</style>
