<template>
  <div class="contents">
    <div class="wrap">
      <ContentEntry v-if="!market.contents" @on-entry="onEntry"></ContentEntry>

      <div class="contents-wrap" v-else>
        <!--
          :initHF="showHF"
          @on-change-hf="showHF = $event"
        -->
        <Preview
          :abstracts="market.abstracts"
          :contents="market.contents"
          :contentFiles="market.contentFiles"
          :showBottom="true"
          @on-preview="onPreview"
          @on-edit="onEdit(market.type || 0)"
          @on-change-abstracts="onChangeAbstracts"
          @on-delete="onDelete"
          @on-delete-file="onDeleteFile">
        </Preview>
      </div>
    </div>
    <Spin size="large" fix v-if="showSpin"></Spin>
  </div>
</template>

<script>
import ContentEntry from "./comps/editor-entry.vue";
import { mapGetters, mapMutations } from "vuex";
import MarketsServe from "../../../service/marketing/markets.service";
import FileServe from "../../../service/marketing/file.service";
import {COMPLETESTATUTS, OPERATES as operates} from "../../../configs/enums";
import { setTimeout } from 'timers';
import { isEmptyObj } from '../../../utils/tool';
// import tinymce from 'tinymce/tinymce.min';

export default {
  name: "Contents",
  components: {
    ContentEntry
  },
  data() {
    return {
      showSpin: false,
      abstracts: "",
      contents: "",
//      showHF: '0'
    };
  },
  computed: mapGetters(["market", "operate", "stepIndex"]),
  watch: {
    // 监听操作
    operate(newVal) {
      this._todo(newVal);
    },
   /* market: {
      handler(newVal) {
        if (isEmptyObj(newVal)) {
           this.$router.push('/Marketing');
        }
      },
      immediate: true
    }*/
  },
  methods: {
    onEntry(arg = "template") {
      if (arg === "template") {
        this.$router.push("/Marketing/MyTemplates");
      } else {
        const type = arg === "html" ? 0 : 1;
        this.onEdit(type);
      }
    },
    onEdit(type) {
      this.SET_MARKET({ type });
      this.$router.push("/Marketing/Editor");
    },

    // 修改或删除摘要
    onChangeAbstracts(abstracts) {
      this.showSpin = true;
      MarketsServe.changeAbstracts({
        id: this.market.id,
        abstracts
      }).then(res => {
        console.log('res :', res);
        this.SET_MARKET({ abstracts });
        this.showSpin = false;
      });
    },
    onDelete() {
      // console.log('delete :', this.market.id);
      this.showSpin = true;
      MarketsServe.deleteContents(this.market.id).then(() => {
        this.SET_MARKET({
          contents: "",
          abstracts: "",
          contentFiles: []
        });
        this.SET_COMPLETED_STEP(COMPLETESTATUTS.BASE);
        this.showSpin = false;
      }).catch(error => {
        console.error(error);
        this.$Message.error(error.message || 'Detele content failed');
        this.showSpin = false;
      });
    },

    onDeleteFile(id) {
      this.showSpin = true;
      FileServe.deleteFile(id).then(res => {
        const contentFiles = this.market.contentFiles.slice();
        const index = contentFiles.findIndex(item => item.id === id);
        contentFiles.splice(index, 1);
        this.SET_MARKET({ contentFiles });
        this.$Message.success(res.response || 'ok');
        this.showSpin = false;
      });
    },

    onPreview(mode) {
      /*const preview = this.$refs['preview'];
      if (preview && this.showHF === '1') {
        contents = preview.getHF().header + contents + preview.getHF().footer;
      }*/
      this.SET_TEST_PREVIEW({ contents: this.market.contents, contentFiles: this.market.contentFiles || [] });
      this.$router.push({path: '/Marketing/TestPreview', query: { mode }});
    },

    _todo(operate) {
      console.log("operate :", operate);
      switch (operate) {
        case operates.LAST:
          this.SET_STEP_INDEX(0);
          break;
        case operates.NEXT:
          if (this.market.contents) {
            this.SET_STEP_INDEX(2);
          }else {
            this.$Message.error('The content is empty');
          }
          break;
        case operates.SAVETOLIST:
          this.$router.push("/MyMarkets");
          break;
        case operates.SAVETODETAIL:
          this.$router.push("/MarketDetail/" + this.market.id);
          break;
      }
    },

    /* _setMarket(params) {
      MarketsServe.editMarket(params).then(res => {
        if (res.state === 0) {
          console.log("edit abs :", res);
          this.SET_MARKET(params);
        }
        this.showSpin = false;
      });
    }, */
    ...mapMutations(["SET_MARKET", "SET_STEP_INDEX", "SET_OPERATE", "SET_TEST_PREVIEW", "SET_COMPLETED_STEP"])
  },
  created() {
    this.SET_OPERATE(operates.FREE);
    this.SET_TEST_PREVIEW({});
    /*if (this.stepIndex !== 1) {
      this.SET_STEP_INDEX(1);
    }*/
  }

  /*  mounted() {
      // 将dom字符串转json
      var parser = new tinymce.html.DomParser({validate: true});
      /!*
       只保留含有src,href属性的dom
       parser.addAttributeFilter('src,href', function(nodes, name) {
       console.log(nodes);
       console.log(name);
       });*!/
      var rootNode = parser.parse(`<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<em> 对于互联网公司来说，好的产品是公司的核心资产，比如提到腾讯，大家就会想到微信扣扣，这是好产品的魅力。而想要做好一个吸引用户使用的产品，需要的是产品经理与程序员的通力合作。而在工作中，往往产品经理容易与程序员在产品的开发上起矛盾。就有一名程序员对于产品经理把任务完不成的责任甩锅给程序员的做法看不惯了，直接与其争执了起来。就让我们来看看孰对孰错。</em></p>
               <div><img style="max-width: 100%;" src="http://p9.pstatp.com/large/pgc-image/4b42ac89e79a4efdb29ad4752614c0f6" alt="厉害咯，我的程序员怒怼产品经理" /></div>
               <div>&nbsp;</div>
               <div>&nbsp;</div>
               <p><span style="text-decoration: line-through;"><strong>争执的过程如下：</strong></span></p>
               <p>程序员抱怨产品经理提供的产品需求不明确，每次都是做好了之后就要求我们改改改，希望产品经理本人把整个功能，每个细节都在脑海中过一遍，然后在给我们提需求。而产品经理回复到：知道，但是你们程序员这边也要给点力行不，不然拖项目的进度。</p>
               <p>产品经理把项目进度跟不上的锅甩给了程序员，这也彻底引发了程序员的不满。程序员表示：呵呵，我们不给力？笑死。你脑洞开的再大，我们程序员难道没有做出功能吗？你还在领导面前BB我们进度慢？导致我们这个月奖金少了一半。你丫的提的需求不明确，模模糊糊的，问你，你说做吧，然后我们做出来，你又说不行要我们改。老子问你，谁TM拖进度了？</p>
               <p>产品对此也回到：骂人？你带6个程序员，做不出来我一个人说的功能，还在这里怪老子，你们程序员天天加班，做不出东西来，不怪你们怪谁？项目计划表摆在那里的，没出东西你TM怪老子产品？并威胁到已经把聊天截图了，等到公司开会我们来处理这件事。</p>
               <p>程序员小哥表示：呵呵，怕你？老子技术在手，随时可以换工作。</p>
               <div><img style="max-width: 100%;" src="http://p3.pstatp.com/large/pgc-image/9ede314d89ee478bb44f8a697b21f83a" alt="厉害咯，我的程序员怒怼产品经理" />
                 <p>&nbsp;</p>
               </div>
               <p>&nbsp;</p>
               <p>&nbsp;</p>
               <p>对于程序员与产品经理起争执并开骂，不少同行表示：骂的好爽，看着就解气，骂你算是轻的，真的，你以为程序员脾气好就好欺负。有些产品经理其实压根不懂产品，以为画个原型图，东抄西借的就可以了，整个产品的逻辑什么的根本就不懂，也好意思说自己是产品经理。</p>
               <div><img style="max-width: 100%;" src="http://p1.pstatp.com/large/pgc-image/f6113c9771cf49dda89f52f00c046810" alt="厉害咯，我的程序员怒怼产品经理" />
                 <p>&nbsp;</p>
               </div>
               <p>&nbsp;</p>
               <div><img style="max-width: 100%;" src="htp://p3.pstatp.com/large/pgc-image/12b94abe83ee4cef9ca74cd0a76bd4e8" alt="厉害咯，我的程序员怒怼产品经理" />
                 <p>&nbsp;</p>
               </div>
               <p>&nbsp;</p>
               <p>对此各位网友你们有何看p法？孰对孰错？如果是你的话会怎么办，把你的想法留在评论下方，大家一起交流讨论哦！</p>`);
      console.log('domParse', rootNode);
  },*/
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
@import "../../../assets/styles/mixin";
.contents {
  position: relative;
  .wrap {
    .entry-wrap {
      width: 920px;
      margin: 50px auto 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        width: 30%;
        cursor: pointer;
        .card {
          padding: 10px 0 50px;
          h3 {
            font-size: @font-size-lg;
            margin: 20px 0;
          }
          span {
            font-size: @font-size-normal;
          }
        }
      }
    }

    .contents-wrap {
      width: 720px;
      margin: 20px auto 0;
    }
  }
}
</style>
