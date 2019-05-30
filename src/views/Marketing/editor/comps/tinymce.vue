<template>
  <div class="tinymce">
    <textarea ref="tinymceEditer"></textarea>
  </div>
</template>
<script>
import axios from "axios";
import tinymce from "tinymce/tinymce.min";
import "tinymce/themes/silver/theme.min";
import "tinymce/skins/ui/oxide-dark/skin.min.css";
import 'tinymce/skins/ui/oxide-dark/content.min.css';
import 'tinymce/skins/ui/oxide-dark/content.inline.min.css';
import "tinymce/plugins/preview";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/media";
import "tinymce/plugins/template";
import "tinymce/plugins/table";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";
import "tinymce/plugins/code";
import 'tinymce/plugins/paste';
import './library.plugin';
import FileServe from "../../../../service/marketing/file.service";

export default {
  name: "TinyMce",
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  computed: {
    initConfig() {
      return this.type === 0 ?
      { toolbar: "fontsizeselect | table code media image library | bold italic strikethrough underline subscript superscript | forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link removeformat | customLineButton | undo redo" } :
      {
        menubar: false,
        toolbar: false,
        paste_as_text: true
      }
    }
  },
  methods: {
    getContent() {
      return this.activeEditor.getContent();
    },
    setContent(contents) {
      this.activeEditor.setContent(contents, { format: "raw" });
    },
    init() {
      const el = this.$refs["tinymceEditer"];
      tinymce.init({
        target: el,
        min_height: 800,
        // skin: "oxide-dark",
        // skin_url: '/css/mytinymceskin',
        ...this.initConfig,
        // menubar: false,
        // toolbar: false,
        // paste_as_text: true,
        // toolbar: "fontsizeselect | table code image media | bold italic strikethrough underline subscript superscript | forecolor backcolor | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | link removeformat | customLineButton | undo redo | template",
        plugins: "library link advlist lists table code image media preview template paste",
        librarySelectorCallback: editor => {
          this.$emit('open-library', editor);
//          editor.insertContent('<img alt="Madao" height="42" width="42" src="https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=d626cde4271f95caa6f595b0f12c1803/91529822720e0cf396e686610846f21fbe09aa13.jpg"/>');
//         editor.execCommand('mceInsertContent', false, '<img alt="Madao" height="42" width="42" src="https://gss1.bdstatic.com/9vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=d626cde4271f95caa6f595b0f12c1803/91529822720e0cf396e686610846f21fbe09aa13.jpg"/>')
        },
        browser_spellcheck: true,
        image_advtab: true,
        image_title: true,
        // imagetools_cors_hosts: ['mydomain.com', 'otherdomain.com'],
        automatic_uploads: false, // 是否自动上传
        images_upload_url: "http://mgt.mysteelcms.com/edm/contentfile/upLoadFile", // 自动上传 服务器上传路径
        images_upload_credentials: true,
        images_upload_handler: function (blobInfo, success, failure) {
          const formData = new FormData();
          formData.append('file', blobInfo.blob());
          FileServe.uploadFiles(formData).then(response => {
            // console.log('response :', response.filePath);
            success(response.filePath);
          }).catch(err => {
            failure('err' + err);
          });
         },
        /*
        触发： toolbar里加入 template
        templates: [
          {
            title: "Contact email address",
            description: "联系人邮箱地址",
            content: "$[EMAIL]$"
          },
          {
            title: "Contact name",
            description: "联系人名字",
            content: "$[FNAME|Customer|Guest]$"
          },
          {
            title: "Contact surname",
            description: "联系人姓",
            content: "$[LNAME|Customer|Guest]$"
          }
        ], */
        style_formats: [
          {
            title: "Quote",
            block: "blockquote",
            styles: {
              border: "1px solid rgb(204, 204, 204)",
              padding: "7px",
              "background-color": "rgb(245, 245, 245)",
              color: "#333"
            }
          }
        ],
        setup(editor) {
          editor.ui.registry.addButton("customLineButton", {
            text: "Line",
            tooltip: "Insert a line",
            onAction() {
              editor.insertContent("<hr />");
            }
          });
        }
        /* init_instance_callback: editor => {
          editor.on("keyup", evt => {
            this.$emit('on-change', evt.target.innerHTML);
          });
        } */
      });
      this.activeEditor = tinymce.activeEditor;
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.activeEditor.destroy();
    //      tinymce.remove('textarea');
    //      tinymce.get('tinymceEditer').destroy();
  }
};
</script>
