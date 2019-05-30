<template>
  <div class="subject-tool">
    <input
      class="content"
      @mouseup="changePoi"
      @keyup="changePoi"
      ref="content" v-model="content" @blur="$emit('on-blur')" />




    <emoji-picker @emoji="insert" class="emoji-picker">
      <div slot="emoji-invoker" slot-scope="{ events }" v-on="events">
        <Button><Icon custom="i-icon icon-emoji" size="25"/></Button>
      </div>
      <div slot="emoji-picker" slot-scope="{ emojis }" class="emoji-panel">
        <Tabs>
          <TabPane v-for="(emojiGroup, category) in emojis" :key="category" :label="category" :name="category" class="tab-panel">
            <ul>
              <li
                v-for="(emoji, emojiName) in emojiGroup"
                :key="emojiName"
                @click="insert(emoji)"
                :title="emojiName">{{ emoji }}</li>
            </ul>
          </TabPane>
        </Tabs>
      </div>
    </emoji-picker>

    <!--<Dropdown trigger="click" placement="bottom-end" class="drop-down" @on-click="selectPersonal">
      <div class="personality">个性化
        <Icon type="ios-arrow-down"></Icon>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in personalities" :key="item.value" :name="item.value">
          <div class="personality-wrap">{{item.label}}</div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>-->
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
      value(newVal) {
        // console.log('subject :', newVal);
        this.content = newVal;
      },
      content(newVal) {
        this.$emit("input", newVal);
        this.$emit("on-change", newVal);
      }
    },
    methods: {
      onBlur() {
        console.log('blur :');
      },
      insert(emoji) {
//        console.log('emoji', emoji);
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
        /*if (evt.type.toLocaleLowerCase() === 'keyup') {
          this.$emit('on-keyup');
        }*/
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
      /*width: 500px;*/
      width: 100%;
      height: 100%;
      border-color: transparent;
      font-size: @font-size-normal;
      text-indent: 8px;
    }
    .emoji-picker{
      position: relative;
      .emoji-panel{
        position: absolute;
        width: 548px;
        top: 40px;
        background-color: @color-white;
        right: 0;
        z-index: 1;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);

        .tab-panel{
          ul{
            display: flex;
            flex-wrap: wrap;
            font-size: @font-size-mid;
            li{
              cursor: pointer;
            }
          }
        }
      }
    }
    .drop-down {
      /*.emoji {
        padding: 2px 10px;
        border-left: 1px solid @border-prev;
        border-right: 1px solid @border-prev;
        cursor: pointer;
      }
      .emoji-wrap {
        width: 518px;
      }*/
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
