<template>
<div class="tinymce">
  <Button @click="getContent">getContent</Button>
  <Button @click="setContent">setContent</Button>
  <Button @click="save">save</Button>
  <Button @click="uploadImg">uploadImg</Button>
  <Button @click="onFocus" class="my-custom-button">onFocus</Button>
  <Button @click="progressStare">progressStare</Button>
  <Button @click="isDirty">isDirty</Button>
  <Button @click="domParse">domParse</Button>
  <Button @click="SaxParser">SaxParser</Button>
  <Button @click="Serializer">Serializer</Button>
  <Button @click="disabled">disabled</Button>
  <textarea ref="tinymceEditer"></textarea>
  <!--<div id="tinymceEditer"></div>-->
  </div>
  </template>
  <script>
import axios from 'axios'
import tinymce from 'tinymce/tinymce.min';
import 'tinymce/themes/silver/theme.min';
import 'tinymce/skins/ui/oxide-dark/skin.min.css';
/*import 'tinymce/skins/ui/oxide-dark/content.min.css';
 import 'tinymce/skins/ui/oxide-dark/content.inline.min.css';*/
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullpage'
//    import 'tinymce/plugins/powerpaste'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/directionality'
//    import 'tinymce/plugins/advcode'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/template'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/table'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/wordcount'
//    import 'tinymce/plugins/tinymcespellchecker'
//    import 'tinymce/plugins/a11ychecker'
import 'tinymce/plugins/imagetools'
//    import 'tinymce/plugins/mediaembed'
//    import 'tinymce/plugins/linkchecker'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/help'
import 'tinymce/plugins/code'
//  import emoji from '../../assets/images/1f615.png'
export default {
  name: 'TinyMce',
  methods: {
    init () {
      const el = this.$refs['tinymceEditer'];
      tinymce.init({
        target: el,
        height: 500,
        skin: "oxide-dark",
        // 视为编辑器的一部分，即使点击到这里也不会触发blur事件
        custom_ui_selector: '.my-custom-button',
//                    allow_html_in_named_anchor: true,
//                    toolbar: false,
//                    menubar: false,
//                    paste_as_text: true,         黏贴为纯文本
//                    inline: true,
//                    menu: {
//                        view: {title: 'Happy', items: 'code'}
//                    },

        plugins: 'paste code print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',//
//                    menubar: 'file edit view',
        toolbar: 'image paste code currentdate formatselect | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat | undo redo',
        statusbar: false,
        image_advtab: true,
        image_title: false,
        imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
//                    image_dimensions: false
//                    image_caption: true,
//                    image_list: [
//                        {title: 'My image 1', value: 'https://www.tinymce.com/my1.gif'},
//                        {title: 'My image 2', value: 'http://www.moxiecode.com/my2.gif'}
//                    ]
//                    browser_spellcheck: true,
//                    contextmenu: false
        /*file_browser_callback: function(field_name, url, type, win) {
         console.log(field_name);
         console.log(url);
         console.log(type);
         },*/
        automatic_uploads: true,                   // 是否自动上传
        images_upload_url: 'postAcceptor.php',    // 自动上传 服务器上传路径
        images_upload_credentials: true,
        // and here's our custom image picker
        /*  file_picker_callback: function (cb, value, meta) {
         console.log('file_picker_callback');
         var input = document.createElement('input');
         input.setAttribute('type', 'file');
         input.setAttribute('accept', 'image/!*');

         /!*
         Note: In modern browsers input[type="file"] is functional without
         even adding it to the DOM, but that might not be the case in some older
         or quirky browsers like IE, so you might want to add it to the DOM
         just in case, and visually hide it. And do not forget do remove it
         once you do not need it anymore.
         *!/

         input.onchange = function () {
         var file = this.files[0];

         var reader = new FileReader();
         reader.onload = function () {
         /!*
         Note: Now we need to register the blob in TinyMCEs image blob
         registry. In the next release this part hopefully won't be
         necessary, as we are looking to handle it internally.
         *!/
         var id = 'blobid' + (new Date()).getTime();
         var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
         var base64 = reader.result.split(',')[1];
         var blobInfo = blobCache.create(id, file, base64);
         blobCache.add(blobInfo);

         /!* call the callback and populate the Title field with the file name *!/
         cb(blobInfo.blobUri(), { title: file.name });
         };
         reader.readAsDataURL(file);
         };

         input.click();
         },*/

//                    images_upload_base_path: '/some/basepath',
//                    images_upload_credentials: true,
        // 自定义图片上传, 可关闭 automatic_uploads
        /*  images_upload_handler: function (blobInfo, success, failure) {
         setTimeout(function() {
         // no matter what you upload, we will turn it into TinyMCE logo :)
         success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
         }, 2000);
         },*/
        /*images_upload_handler: function (blobInfo, success, failure) {
         var xhr, formData;
         xhr = new XMLHttpRequest();
         xhr.withCredentials = false;
         xhr.open('POST', 'postAcceptor.php');
         xhr.onload = function() {
         var json;
         if (xhr.status != 200) {
         failure('HTTP Error: ' + xhr.status);
         return;
         }
         json = JSON.parse(xhr.responseText);
         if (!json || typeof json.location != 'string') {
         failure('Invalid JSON: ' + xhr.responseText);
         return;
         }
         success(json.location);   // 后台返回的图片链接用于显示到前端{ location : '/uploaded/image/path/image.png' }
         };
         formData = new FormData();
         formData.append('file', blobInfo.blob(), fileName(blobInfo));
         xhr.send(formData);
         }*/
        init_instance_callback: function (editor) {
//                        editor.focus();
          editor.on('click', function (e) {
            console.log('Element clicked:', e.target.nodeName);
          });
        },
        setup(editor) {
          // 添加按钮,第一个参数是按钮名称，需要在toolbar总注册
          editor.ui.registry.addButton('currentdate', {
            text: 'insertdatetime',
//                            icon: 'insertdatetime',
//              image: 'http://p.yusukekamiyamane.com/icons/search/fugue/icons/calendar-blue.png',
            tooltip: "Insert Current Date",
            onAction: function () {
              const date = new Date();
              const html = '<time datetime="' + date.toString() + '">' + date.toDateString() + '</time>';
              editor.insertContent(html);
            },
            onSetup(buttonApi) {    // 按钮渲染完成后触发
              editor.on('NodeChange', e => {
//                                    监听光标变化事件，如果在time标签内就禁用
                buttonApi.setDisabled(e.element.nodeName.toLowerCase() === 'time');
                return function (buttonApi) {
                  editor.off('NodeChange', editorEventCallback);
                };
              });
            }
          });
          // 给tools菜单中增加一项
          editor.ui.registry.addMenuItem('Hello', {
//              text: 'Hello',
            icon: 'image',
            context: 'tools',
            onAction: function() {
              console.log('context menu clicked');
              editor.insertContent('Hello world!!');
            }
          });
          /*editor.addSidebar('example', { 添加侧栏
           tooltip: 'My sidebar',
           text: 'my-side-bar',
           onshow: function(api) {
           console.log(api);
           }
           })*/
        }
      });
    },
    getContent() {
      // HTML
      console.log(tinymce.activeEditor.getContent());
//                tinymce.get('content id').getContent()
//                console.log(tinymce.activeEditor.getContent({format: 'raw'}));
      // Text
//                console.log(tinymce.activeEditor.getContent({format: 'text'}));
    },
    setContent() {

      /*  tinymce.activeEditor.setContent(`
       <p class="ql-align-justify">2019年1月15日，中央纪委国家监委消息，陕西省委原书记赵正永涉嫌严重违纪违法，目前正接受中央纪委国家监委纪律审查和监察调查。</p><div class="pgc-img"><img src="http://p3.pstatp.com/large/pgc-image/eb6b7a161c764232a8c31f4eecff8f3d" alt="十八大后，这8位落马贪官都曾任省级党委书记" data-mce-src="http://p3.pstatp.com/large/pgc-image/eb6b7a161c764232a8c31f4eecff8f3d"><p class="pgc-img-caption"><br></p></div><p class="ql-align-justify">北京青年报记者注意到，随着赵正永的落马，十八大后至少8个在任或原任省级党委书记落马。</p><p class="ql-align-justify">除赵正永外，其他7人是：</p><p class="ql-align-justify">江西省委原书记苏荣（2014年6月落马）、云南省委原书记白恩培（2014年8月落马）、河北省委原书记周本顺（2015年7月落马）、辽宁省委原书记王珉（2016年3月落马）、天津市委原代理书记黄兴国（2016年9月落马）、甘肃省委原书记王三运（2017年7月落马）、重庆市委原书记孙政才（2017年7月落马）。</p><p class="ql-align-justify">不过，这些省级党委书记落马时的身份不同。</p><div class="pgc-img"><img src="http://p1.pstatp.com/large/pgc-image/0ebd150fabcb4545a5c0710305743c64" alt="十八大后，这8位落马贪官都曾任省级党委书记" data-mce-src="http://p1.pstatp.com/large/pgc-image/0ebd150fabcb4545a5c0710305743c64"><p class="pgc-img-caption"><br></p></div><p class="ql-align-justify">苏荣落马时是“中国人民政治协商会议第十二届全国委员会副主席”，白恩培是“十二届全国人大环境与资源保护委员会副主任委员”，王珉是“十二届全国人大教育科学文化卫生委员会副主任委员”，王三运是“十二届全国人大教育科学文化卫生委员会副主任委员”。</p><div class="pgc-img"><img src="http://p1.pstatp.com/large/pgc-image/9edf143ff1b24503a33b8f85bf4e4abe" alt="十八大后，这8位落马贪官都曾任省级党委书记" data-mce-src="http://p1.pstatp.com/large/pgc-image/9edf143ff1b24503a33b8f85bf4e4abe"><p class="pgc-img-caption"><br></p></div><p class="ql-align-justify">周本顺是“河北省委书记、省人大常委会主任”，黄兴国是“天津市委代理书记、市长”。</p>
       `, {format: 'raw'});*/
    },
    save() {
      // 返回保存的内容，isDirty将被设为false
      console.log(tinymce.activeEditor.save());
    },
    uploadImg() {
      tinymce.activeEditor.uploadImages(function(success) {
        console.log('success', tinymce.activeEditor.getContent());
        /*axios.post('ajax/post.php').then(res => {
         console.log(res);
         })*/
      });
    },
    onFocus() {
      tinymce.get('tinymceEditer').focus();
    },
    progressStare() {
//                tinymce.activeEditor.setProgressState(true);
      // 3s后开启loading
      tinymce.activeEditor.setProgressState(true, 3000);
      // 3s后关闭loading
      tinymce.activeEditor.setProgressState(false, 3000);
    },
    isDirty() {
      // 是否未保存
      console.log(tinymce.activeEditor.isDirty());
    },
    domParse() {
      // 将dom字符串转json
      var parser = new tinymce.html.DomParser({validate: true});
      /*
       只保留含有src,href属性的dom
       parser.addAttributeFilter('src,href', function(nodes, name) {
       console.log(nodes);
       console.log(name);
       });*/
      var rootNode = parser.parse(`
                   <div class="pgc-img"><img src="http://p1.pstatp.com/large/pgc-image/0ebd150fabcb4545a5c0710305743c64" alt="十八大后，这8位落马贪官都曾任省级党委书记" />
<p class="pgc-img-caption">&nbsp;</p>
</div>
<p class="ql-align-justify">苏荣落马时是&ldquo;中国人民政治协商会议第十二届全国委员会副主席&rdquo;，白恩培是&ldquo;十二届全国人大环境与资源保护委员会副主任委员&rdquo;，王珉是&ldquo;十二届全国人大教育科学文化卫生委员会副主任委员&rdquo;，王三运是&ldquo;十二届全国人大教育科学文化卫生委员会副主任委员&rdquo;。</p>
<div class="pgc-img"><img src="http://p1.pstatp.com/large/pgc-image/9edf143ff1b24503a33b8f85bf4e4abe" alt="十八大后，这8位落马贪官都曾任省级党委书记" />
<p class="pgc-img-caption">&nbsp;</p>
</div>
<p class="ql-align-justify">周本顺是&ldquo;河北省委书记、省人大常委会主任&rdquo;，黄兴国是&ldquo;天津市委代理书记、市长&rdquo;。</p>
                `);
      console.log(rootNode);
      return rootNode;
    },
    SaxParser() {
      var saxParser = new tinymce.html.SaxParser({
        validate: true,
        comment: function(text) {
          console.log('Comment:', text);
        },
        cdata: function(text) {
          console.log('CDATA:', text);
        },
        text: function(text, raw) {
          console.log('Text:', text, 'Raw:', raw);
        },
        start: function(name, attrs, empty) {
          console.log('Start:', name, attrs, empty);
        },
        end: function(name) {
          console.log('End:', name);
        },
        pi: function(name, text) {
          console.log('PI:', name, text);
        },
        doctype: function(text) {
          console.log('DocType:', text);
        }
      });
      var rootNode = saxParser.parse(`
                    tiny.vue?47c5:208 <div class="pgc-img"><img src="http://p1.pstatp.com/large/pgc-image/0ebd150fabcb4545a5c0710305743c64" alt="十八大后，这8位落马贪官都曾任省级党委书记" />
<p class="pgc-img-caption">&nbsp;</p>
</div>
<p class="ql-align-justify">苏荣落马时是&ldquo;中国人民政治协商会议第十二届全国委员会副主席&rdquo;，白恩培是&ldquo;十二届全国人大环境与资源保护委员会副主任委员&rdquo;，王珉是&ldquo;十二届全国人大教育科学文化卫生委员会副主任委员&rdquo;，王三运是&ldquo;十二届全国人大教育科学文化卫生委员会副主任委员&rdquo;。</p>
<div class="pgc-img"><img src="http://p1.pstatp.com/large/pgc-image/9edf143ff1b24503a33b8f85bf4e4abe" alt="十八大后，这8位落马贪官都曾任省级党委书记" />
<p class="pgc-img-caption">&nbsp;</p>
</div>
<p class="ql-align-justify">周本顺是&ldquo;河北省委书记、省人大常委会主任&rdquo;，黄兴国是&ldquo;天津市委代理书记、市长&rdquo;。</p>
                `);
      console.log('saxParser', rootNode);
    },
    Serializer() {
      const ser = new tinymce.html.Serializer();
      console.log(ser.serialize(this.domParse()));
    },
    disabled() {
      tinymce.activeEditor.setMode('readonly');
    }
  },
  mounted () {
    this.init();
    /*
     添加自定义按钮，和setup中的一样
     tinymce.get('tinymceEditer').addButton('strikeout', {
     icon: 'strikethrough',
     onclick: function() {
     tinymce.get('tinymceEditer').execCommand('mceToggleFormat', false, 'strikethrough');
     }
     });*/
  },
  destroyed () {
    tinymce.remove('tinymceEditer');
//            tinymce.get('tinymceEditer').destroy();
  }
}
</script>
