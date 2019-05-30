<template>
  <Card :class="['item-file', { selected }]" :bordered="false" dis-hover>
    <div class="cover-img">
      <Icon :custom="'i-icon ' + iconType" size="95" v-if="iconType !== 'icon-img'" />
      <img width="117" height="95" :src="file.filePath" v-else>
      <!--<img width="117" height="95" src="https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=d626cde4271f95caa6f595b0f12c1803/91529822720e0cf396e686610846f21fbe09aa13.jpg" v-else>-->
      <span v-if="showTrush" @click="$emit('on-delete')">
        <Icon type="ios-trash" size="25" class="icon" />
      </span>
    </div>
    <span>{{file.fileName}}</span>
  </Card>
</template>

<script>
  const ICONTYPE = {
    image: 'icon-img',
    docs: 'icon-doc',
    txt: 'icon-txt',
    pdf: 'icon-pdf',
    compress: 'icon-yasuo',
    ppt: 'icon-ppt',
    excel: 'icon-xlsx',
    other: 'icon-file'
  };

  /*
  * 未处理
  * gig：音频
  *  dib: 'image',
    tif: 'image',
    bmp: 'image',
    rgb: 'image',
    pcx,bmp,wmf,raw,wps,odt
  * */
  const FILETYPE = {
    docx: 'docs',
    doc: 'docs',
    xls: 'excel',
    xlsx: 'excel',
    pptx: 'ppt',
    ppt: 'ppt',
    txt: 'txt',
    pdf: 'pdf',
    jpg: 'image',
    png: 'image',
    gif: 'image',
    jpeg: 'image',
    jpe: 'image',
    zip: 'compress',
    tar: 'compress',
    gzip: 'compress',
    rar: 'compress'
  };


  export default {
    name: 'FileItem',
    props: {
      file: {
        type: Object,
        default() {
          return {};
        }
      },
      showTrush: {
        type: Boolean,
        required: false
      },
      /*selected: {
        type: Boolean,
        default: false
      }*/
    },
    data() {
      return {
        selected: false
      }
    },
    computed: {
      iconType() {
        const iconType = this.file.suffix ? FILETYPE[this.file.suffix] || 'other' : 'other';
        return ICONTYPE[iconType];
      }
    },
   /* watch: {
      file(newVal) {
        console.log(newVal.type);
      }
    },
    methods: {}*/
  }
</script>

<style lang="less" scoped>
  @import "~assets/styles/variable";
  @import "~assets/styles/mixin";
  .item-file {
    max-width: 130px;
    text-align: center;
    cursor: pointer;
    &.selected{
      color: @font-color-primary;
    }
    .cover-img{
      position: relative;
      &:hover{
        span{
          display: block;
        }
      }
      span{
        position: absolute;
        right: 5px;
        bottom: 6px;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        padding: 1px;
        background-color: @color-black;
        .icon{
          color: @color-white;
        }
      }
    }
    span {
      display: block;
      .no-wrap();
    }
  }
</style>
