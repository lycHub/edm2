<template>
  <Form :model="formModel" class="form">
    <div class="item yc-name">
      <FormItem class="form-item name" prop="name">
        <label slot="label" class="label">Name</label>
        <div class="form-control">
          <i-Input size="large" @on-blur="checkField" placeholder="This is for your own reference" v-model.trim="formModel.name" />
          <span class="error" v-show="errorMsg['name']">{{errorMsg['name']}}</span>
        </div>
      </FormItem>
      <FormItem class="form-item">
        <EdSelect
          ref="categorySelect"
          :count="categoryCount"
          :showSpin="showFilterSpin"
          :showLoadMoreSpin="showLoadMoreSpin"
          :visible="visible"
          :data="categories"
          @on-visible-change="visible = $event"
          @on-search="onSearch"
          @on-add="onAdd">
          <Button slot="handle" icon="ios-folder-outline" size="large" :class="['btn-ed-select', {active: this.visible}]">
            <span class="item-name">{{selectedCategory.name}}</span>
            <span>({{selectedCategory.count || 0}})</span>
            <!--<Icon :type="classifyIconType" size="18" />-->
            <Icon type="ios-arrow-down" size="18" />
          </Button>

          <EdScroll :data="categories" ref="categoryScroll" @on-pull-up="onPullUp">
            <div>
              <EdSelectItem
                @on-confirm-edit="onConfirmEdit"
                @on-delete="onDelete"
                v-for="item in categories"
                :key="item.id"
                :editable="item.name !== 'Uncategoried'"
                :deletable="item.name !== 'Uncategoried' && item.id !== selectedCategory.id"
                :id="item.id"
                :label="item.name"
                :activedId="selectedCategory.id">
                <div class="drop-down-item">
                  <span class="item-name" v-highlight @click="onSelect(item)">
                    {{item.name}}
                  </span>
                  <span>({{item.count || 0}})</span>
                </div>
              </EdSelectItem>
            </div>
          </EdScroll>
        </EdSelect>
      </FormItem>
    </div>

    <div class="item subject">
      <FormItem class="form-item" prop="subject">
        <label slot="label" class="label">Subject</label>
        <div class="form-control">

          <!--
          :value="formModel.subject"
            @on-change="formModel.subject = $event"
             v-model.trim="formModel.subject"
          -->
          <Subject
            ref="subject"
            v-model.trim="formModel.subject"
            @on-blur="checkField"></Subject>
          <span class="error" style="left:78px;" v-show="errorMsg['subject']">{{errorMsg['subject']}}</span>
        </div>
      </FormItem>
    </div>

    <div class="item sender">
      <FormItem class="form-item sender-name" prop="senderName">
        <label slot="label" class="label">Sender</label>
        <div class="form-control">
          <i-Input class="form-control" :maxlength="50" placeholder="Sender's name" v-model.trim="formModel.senderName" />
          <span class="error" v-show="errorMsg['senderName']">{{errorMsg['senderName']}}</span>
        </div>
      </FormItem>
      <FormItem class="form-item sender-mail">
        <div class="form-control email-control">
          <Select label-in-value @on-change="onSelect($event, 'sender')" v-model="selectedSenderEmail.value">
            <Option v-for="item in senderEmails" :value="item.id" :key="item.id">{{ item.email }}</Option>
          </Select>
        </div>
      </FormItem>
    </div>

    <div class="reply-tip">
      <Alert class="alert">We recommend that you authenticate your mailbox domain to improve the delivery of your mail.</Alert>
      <p v-if="!showReply">
        Is your reply address different from the sender's address?
        <span @click="showReply = true">Set reply address</span>
      </p>
      <p v-else>
        <span @click="showReply = false">Use the sender's address as the reply address</span>
      </p>
    </div>

    <div class="item recipients" v-show="showReply">
      <FormItem class="form-item recipients-control">
        <label slot="label" class="label">Reply email</label>
        <div class="form-control">
          <Select class="handle" label-in-value @on-change="onSelect($event, 'reply')" v-model="selectedReplyEmail.value">
            <Option v-for="item in senderEmails" :value="item.id" :key="item.id">{{ item.email }}</Option>
          </Select>
         <!--  <EdSelect
            ref="replyEmailSelect"
            :count="emailCount"
            :panelWidth="580"
            :createLabel="'add a new address'"
            :visible="replyEmailVisible"
            :showSpin="showFilterSpin"
            :showLoadMoreSpin="showLoadMoreSpin"
            :showPass="true"
            @on-search="onSearch($event, 'reply')"
            @on-add="onAdd($event, 'email')"
            @on-visible-change="replyEmailVisible = $event">
            <i-Input
              icon="ios-arrow-down"
              slot="handle"
              class="handle"
              :value="selectedReplyEmail.email"
              readonly />
            <EdScroll :data="replyEmails" ref="replyScroll" @on-pull-up="onPullUp('reply')">
              <div>
                <EdSelectItem
                  v-for="item in replyEmails"
                  :key="item.id"
                  :id="item.id"
                  :activedId="selectedReplyEmail.id"
                  :editable="false"
                  @on-delete="onDelete($event, 'email')">
                  <span v-highlight @click="onSelect(item, 'reply')">{{item.email}}</span>
                </EdSelectItem>
              </div>
            </EdScroll>
          </EdSelect> -->
          <!--<span class="error" v-show="errors['replyInfoId'].showErrors">This is required</span>-->
        </div>
      </FormItem>
    </div>
  </Form>
</template>

<script>
import Subject from './subject.vue';
import MarketCategoryServe from '../../../../service/marketing/market-category.service'
import EmailServe from '../../../../service/marketing/email.service'
import {isEmptyObj, validEmail} from "../../../../utils/tool";
import AsyncValidator from 'async-validator';
import { mapGetters } from 'vuex';

// 分类名的验证规则
const categoryDes = {
  categoryName: {
    type: "string",
    required: true,
    max: 50
  }
};

// 分类名的验证规则
const emailDes = {
  email: {
    type: "email",
    required: true
  },
  password: {
    required: true
  }
};


// 表单验证规则
const formDes = {
  subject: {
    type: "string",
//    required: true,
    max: 500
  },
  name: [
    {
      type: "string",
      required: true,
      max: 200
    },
    {
      // 中文字母空格
      pattern: /^[\u4e00-\u9fa5a-zA-Z\s\d]+$/,
      message: 'Cannot enter special characters'
    }
  ],
  senderName: [
    {
      type: "string",
      max: 50,
      message: "sender's name cannot be longer than 50 characters"
    },
    {
      // 中文字母空格
      pattern: /^[\u4e00-\u9fa5a-zA-Z\s]+$/,
      message: 'Only Chinese and letters can be entered'
    }
  ]
};


export default {
  name: 'FormWrap',
  components: {
    Subject
  },
  props: {
    market: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      // 显示收件人
      showReply: false,

      // 加载营销分类的spin
      showFilterSpin: false,
      showLoadMoreSpin: false,

      // 显示分类下拉
      visible: false,

      //  发件人邮箱下拉
      senderEmailVisible: false,

      // 回复邮箱下拉
      replyEmailVisible: false,
      filterable: false,

      categoryParams: {
        pageNum: 1,
        pageSize: 8,
        name: ''
      },
      categories: [],
      categoryCount: 0,
      categoryTotalPage: 0,

      // 当前选中的分类
      selectedCategory: {},


      emails: [],
      emailCount: 0,
      emailTotalPage: 0,

      senderEmailParams: {
        pageNum: 1,
        pageSize: 8,
        email: ''
      },

      senderEmails: [],

      // 当前选中的发送email
      selectedSenderEmail: {},

      replyEmailParams: {
        pageNum: 1,
        pageSize: 8,
        email: ''
      },

      replyEmails: [],

      // 当前选中的回复email
      selectedReplyEmail: {},

      formModel: {
        name: '',
        subject: '',
        senderName: ''
      },
      errors: null
    }
  },
  computed: {
    classifyIconType() {
      return this.visible ? 'ios-arrow-up' : 'ios-arrow-down';
    },
    errorMsg() {
      const obj = {};
      if (this.errors) {
        this.errors.forEach(item => {
          obj[item.field] = item.message || '';
        })
      }
      return obj;
    },
    ...mapGetters(['userInfo']),
  },
  watch: {
    /*selectedCategory(newVal) {
      console.log('selectedCategory', newVal);
    },*/
    'categoryParams.name'() {
      this.showFilterSpin = true;
      this._getCategories();
    },

    'categoryParams.pageNum'(newVal) {
      // console.log('categoryParams._page', newVal);
      if (newVal > 1) {
        this.showLoadMoreSpin = true;
        this._getCategories(true);
      }else {
        this.$refs['categoryScroll'] && this.$refs['categoryScroll'].scrollTo(0, 0);
      }
    },

    'senderEmailParams.email'() {
      this.showFilterSpin = true;
      this._getEmails(this.senderEmailParams, 'sender');
    },

    'senderEmailParams.pageNum'(newVal) {
      // console.log('senderEmailParams.pageNum', newVal);
      if (newVal > 1) {
        this.showLoadMoreSpin = true;
        this._getEmails(this.senderEmailParams, 'sender', true);
      }else {
        this.$refs['senderScroll'] && this.$refs['senderScroll'].scrollTo(0, 0);
      }
    },

    'replyEmailParams.email'() {
      this.showFilterSpin = true;
      this._getEmails(this.replyEmailParams, 'reply');
    },

    'replyEmailParams.pageNum'(newVal) {
      if (newVal > 1) {
        this.showLoadMoreSpin = true;
        this._getEmails(this.replyEmailParams, 'reply', true);
      }else {
        this.$refs['replyScroll'] && this.$refs['replyScroll'].scrollTo(0, 0);
      }
    },

    /*selectedSenderEmail(newVal) {
      this.checkField('senderInfoId', newVal.id);
    },

    selectedReplyEmail(newVal) {
      this.checkField('replyInfoId', newVal.id);
    },*/

   /* 'formModel.name'(newVal) {
      this.checkField('name', newVal);
    },
    'formModel.subject'(newVal) {
      this.checkField('subject', newVal);
    },*/
    /*'formModel.subject'(newVal) {
      console.log('subject', newVal);
    },*/
    'formModel.senderName'(newVal) {
      this.checkField();
    },



    // 监听market数据
    market(newVal) {
      // console.log('watch reset', newVal);
      this._resetFormValues(newVal);
    }
  },
  methods: {
    /* onChange(val) {
      console.log('val :', val);
    }, */
    onSelect(item, type) {
      switch (type) {
        case 'sender':
          this.selectedSenderEmail = item;
          if (isEmptyObj(this.selectedReplyEmail)) {
            this.selectedReplyEmail = item;
          }
          this.senderEmailVisible = false;
          break;
        case 'reply':
          this.selectedReplyEmail = item;
          // console.log(this.selectedReplyEmail);
          this.replyEmailVisible = false;
          break;
        default:
          this.selectedCategory = item;
          this.visible = false;
      }
    },
    onSearch(keyword, type) {
      switch (type) {
        case 'sender':
          this.senderEmailParams.pageNum = 1;
          this.senderEmailParams.email = keyword;
          break;
        case 'reply':
          this.replyEmailParams.pageNum = 1;
          this.replyEmailParams.email = keyword;
          break;
        default:
          // this.$refs['categoryScroll'] && this.$refs['categoryScroll'].closePullUp();
          this.categoryParams.pageNum = 1;
          this.categoryParams.name = keyword;
      }
    },

    // 分类或邮箱下拉加载
    onPullUp(type) {
      // console.log('onPullUp');
      switch (type) {
        case 'sender':
          // console.log('sPull');
          this.senderEmailParams.pageNum = Math.min(this.emailTotalPage, ++this.senderEmailParams.pageNum);
          break;
        case 'reply':
          this.replyEmailParams.pageNum = Math.min(this.emailTotalPage, ++this.replyEmailParams.pageNum);
          break;
        default:
          this.categoryParams.pageNum = Math.min(this.categoryTotalPage, ++this.categoryParams.pageNum);
          // console.log('cPull', this.categoryParams._page);
      }
    },

    // 新增分类或邮箱
    onAdd(params, type) {
      if (type) {
        this._checkEmail(params, msg => {
          if (msg) {
            this.$Message.error(msg);
          }else {
            this._addEmail({
              email: params.newItemName,
              emailPassword: params.emailPassword
            });
          }
        });
      }else {
        this._checkCategoryName(params.newItemName, msg => {
//          console.log(msg);
          if (msg) {
            this.$Message.error(msg);
          }else {
            this._addCategory(params.newItemName);
          }
        });
        /*if (params.newItemName) {
           this._addCategory(params.newItemName);
        }else{
          this.$Message.error("category's name is required!");
        }*/
      }
    },

    // 验证新建分类
    _checkCategoryName(val, cb) {
//      console.log('val', val);
      const validator = new AsyncValidator(categoryDes);
      validator.validate({ categoryName: val }, errors => {
        const msg = errors ? errors[0].message : null;
        cb(msg);
      });
    },

    // 验证新建邮箱
    _checkEmail(params, cb) {
      const validator = new AsyncValidator(emailDes);
      validator.validate({
        email: params.newItemName,
        password: params.emailPassword
      }, errors => {
        const msg = errors ? errors[0].message : null;
        cb(msg);
      });
    },

    // 修改分类
    onConfirmEdit(params) {
      this.showFilterSpin = true;
      MarketCategoryServe.editMarketCategories(params).then(res => {
        this.$Message.success(res.message);
        this.categoryParams.pageNum = 1;
        this.categoryParams.name = '';
        this._getCategories();
        this.categorySelectRef.onClose(params.id);
      }).catch(err => {
        console.error('err add:', err);
        this.$Message.error(err.message);
        this.showFilterSpin = false;
      });
    },

    // 删除分类或邮箱
    onDelete(id, type) {
      this.$Modal.confirm({
        title: 'Do you want to delete this folder？',
        okText: 'Delete',
        cancelText: 'Cancel',
        onOk: () => {
          this.showFilterSpin = true;
          if (type === 'email') {
            this._deleteEmails(id);
          }else {
            this._deleteCategories(id);
          }
        }
      });
    },

    _deleteEmails(id) {
      EmailServe.deleteEmails(id).then(res => {
        this.$Message.success(res.message);
        this.senderEmailParams.pageNum = 1;
        this.senderEmailParams.email = '';
        this._getEmails();
      });
    },

    _deleteCategories(id) {
      if (this.userInfo.id) {
        MarketCategoryServe.deleteMarketCategories(id, this.userInfo.id).then(res => {
          this.$Message.success(res.message);
          this.categoryParams.pageNum = 1;
          this.categoryParams.name = '';
          this._getCategories();
        });
      }else {
        this.$Message.error('No user info');
      }
    },


    // 新增分类
    _addCategory(label) {
      this.showFilterSpin = true;
      MarketCategoryServe.addMarketCategories(label).then(res => {
        // console.log('_addCategory :', res);
        this.$Message.success(res.message);
        this.categoryParams.pageNum = 1;
        this.categoryParams.name = '';
        this._getCategories();
        this.categorySelectRef.creating = false;
      }).catch(err => {
        console.log('err add:', err);
        // this.$Message.error(err.message);
        this.$Modal.error({title: err.message});
        this.showFilterSpin = false;
      });
    },

    // 新增邮箱
    _addEmail(params) {
      this.showFilterSpin = true;
      EmailServe.addEmail(params).then(res => {
        this.$Message.success(res.message);
        this.senderEmailParams.pageNum = this.replyEmailParams.pageNum = 1;
         this.senderEmailParams.email = this.replyEmailParams.email = '';
        this._getEmails();
        this.$refs['senderEmailSelect'].creating = false;
        this.$refs['replyEmailSelect'].creating = false;
      }).catch(err => {
        console.log('err add:', err);
        this.$Message.error(err.message);
        this.showFilterSpin = false;
      });
    },

    _getCategories(isPull = false) {
      MarketCategoryServe.getMarketCategories(this.categoryParams).then(res => {
          // console.log('_getCategories :', res);
          this.categoryCount = res.total;
          this.categoryTotalPage = res.pages;
          // this.categoryTotalPage = Math.ceil((res.count / this.categoryParams.pageSize));

          if (isPull) {
            this.categories = this.categories.concat(res.list);
            this.showLoadMoreSpin = false;
          }else {
            this.categories = res.list;
          }

          if (isEmptyObj(this.selectedCategory) || this.selectedCategory.name === 'Uncategoried') {
              const categoryItem = this.categories.find(item => item.name === 'Uncategoried');
              if (categoryItem) {
                this.selectedCategory = categoryItem;
              }
            }
          this.showFilterSpin = false;
          // this.showSpin = false;

      });
    },

    _getEmails(params, type, isPull = false) {
      const arg = params || this.senderEmailParams;
      EmailServe.getEmails(arg).then(res => {
          this.emailCount = res.total;
          this.emailTotalPage = res.pages;
          if (type) {
            if (type === 'sender') {
              if (isPull) {
                this.senderEmails = this.senderEmails.concat(res.list);
              }else {
                this.senderEmails = res.list;
              }
            }else {
              if (isPull) {
                this.replyEmails = this.replyEmails.concat(res.list);
              }else {
                this.replyEmails = res.list;
              }
            }
          }else {
            this.senderEmails = [...res.list];
            this.replyEmails = [...res.list];
          }
          this.showLoadMoreSpin = false;
          this.showFilterSpin = false;
      });
    },

    // 回显营销分类
    _resetSelectedCategory() {
      MarketCategoryServe.getMarketCategoryInfo(this.market.marketCategoryId).then(res => this.selectedCategory = res);
    },

    _resetFormValues(newVal) {
      if (isEmptyObj(newVal)) {
        this.selectedSenderEmail = {
          value: 213,
          label: 'edm@mysteel.com'
        }
        this.selectedReplyEmail = {
          value: 213,
          label: 'edm@mysteel.com'
        }
      }else {
        this._resetSelectedCategory();
        this.formModel = {
          name: newVal.name,
          subject: newVal.subject,
          senderName: newVal.senderName
        }
        this.selectedSenderEmail = {
          value: newVal.senderInfoId,
          label: newVal.senderEmail
        }
        this.selectedReplyEmail = {
          value: newVal.replyInfoId,
          label: newVal.replyEmail
        }
        this.$nextTick(() => {
          this.$refs['subject'].changHtml(this.emojiParse(newVal.subject));
        });
      }
    },
    getFormValue() {
//      console.log('errorMsg', this.errorMsg);
      return {
        ...this.formModel,
        senderInfoId: this.selectedSenderEmail.value,
        senderEmail: this.selectedSenderEmail.label,
        replyInfoId: this.selectedReplyEmail.value,
        replyEmail: this.selectedReplyEmail.label,
        marketCategoryId: this.selectedCategory.id
      }
    },

    checkField() {
      this.validator.validate({
        subject: this.formModel.subject,
        name: this.formModel.name,
        senderName: this.formModel.senderName
      }, errors => {
        if (errors) {
          const nameErr = errors.findIndex(item => item.field === 'name');
          if (nameErr === -1) {
            this._fillSubject();
          }
        }else {
          this._fillSubject();
        }
//        console.log(this.formModel.subject);
        this.errors = errors;
      });
    },

    _fillSubject() {
      if (!this.formModel.subject) {
        this.formModel.subject = this.formModel.name;
        this.$refs['subject'].changHtml(this.formModel.name);
      }
    }
  },
  created() {
    // this.showSpin = true;
    this._resetFormValues(this.market);
    this._getCategories();
    this._getEmails();
    this.validator = new AsyncValidator(formDes);
  },
  mounted() {
    this.categorySelectRef = this.$refs['categorySelect'];
  }
};
</script>

<style lang="less" scoped>
 @import "~assets/styles/variable";
.form{
  .label{
    display: block;
    font-size: @font-size-mid;
    min-width: 66px;
    text-align: right;
  }

  .item{
    margin-top: 35px;
    .form-item{
      .form-control{
        position: relative;
        .error{
          position: absolute;
          left: 0;
          bottom: -30px;
          color: @font-color-error;
        }
      }
    }
  }
  .yc-name {
    display: flex;
    align-items: center;
    .form-item{
      margin-bottom: 0;
      .btn-classify{
        color: @font-color-normal;
        &.active{
          border-color: @border-blue;
        }
      }
    }
    .name{
      display: flex;
      align-items: center;
      margin-right: 15px;
      .form-control{
        width: 656px;
        border-color: @border-prev;
      }
    }

  }

  .sender{
    display: flex;
    align-items: center;
    .sender-name{
      display: flex;
      align-items: center;
      .form-control{
        width: 310px;
      }
    }
    .sender-mail{
      width: 330px;
      margin-left: 15px;
    }
  }

  .reply-tip{
    .alert{
      width: 655px;
      margin-left: 78px;
    }
    p{
      text-indent: 78px;
      span{
        margin-left: 8px;
        color: @font-color-primary;
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .recipients{
    .recipients-control{
      display: flex;
      .handle{
        width: 640px;
      }
    }
  }
}
</style>
