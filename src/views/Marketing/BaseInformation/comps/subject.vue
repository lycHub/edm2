<template>
  <div class="subject-tool">
    <div
      class="content"
      contenteditable="true"
      @keyup="onkeyUp"
      @paste="onpaste"
      @blur="$emit('on-blur')"
      ref="content">
    </div>
    <Emoji :visible="visible" @on-visible-change="visible = $event" @on-select="onSelectEmoji"></Emoji>
  </div>
</template>
<script>
  import Emoji from './emoji.vue'
  export default {
    name: "Subject",
    components: { Emoji },
    props: {
      value: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        content: this.value,
        html: '',
        visible: false,
        contentWrap: null
      };
    },
    watch: {
      value: {
        handler(newVal) {
          this.content = newVal;
          this.html = this.emojiParse(newVal);
        },
        immediate: true
      },
      html(newVal) {
//        console.log('html', newVal);
        const attrReg = /alt=[\'\"]?([^\'\"]*)[\'\"]?/i;
        const result = newVal
          .replace(/<img(?:.|\s)*?>/gi, function(item) {
            return item.match(attrReg)[1];
          }); /*.replace(/<[^>]+>/g, "")*/
        this.content = result;
//        this.$refs['content'].innerHTML = newVal;
      },
      content(newVal) {
        const val = newVal.replace(/&nbsp;/g, ' ');
        this.$emit("input", val);
        this.$emit("on-change", val);
      }
    },
    methods: {
      onSelectEmoji(alt) {
        const emoji = this.emojiParse(alt);
        this.html += emoji;
        this.contentWrap.innerHTML += emoji;
//        this.poi = this.content.length;
      },
      onkeyUp(evt) {
        // console.log('keyup');
        this.html = evt.target.innerHTML;
        // this.html = evt.target.innerText;
        // .replace(/<[^>]+>|&[^>]+;/g,"")
      },
      onpaste(evt) {
        console.log('onpaste');
        this._textInit(evt);
      },

      _textInit(e) {
        e.preventDefault();
        let text;
        const clp = (e.originalEvent || e).clipboardData;
//        console.log('clp', clp);
        if (!clp) {
          text = window.clipboardData.getData("text") || "";
//          console.log('text no', text);
          if (text) {
            if (window.getSelection) {
              console.log('getSelection', window.getSelection());
              let newNode = document.createElement("span");
              newNode.innerHTML = text;
              window.getSelection().getRangeAt(0).insertNode(newNode);
            } else {
              document.selection.createRange().pasteHTML(text);
            }
          }
        } else {
          text = clp.getData('text/plain') || "";
//          console.log('text', text);
          if (text) {
            document.execCommand('insertText', false, text);
          }
        }
      },

      changHtml(subject, target = 'html') {
//        console.log('changHtml', subject);
        const type = target === 'html' ? 'innerHTML' : 'innerText';
        if (this.contentWrap) {
          this.contentWrap[type] = subject;
        }
      }
    },
    mounted() {
//      console.log('html', this.html);
      this.contentWrap = this.$refs['content'];
      /*this.$nextTick(() => {
        this.contentWrap = this.$refs['content'];
        this.content = this.value;
        if (this.html) {
          this.contentWrap.innerHTML = this.html;
        }
      })*/
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
      width: 100%;
      height: 100%;
      font-size: @font-size-normal;
      text-indent: 8px;
      overflow: hidden;
      white-space: nowrap;
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
