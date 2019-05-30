<template>
  <div class="editor">
    <div class="header">
      <div class="acts">
        <span class="title">
        {{market.name}}
      </span>
        <div class="btns">
          <!-- :before-upload="handleUpload" -->
          <Button class="btn enclosure" @click="openEnclosureModal">
            <Icon custom="i-icon icon-enclosure" size="24" />
          </Button>
          <!--   <Upload
              multiple
              :show-upload-list="false"
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              action="http://mgt.mysteelcms.com/edm/contentfile/upLoadFile">
              <Button class="btn enclosure">
                <Icon custom="i-icon icon-enclosure" size="24" />
              </Button>
            </Upload> -->
          <Button class="btn preview" @click="onPreview" v-btn-style>Preview & Test</Button>
          <Button class="btn save" v-btn-style @click="onSave">Save</Button>
          <Button class="btn save-close" v-btn-style="'green'" @click="onSave('back')">Save & Exit</Button>
          <Dropdown trigger="click" placement="bottom-end" v-if="editorType === 0">
            <Button class="btn" v-btn-style>More <Icon type="ios-arrow-down"></Icon></Button>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="showSaveTemplate = true">Save as Template</DropdownItem>
              <DropdownItem @click.native="onLeave">Close</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button class="btn" v-btn-style @click.native="onLeave" v-else>Exit</Button>
        </div>
      </div>
      <div class="files" v-show="files.length">
        <EdScroll :maxHeight="200" :data="files">
          <ul>
            <li v-for="(item, index) in files" :key="index">
              <Icon custom="i-icon icon-enclosure" />
              <span>{{item.fileName}}</span>
              <Icon type="ios-trash" size="20" class="icon" @click="onDeleteFile(index)" />
            </li>
          </ul>
        </EdScroll>
      </div>
    </div>

    <div class="editor-wrap">
      <TinyMce ref="tinyMce" :type="editorType" @open-library="openImgLibrary"></TinyMce>
    </div>
    <Spin size="large" fix v-if="showLoading">
      <div class="my-loading">
        <div class="dot white"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </Spin>
    <router-view/>

    <!--保存模板弹窗-->
    <SaveTemplateModal v-model="showSaveTemplate" @on-ok="saveAsTemplate"></SaveTemplateModal>

    <!-- 附件弹窗 -->
    <Modal
      v-model="showEnclosureModal"
      :closable="false"
      :mask-closable="false"
      title="Select file"
      @on-ok="onOk"
      @on-cancel="onCancel"
      width="980">
      <Enclosure :files="files" @on-delete="onDeleteFile" @on-upload-completed="onUploaded" ref="enclosure">
        <Library
          v-if="showEnclosureModal"
          ref="library"
          :categories="categoriesFile"
          :showSpin="showSpin"
          :fileList="fileList"
          :activeCategoryId="activeCategoryId"
          @on-change-categoryId="activeCategoryId = $event"
          @library-files="selectedLibraryFiles = $event">
        </Library>
      </Enclosure>
      <!--
      @on-ok="onOk"
      @on-cancel="onCancel"
      -->
      <!--<div class="btns" slot="footer">
        <Button>Cancel</Button>
        <Button @click="onOk">Ok</Button>
      </div>-->
    </Modal>

    <Modal
      v-model="showLibraryModal"
      :closable="false"
      :mask-closable="false"
      @on-ok="onInsertImg"
      @on-cancel="onCancel('img')"
      title="Select file"
      width="980">
      <Library
        v-if="showLibraryModal"
        ref="library"
        libType="image"
        :showSpin="showSpin"
        :categories="categoriesImg"
        :fileList="imgList"
        :activeCategoryId="activeCategoryIdImg"
        @on-change-categoryId="activeCategoryIdImg = $event"
        @library-files="selectedLibraryFiles = $event">
      </Library>
    </Modal>
  </div>
</template>

<script>
import TinyMce from "./comps/tinymce";
import Enclosure from "./comps/enclosure/enclosure";
import SaveTemplateModal from "./comps/save-template";
import Library from "./comps/enclosure/library";
import { mapGetters, mapMutations } from "vuex";
import { setTimeout } from "timers";
import MarketsServe from "../../../service/marketing/markets.service";
import TemplateServe from "../../../service/marketing/template.service";
import FileServe from "../../../service/marketing/file.service";
import MarketCategoryServe from '../../../service/marketing/market-category.service';
import axios from 'axios';

export default {
  name: "Editor",
  components: {
    TinyMce,
    Enclosure,
    SaveTemplateModal,
    Library
  },
  data() {
    return {
      contents: "",
      showLoading: false,
      showSaveTemplate: false,
      showEnclosureModal: false,
      showLibraryModal: false,

      // 已上传的文件
      files: [],

      // library选中的文件
      selectedLibraryFiles: [],

      upLoadComplete: true,


      // 附件列表
      fileList: [],

      // 图片库列表
      imgList: [],

      // 当前选中的分类id
      activeCategoryId: null,

      // 当前选中的分类id---图片库
      activeCategoryIdImg: null,

      categoriesFile: [],
      categoriesImg: [],
      showSpin: false
    };
  },
  computed: {
    // 正文是否有改动
    hasSaved() {
      return this.contents === (this.market.contents || "");
    },
    editorType() {
      return this.market.type || 0;
    },
    ...mapGetters(["market", "testPreview"])
  },

  watch: {
    market(newVal) {
      console.log('editor newVal market:', newVal);
      if (!newVal.type && newVal.type !== 0) {
        this.intercept = false;
        this.onLeave();
      }else {
        this._resetDatas();
      }
    },
    /*testPreview(newVal) {
      console.log('editor testPreview market:', newVal);
    },*/

    activeCategoryId() {
      this.showSpin = true;
      this._getFileList();
    },
    activeCategoryIdImg() {
      this.showSpin = true;
      this._getFileList(false, 'image');
    }
  },


  methods: {
    onOk() {
      if (this.selectedLibraryFiles.length) {
        this.files.push(...this.selectedLibraryFiles);
        this._resetLibrary();
      }else {
        if (this.enclosure.upLoadComplete) {
          this._upDateFiles();
        }
      }
    },
    onCancel(type) {
      if (type !== 'img') {
        this.enclosure.reset();
        this.enclosure.newUploadFiles = [];
      }
      this._resetLibrary();
    },

    // 上传完毕
    onUploaded() {
      if (!this.showEnclosureModal) {
        this._upDateFiles();
      }
    },

    // 重置附件库的选中状态
    _resetLibrary() {
      this.$refs['library'].$emit('reset');
    },

    _upDateFiles() {
      this.files.push(...this.enclosure.newUploadFiles);
      this.enclosure.newUploadFiles = [];
    },

    // 打开附件弹窗
    openEnclosureModal() {
//      console.log('enclosure', this.enclosure);
//      this.enclosure.canUpLoad = true;
      this.showEnclosureModal = true;
    },

    // 打开图片库
    openImgLibrary(editor) {
      if (editor) {
        this.editor = editor;
        this.showLibraryModal = true;
      }
    },

    // 插入图片到正文
    onInsertImg() {
//      console.log('onInsertImg', this.selectedLibraryFiles);
      if (this.selectedLibraryFiles.length) {
        this.selectedLibraryFiles.forEach(item => {
          this.editor.insertContent(`<img src="${item.filePath}" alt="${item.fileName}"/>`);
        });
      }
      this._resetLibrary();
    },

    onPreview() {
      this._getContent();
      // console.log('contents :', this.contents);
      // console.log('_getContentFiles :', this._getContentFiles());
      if (this.contents) {
        this.intercept = false;
        this.SET_TEST_PREVIEW({
          contents: this.contents,
          contentFiles: this._getContentFiles()
        });
        // this.SET_MARKET({ contents: this.contents });
        this.$router.push("/Marketing/TestPreview");
      }else {
        this.$Message.warning('Please add the text first.');
      }
    },
    onSave(needBack) {
      if (!this.enclosure.upLoadComplete) {
        this.$Message.warning('正在上传附件!');
      }else {
        this._getContent();
        if (this.contents) {
          this.showLoading = true;
          const params = {
            contentFiles: this._getContentFiles(),
            contents: this.contents,
            marketingId: this.market.id,
            type: this.editorType
          }

          const method = this.market.contents ? 'editContents' : 'addContents';

          MarketsServe[method](params).then(res => {
            console.log("content:", res);
//            this.SET_TEST_PREVIEW({});
            this.SET_MARKET(params);
            if (needBack === "back") {
              this.intercept = false;
              this.$router.push("/Marketing/Contents");
            }
            this.showLoading = false;
          }).catch(error => {
            console.error(error);
            this.$Message.error(error.message || 'Save content failed');
            this.showSpin = false;
          });
        }else {
          this.$Message.warning('Please add the text first.');
        }
      }
    },

    // 保存到模板
    saveAsTemplate(params) {
      this._getContent();
      // console.log('params :', params);
      // console.log('contents :', this.contents);
      if (this.contents) {
        this.$Spin.show();
        TemplateServe.addTemplate({
          ...params,
          contents: this.contents,
        }).then(res => {
          this.$Message.success(res.message || 'success');
          this.$Spin.hide();
          this.showSaveTemplate = false;
        }).catch(error => {
          this.$Message.error(error.message || 'fail');
          this.$Spin.hide();
        });
      }else {
        this.$Message.error('请添加正文');
        this.showSaveTemplate = false;
      }
    },

    // 删除附件
    onDeleteFile(index) {
      this._upDateFiles();
      if (this.files.length > 1) {
        this.files.splice(index, 1);
      }else {
        this.files = [];
      }
    },

    // 附件参数
    _getContentFiles() {
      const contentFiles = [];
      if (this.files.length) {
        this.files.forEach(item => {
          contentFiles.push({ ...item, marketingId: this.market.id });
        });
      }
      return contentFiles;
    },

    onLeave() {
      this.$router.push("/Marketing/Contents");
    },

    _getContent() {
      this.contents = this.tinyMce.getContent();
    },
    _setContent() {
      this.tinyMce.setContent(this.contents);
    },

    // 进入页面时重置数据
    _resetDatas() {
      const data = {
        contents: this.testPreview.contents || this.market.contents || '',
        contentFiles: this.testPreview.contentFiles || this.market.contentFiles || []
      }
      this.files = [...data.contentFiles];
      this.contents = data.contents;
      this._setContent();
    },

    // 获取模板详情
    _getTemplateInfo(id, cb) {
      TemplateServe.getTemplateInfo(id).then(res => {
        // console.log("template :", res);
        this.contents = res.contents;
        if (cb) cb();
      });
    },

    // 初始化附件库
    _initLibrary() {
      // 坑爹的后台
      const defaultParams = {
        "name": "",
        "pageNum": 0,
        "pageSize": 0
      }
      axios.all([
        MarketCategoryServe.getMarketCategories(defaultParams, 'listCountFile'),
        MarketCategoryServe.getMarketCategories(defaultParams, 'listCountImg'),
        this._getFileList(true)
      ]).then(axios.spread((categoriesCountFile, categoriesCountImg, files) => {
          this.categoriesFile = categoriesCountFile.list || [];
          this.categoriesImg = categoriesCountImg.list || [];
          if (this.categoriesFile.length) {
            this.activeCategoryId  = this.categoriesFile.find(item => item.name === 'Uncategoried').id;
          }
          if (this.categoriesImg.length) {
            this.activeCategoryIdImg = this.categoriesImg.find(item => item.name === 'Uncategoried').id;
          }
          if (files) {
            this.fileList = files.contentFileListRespVO || [];
            this.imgList = files.imageListRespVO || [];
          }
        }));
    },

    // 附件列表
    _getFileList(isFirst = false, type) {
      const id = type === 'image' ? this.activeCategoryIdImg : this.activeCategoryId;
      if (!id) return;
      const service = FileServe.fileList(id);
      if (isFirst) {
        return service;
      }else {
        service.then(files => {
          if (type === 'image') {
            this.imgList = files.imageListRespVO || [];
          }else {
            this.fileList = files.contentFileListRespVO || [];
          }
          this.showSpin = false;
        });
      }
    },

    ...mapMutations(["SET_MARKET", "SET_TEST_PREVIEW"]),


    /* handleUpload (file) {
      console.log('file :', file);
      const fd = new FormData();
      fd.append('file', file);
      console.log('fd :', fd.get('file'));
      request.post('/contentfile/upLoadFile', fd).then(res => {
        console.log('res :', res);
      });
      return false;
    }, */
  },
  created() {
    // console.log("editor market", this.market);
    this.showLoading = true;

    // 离开时是否拦截
    this.intercept = true;
    this._initLibrary();
  },
  mounted() {
//     console.log("editor mounted market", this.market);
    this.enclosure = this.$refs['enclosure'];
    this.tinyMce = this.$refs["tinyMce"];
    const templateId = this.$route.query.templateId;
    // console.log('templateId :', templateId);
    if (templateId) {
      this._getTemplateInfo(templateId, () => {
        this._setContent();
        this.showLoading = false;
      });
    } else {
      this._resetDatas();
      this.showLoading = false;
    }
  },

  beforeRouteLeave(to, from, next) {
    if (this.intercept) {
      this._getContent();
      // console.log("hasSaved :", this.hasSaved);
      this.$Modal.confirm({
        title: "Any unsaved content will be lost,Are sure  you want to close the editor?",
        okText: "continue",
        cancelText: "cancel",
        onOk: () => {
//          this.SET_TEST_PREVIEW({});
          next();
        },
        onCancel: () => {
          next(false);
        }
      });
    }else {
      // this.SET_TEST_PREVIEW({});
      next();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~assets/styles/variable";
.editor {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  right: 0;
  bottom: 0;
  background-color: @bg-shallow-blue;
  overflow: auto;
  .header {
    padding: 20px 28px;
    background-color: @color-white;
    margin-bottom: 25px;
    .acts{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: @font-size-mid;
      }
      .btns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .btn {
          font-size: @font-size-normal;
          margin-left: 10px;
          &.enclosure {
            background-color: @color-white;
            color: @color-black;
          }
        }
      }
    }
    .files{
      margin-top: 15px;
      text-align: right;
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
  }

  .editor-wrap {
    padding: 0 28px;
    margin-bottom: 20px;
  }
}

.my-loading {
  position: relative;
  margin: auto;
  width: 6.25em;
  height: 6.25em;
  animation: rotate 2.4s linear infinite;
  .dot {
    position: absolute;
    margin: auto;
    width: 2.4em;
    height: 2.4em;
    border-radius: 100%;
    transition: all 1s ease;
  }
  .dot:nth-child(2) {
    top: 0;
    bottom: 0;
    left: 0;
    background: #ff4444;
    animation: dotsY 2.4s linear infinite;
  }
  .dot:nth-child(3) {
    left: 0;
    right: 0;
    top: 0;
    background: #ffbb33;
    animation: dotsX 2.4s linear infinite;
  }
  .dot:nth-child(4) {
    top: 0;
    bottom: 0;
    right: 0;
    background: #99cc00;
    animation: dotsY 2.4s linear infinite;
  }
  .dot:nth-child(5) {
    left: 0;
    right: 0;
    bottom: 0;
    background: #33b5e5;
    animation: dotsX 2.4s linear infinite;
  }

  .white {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    animation: flash 2.4s linear infinite;
    opacity: 0;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  10% {
    width: 6.25em;
    height: 6.25em;
  }
  66% {
    width: 2.4em;
    height: 2.4em;
  }
  100% {
    transform: rotate(360deg);
    width: 6.25em;
    height: 6.25em;
  }
}

@keyframes dotsY {
  66% {
    opacity: 0.1;
    width: 2.4em;
  }
  77% {
    opacity: 1;
    width: 0;
  }
}
@keyframes dotsX {
  66% {
    opacity: 0.1;
    height: 2.4em;
  }
  77% {
    opacity: 1;
    height: 0;
  }
}

@keyframes flash {
  33% {
    opacity: 0;
    border-radius: 0%;
  }
  55% {
    opacity: 0.6;
    border-radius: 100%;
  }
  66% {
    opacity: 0;
  }
}
</style>
