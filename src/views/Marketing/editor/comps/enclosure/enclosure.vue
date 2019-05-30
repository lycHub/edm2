<template>
  <div class="enclosure">
    <div class="toggle">
      <!-- @click="isLocal = !isLocal" -->
      <Button v-btn-style="'green'" class="btn" @click="isLocal = !isLocal">
        <span v-if="isLocal">Upload from library</span>
        <span v-else>Upload from your computer</span>
      </Button>
    </div>

    <template v-if="!isLocal">
      <slot></slot>
    </template>


    <div class="local-up" v-else>
      <!--
        :before-upload="handleUpload"
      -->
      <Upload
        multiple
        type="drag"
        :show-upload-list="false"
        :before-upload="handleUpload"
        action="/contentfile/upLoadFile">
        <div class="container">
          <Icon type="ios-cloud-upload" size="52"></Icon>
          <p>Click or drag files here to upload</p>
        </div>
      </Upload>
      <Progress class="progress" :percent="currentPer" hide-info v-show="currentPer >= 0 && currentPer <= 100" />
      <div class="list">
        <FileItem
          v-for="(item, index) in allFiles"
          :key="index"
          :file="item"
          @on-delete="$emit('on-delete', index)"
          showTrush>
        </FileItem>
      </div>
    </div>
  </div>
</template>

<script>
import FileItem from "./file-item";
import FileServe from "../../../../../service/marketing/file.service";


const validFileType = ['jpg', 'bmp', 'gig', 'png', 'tif', 'rgb', 'dib', 'eps', 'jpe', 'pcx', 'bmp', 'gif', 'jpeg', 'wmf', 'raw', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'pdf', 'wps', 'odt', 'txt', 'rar', 'zip', 'tar', 'gzip'];


export default {
  name: "Enclosure",
  components: {
    FileItem
  },
  model: {
    prop: 'files',
    event: 'on-file-change'
  },
  props: {
    files: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLocal: false,

      // 本地选中的文件
      selectedFiles: [],

      // 已上传的文件
      uploadedFiles: [],

      // 新增的文件
      newUploadFiles: [],

      // 已上传成功第几个
      loadingIndex: 0,

      upLoadComplete: true,

      // 是否能上传
      canUpLoad: true,

      interval: null
    };
  },

  computed: {
    currentPer() {
      return Math.floor((this.loadingIndex / this.selectedFiles.length) * 100);
    },
    allFiles() {
      return this.uploadedFiles.concat(this.newUploadFiles);
    }
  },

  watch: {
   /* canUpLoad(newVal) {
      console.log('canUpLoad', newVal);
    },*/
    selectedFiles(newVal) {
//       console.log('selectedFiles :', newVal);
      // this.loadingIndex = 0;
      if (newVal.length) {
        this.upLoadComplete = false;
        this._upload(newVal);
      }
    },
    files(newVal) {
      this.uploadedFiles = newVal;
    },

    /*uploadedFiles(newVal) {
      // console.log('uploadedFiles :', newVal);
      this.$emit('on-file-change', newVal);
    },*/

    /*currentPer(newVal) {
      console.log('currentPer :', newVal);
    },*/
    /*loadingIndex(newVal) {
      console.log('loadingIndex :', newVal);
    },*/
    upLoadComplete(newVal) {
//      console.log('upLoadComplete :', newVal);
      if (newVal) {
        this.$emit('on-upload-completed');
      }
    }
  },


  methods: {
    handleUpload(file) {
      const errosMsg = this._validFile(file);
      if (!errosMsg) {
        this.selectedFiles.push(file);
      }else {
        this.$Modal.error({
          title: errosMsg,
          width: 500
        });
      }
      return false;
    },

    // 验证文件
    _validFile({ name, size }) {
      const type = name.split('.').pop();
      let errorMsg = null;
      if (Math.ceil(size / 1024) > 20480) { // 不超过20M
        errorMsg = `The size of ${name} has exceeded 20M`;
      }else if (!validFileType.includes(type)) {
        errorMsg = `The type of ${name} is not support`;
      }
      return errorMsg;
    },

    _upload(files) {
      const len = files.length;
//      console.log('len :', len);
      this._uploadApi(files[0]);
      if (len > 0) {
        let i = 1;
        this.interval = setInterval(() => {
          if (i >= len) {
            this.reset();
            return;
          }else {
            this._uploadApi(files[i++]);
          }
        }, 1500);
      }
    },

    reset() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.selectedFiles = [];
      this.loadingIndex = 0;
      this.upLoadComplete = true;
      this.canUpLoad = true;
//      this.newUploadFiles = [];
    },

    _uploadApi(file) {
      if (!this.canUpLoad) return;
      this.canUpLoad = false;
      const formData = new FormData();
      formData.append('file', file);
      FileServe.uploadFiles(formData).then(response => {
        this.newUploadFiles.push(response);
        this.loadingIndex++;
        this.canUpLoad = true;
      });
     /* request.post('/contentfile/upLoadFile', formData, {
        onUploadProgress: e => {
          const percent = e.loaded / e.total * 100;
          // console.log('percent :', percent);
          /!* if (percent >= 100) {
            this.loadingIndex++;
          } *!/
        },
      }).then(res => {
        const { data } = res;
        if (data.status === "200") {
//          this.uploadedFiles.push(data.response);
          this.newUploadFiles.push(data.response);
           this.loadingIndex++;
        }
      });*/
    }
  }
};
</script>

<style lang="less" scoped>
@import "~assets/styles/variable";
@import "~assets/styles/mixin";
.enclosure {
  .toggle{
    margin-bottom: 15px;
    text-align: right;
  }


  .local-up{
    .container{
      padding: 45px 0;
      p{
        font-size: @font-size-normal;
      }
    }
    .progress{
      margin-top: 15px;
      text-align: center;
    }
    .list{
      display: flex;
      flex-wrap: wrap;
      height: 150px;
      overflow: auto;
      margin-top: 15px;
    }
  }
}
</style>
