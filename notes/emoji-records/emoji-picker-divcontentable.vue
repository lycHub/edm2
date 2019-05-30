<template>
  <div class="subject-tool">
    <!--@paste="onPaste"-->

    <div
      class="content"
      contenteditable="true"
      @mouseup="changePoi"
      @keyup.left="changePoi"
      @keyup.right="changePoi"
      @keyup="onKeyUp"
      ref="content"
    ></div>




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
      /*  value(newVal) {
       console.log('newVal :', newVal);
       this.content = newVal;
       this.innerText = newVal;
       this.$refs['content'].innerT = newVal;
       }, */
      content(newVal) {
        // console.log('content :', newVal);
        // img标签替换成alt属性的值并过滤掉所有html标签
        const attrReg = /alt=[\'\"]?([^\'\"]*)[\'\"]?/i;
        const result = newVal
          .replace(/<img(?:.|\s)*?>/gi, function(item) {
            return item.match(attrReg)[1];
          })
          .replace(/<[^>]+>/g, "");
        this.$emit("input", result);
      }
    },
    methods: {
      insert(e) {
//      console.log('e', typeof e);😍
        this.$refs["content"].innerText += '😍';
        this.poi = this.$refs["content"].innerText.length;
        this.content = this.$refs["content"].innerText;
        // this.$refs["content"].value += '😍';
      },
      addEmoji() {
        this.$refs["content"].innerHTML +=
          '<img alt="😎" src="https://twemoji.maxcdn.com/36x36/1f60e.png" style="width:20px;">';
        this.poi = this.$refs["content"].innerText.length;
        this.content = this.$refs["content"].innerHTML;
      },
      selectPersonal(name) {
        let html = this.$refs["content"].innerHTML;
        const strStart = html.substr(0, this.poi);
        const strEnd = html.substr(this.poi);
        const result = strStart + name + strEnd;
        this.$refs["content"].innerHTML = result;
        this.content = result;
        this.poi += name.length;
        //        console.log('selectPersonal', this.poi);
      },
      changePoi(evt) {
        this.poi = this._getMousePoi(evt);
        //        console.log('dir', this.poi);
      },
      onKeyUp(evt) {
        if (evt.target.innerText === this.innerText) return;
        const diff = Math.abs(
          evt.target.innerText.length - this.innerText.length
        );
        this.content = evt.target.innerHTML;
        this.poi += diff;
        this.innerText = evt.target.innerText;
        //  console.log('onKeyUp', this.poi);
      },

      _getMousePoi(evt) {
        const element = evt.target;
        const doc = element.ownerDocument || element.document;
        const win = doc.defaultView || doc.parentWindow;
        let sel;
        let caretOffset = 0;
        if (win.getSelection) {
          sel = win.getSelection();
          if (sel.rangeCount > 0) {
            //选中的区域
            const range = win.getSelection().getRangeAt(0);
            const preCaretRange = range.cloneRange(); //克隆一个选中区域
            preCaretRange.selectNodeContents(element); //设置选中区域的节点内容为当前节点
            preCaretRange.setEnd(range.endContainer, range.endOffset); //重置选中区域的结束位置
            caretOffset = preCaretRange.toString().length;
          }
        }
        return caretOffset;
      }
    },
    created() {
      this.poi = 0;
      /* const str = "dasdasd$1f6c$dadadad $2f6c$ fsdfsd$3f6c$ dasd $4f6c$das$31-20e3$";
       const reg = /\$(\d|\w|-)+\$/gi;
       // console.log('match', str.match(reg));
       const newStr = str.replace(reg, function(a) {
       // 每次匹配成功都会执行一次，到时只需将src替换成图片地址即可
       console.log("a :", a);
       return '<img src="xxx" alt=' + a + ">";
       });
       console.log("newStr :", newStr); */
    },
    mounted() {
      setTimeout(() => {
        // console.log('newValue :', this.value);
        this.innerText = this.value;
        this.$refs["content"].innerText = this.value;
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
      padding: 0 15px;
      font-size: @font-size-normal;
      overflow-y: hidden;
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
