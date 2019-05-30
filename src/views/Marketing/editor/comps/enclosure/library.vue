<template>
  <div class="library">
    <div class="split-left">
      <div class="title">
        <!--<Icon type="md-folder" class="icon"/>-->
        Your Folder
      </div>
      <div class="folders">
        <div :class="['item-folder', {
          active: activeCategoryId === item.id,
          disabled: (libType === 'all' && item.countFile <= 0) || (libType === 'image' && item.countImg <= 0)
        }]" v-for="item in categories" :key="item.id" @click="onChangeCategory(item)">
          <Icon type="md-folder" class="icon" />
          <span>{{item.name}}</span>
          <span v-if="libType === 'all'">({{item.countFile}})</span>
          <span v-else>({{item.countImg}})</span>
        </div>
      </div>
    </div>
    <div class="split-right">
      <div class="wrap">
        <div class="files">
          <Row type="flex">
            <i-Col span="4" v-for="item in fileList" :key="item.id">
              <FileItem :ref="libType + 'libraryFiles'" :file="item" @click.native="selectLibraryFile(item)"></FileItem>
            </i-Col>
            <!--<FileItem ref="libraryFiles" v-for="item in fileList" :key="item.id" :file="item" @click.native="selectLibraryFile(item)"></FileItem>-->
          </Row>
        </div>
      </div>
    </div>
    <Spin fix v-if="showSpin"></Spin>
  </div>
</template>

<script>
  import FileItem from "./file-item";
  import {oneOf} from "iview/src/utils/assist";

  export default {
    name: 'Library',
    components: { FileItem },
    props: {
      activeCategoryId: {
        type: Number,
        default: 0
      },
      fileList: {
        type: Array,
        default: []
      },
      categories: {
        type: Array,
        default: []
      },
      showSpin: {
        tupe: Boolean,
        default: false
      },
      libType: {
        type: String,
        validator (value) {
          return oneOf(value, ['all', 'image']);
        },
        default: 'all'
      }
    },
    data() {
      return {
        // library选中的文件
        selectedLibraryFiles: []
      }
    },

    watch: {
      selectedLibraryFiles(newVal) {
        console.log('watch selectedLibraryFiles', newVal);
        this.$emit('library-files', newVal);
      },
     /* libraryFileItems(newVal) {
        console.log('watch', newVal);
      }*/
    },

    methods: {
      // 点击分类
      onChangeCategory(item) {
        const count = this.libType === 'all' ? item.countFile : item.countImg;
        if (count > 0) {
          this.$emit('on-change-categoryId', item.id);
        }
      },

      selectLibraryFile(file) {
//      console.log('file', file);
        const libraryFileItems = this.$refs[this.libType + 'libraryFiles'];
//        console.log('libraryFileItems', this.libraryFileItems);
        const target = libraryFileItems.find(item => item.file.id === file.id);
        if (target.selected) {
          target.selected = false;
          const index = this.selectedLibraryFiles.findIndex(item => item.id === target.file.id);
          this.selectedLibraryFiles.splice(index, 1);
        }else {
          target.selected = true;
          this.selectedLibraryFiles.push(file);
        }
      }
    },

    mounted() {
      // 外部点击ok或cancel后重置状态
      this.$on('reset', () => {
//        console.log('reset', this.$refs[this.libType + 'libraryFiles']);
        this.selectedLibraryFiles = [];
        this.$emit('library-files', []);
        this.$refs[this.libType + 'libraryFiles'].map(item => item.selected = false);
      });
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/styles/variable";
  @import "~assets/styles/mixin";
  .library {
    position: relative;
    display: flex;
    justify-content: space-between;
    .split-left {
      width: 24%;
      min-width: 188px;
      height: 400px;
      overflow: auto;
      padding: 10px 0;
      border-right: 1px solid @border-prev;
      .title {
        font-size: @font-size-lg;
        padding-bottom: 10px;
        border-bottom: 1px solid @border-prev;
        .no-wrap();
        .icon {
          font-size: 28px;
          color: @font-color-blue;
        }
      }
      .folders {
        font-size: @font-size-normal;
        cursor: pointer;
        .no-wrap();
        .item-folder {
          padding: 10px 0;
          border-bottom: 1px solid @border-prev;
          &.active {
            color: @font-color-primary;
          }
          &:last-child{
            border-bottom: none;
          }
          .icon {
            font-size: 26px;
            color: @font-color-blue;
          }
          span{
            display: inline-block;
            max-width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: top;
            margin-left: 5px;
          }

          &.disabled{
            color: @font-color-prey;
            cursor: not-allowed;
            .icon{
              color: @font-color-prey;
            }
          }
        }
      }
    }
    .split-right {
      width: 80%;
      .wrap {
        .files {
          /*display: flex;
          flex-wrap: wrap;*/
          height: 400px;
          overflow: auto;
        }
      }
    }
  }
</style>
