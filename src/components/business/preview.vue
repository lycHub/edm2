<template>
  <div class="ed-preview">
    <div class="abstract" v-show="showAbstracts">
      <div class="text">
        <span class="add-abstract" v-if="!abstracts" @click="abstractModal = true">Add abstracts</span>
        <Tooltip max-width="600" v-else :content="abstracts">
          <p>{{abstracts}}</p>
        </Tooltip>
      </div>
      <div class="icons">
        <div class="help" v-if="!abstracts">
          <Tooltip max-width="300" content="Abstract is a brief summary that follows the subject when your mail is listed in the inbox">
            <Icon type="ios-help-circle-outline" class="icon" />
          </Tooltip>
        </div>
        <div class="opreators" v-else>
          <Tooltip max-width="300" content="edit">
            <Icon custom="i-icon icon-bianji" class="icon edit" @click="abstractModal = true" />
          </Tooltip>
          <Tooltip max-width="300" content="delete">
            <Icon type="ios-trash" class="icon" @click="onDelete('abstracts')" />
          </Tooltip>
        </div>
      </div>
    </div>


    <div class="card">
      <div class="main-body">
        <div :class="['content-wrap', { 'phone-mode': mode === 'phone' }]">
          <div class="phone-view">
           <div class="mini-view">
             <!--页眉-->
             <div ref="pageHeader">
               <div v-show="showHF === '1'" class="txtsize" style="text-align:center;color:#333;font-size:11px;font-family:Arial;background-color: #f7f7f7; padding: 10px 0;margin-bottom: 20px;">
                 Not displaying correctly? &nbsp;
                 <a target="" href="#" style="color:#03F;font-size:14px;font-family:Arial;">
                   <span style="color:#03F;font-size:11px;font-family:Arial;">View in Browser</span>
                 </a>
               </div>
             </div>

             <!-- 附件列表 -->
             <div class="files" v-show="contentFiles && contentFiles.length">
               <ul>
                 <li v-for="item in contentFiles" :key="item.id">
                   <Icon custom="i-icon icon-enclosure" />
                   <span>{{item.fileName}}</span>
                   <Icon v-show="delFile" type="ios-trash" size="20" class="icon" @click="$emit('on-delete-file', item.id)" />
                 </li>
               </ul>
             </div>

             <!--正文-->
             <div class="contents" ref="contents" v-html="contents"></div>

             <!--页脚-->
             <div ref="pageFooter">
               <div v-show="showHF === '1'" style="background-color: #f7f7f7;font-size: 14px;text-align: center;padding: 20px 0;margin-top: 20px;">
                 <p>This message is sent from
                   <a style="color:#0000FF;font-size:14px;font-family:Arial;" :href="'mailto:' + testEmail">{{testEmail}}</a>
                   to
                   <a style="color:#0000FF;font-size:14px;font-family:Arial;" href="mailto:[recipient's mailbox]"><span style="">[recipient's mailbox]</span></a>
                 </p>
                 <p style="margin: 10px 0;">
                   <a style="color:#0000FF;font-size:14px;font-family:Arial;" href="#">Unsubscribe</a> |
                   <a style="color:#0000FF;font-size:14px;font-family:Arial;" href="#">Manage Preferences</a>
                 </p>
                 <p>mysteel | MYSTEEL300226MYSTEEL300226</p>
               </div>
             </div>
           </div>
          </div>
        </div>
      </div>

      <div class="bottom" v-show="showBottom">
        <!--<div class="theme">
          <span>Header and footer theme</span>
          <Select class="select" v-model="showHF">
            <Option value="1">Mysteel theme</Option>
            <Option value="0">No headers and footers</Option>
          </Select>
        </div>-->
        <div class="btns">
          <Button class="btn edit" v-btn-style size="large" @click="$emit('on-edit')">Edit contents</Button>
          <Button class="btn delete" v-btn-style size="large" @click="onDelete">Delete</Button>
          <Button class="btn preview" v-btn-style="'green'" size="large" @click="onPreview('pc')">Preview & Test</Button>
          <Button class="btn preview-phone" size="large" v-btn-style="'blue'" @click="onPreview('phone')">Phone Preview</Button>
        </div>
      </div>
    </div>

    <Abstract :abstracts="abstracts" v-model="abstractModal" @on-change="$emit('on-change-abstracts', $event)"></Abstract>
  </div>
</template>

<script>
  import {oneOf} from "iview/src/utils/assist";
  export default {
    name: 'Preview',
    props: {
      initHF: {
        type: String,
        default: '0'
      },

      // 是否能删附件
      delFile: {
        type: Boolean,
        default: true
      },

      showAbstracts: {
        type: Boolean,
        default: true
      },

      showBottom: {
        type: Boolean,
        default: false
      },

      mode: { // 预览模式
        validator (value) {
          return oneOf(value, ['pc', 'phone']);
        },
        default: 'pc'
      },
      abstracts: {
        type: String,
        default: ''
      },
      contents: {
        type: String,
        default: ''
      },
      contentFiles: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        testEmail: 'a11535333@sina.com',
        // 是否显示页眉页脚
        showHF: this.initHF,
        abstractModal: false
      }
    },
    /*computed: {
      contentViewClass() {
        return this.mode === 'phone' ? 'content-wrap phone-mode' : 'content-wrap';
      }
    },*/
    watch: {
      contents(newVal) {
        // this.$refs['contents'].innerHTML = newVal;
      },
      initHF(newVal) {
        this.showHF = newVal;
      },
      showHF(newVal) {
        this.$emit('on-change-hf', newVal);
      }
    },
    methods: {
      // 删摘要或正文
      onDelete(type) {
        let label = '';
        let event = '';
        [label, event] = type === 'abstracts' ? ['abstract', 'on-change-abstracts'] : ['content', 'on-delete']
        this.$Modal.confirm({
          title: `Do you want to delete the ${label} ？`,
          okText: 'Delete',
          onOk: () => {
            this.$emit(event, '');
          }
        });
      },
      onPreview(mode) {
        this.$emit('on-preview', mode);
      }
     /* getHF() {
        return {
          header: this.$refs['pageHeader'].innerHTML,
          footer: this.$refs['pageFooter'].innerHTML
        }
      }*/
    },
    mounted() {
      // this.$refs['contents'].innerHTML = this.contents;
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/styles/variable";
  @import "../../assets/styles/mixin";
  .ed-preview{
    .abstract{
      background-color: @bg-shallow-blue;
      border: 1px dashed @border-dashed;
      font-size: @font-size-normal;
      padding: 10px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .text{
        .add-abstract{
          cursor: pointer;
          color: @font-color-blue;
        }
        p{
          max-width: 600px;
          .no-wrap();
        }
      }
      .icons{
        .icon{
          font-size: @font-size-lgx;
          cursor: pointer;
          &.edit{
            margin-right: 10px;
          }
        }
      }
    }

    .card{
      border: 1px solid #c4d3da;
      border-radius: 3px;
      box-shadow: 0 1px 10px #d4dfe5;
      .main-body{
        .content-wrap{
          max-height: 500px;
          overflow-y: auto;
          padding: 15px;
          &.phone-mode{
            max-height: 600px;
            .phone-view{
              width: 420px;
              height:880px;
              margin: 0 auto;
              background: url(../../assets/images/Apple-iPhone-6s-Space-Template.png) no-repeat;
              padding: 110px 13px 110px 31px;
              transition: all .2s;
              .mini-view{
                height:640px;
                overflow-y: scroll;
                // overflow-x: hidden;
                /*transition: all .2s;*/
              }
            }
          }

          .files{
            margin: 15px 0;
            font-size: @font-size-normal;
            ul li{
              span{
                margin: 0 5px;
              }
              .icon{
                cursor: pointer;
              }
            }
          }

          .contents{
            word-wrap: break-word;
          }
        }
      }
      .bottom{
        .theme{
          display: flex;
          align-items: center;
          font-size: @font-size-mid;
          padding: 15px;
          background-color: @bg-shallow-blue;
          .select{
            width: 412px;
            margin-left: 15px;
          }
        }
        .btns{
          width: 490px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          /* .btn{
            color: #fff;
          }
          .edit{
            background-color: @bg-btn-dull-prev;
          }
          .preview{
            background-color: @bg-btn-green;
          }
          .preview-phone{
            background-color: @bg-btn-primary;
          } */
        }
      }
    }
  }
</style>
