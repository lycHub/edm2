<template>
  <div class="templates">
    <div class="assortment">
      <Select class="select" size="large" v-model="templateParams.templateCategoryId">
        <Option v-for="item in categories" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <EdFilter
      class="filter-status"
      :visible="showSearchFilter"
      @on-ok="onSearch"
      @on-visible-change="showSearchFilter = $event">
        <Button size="large" slot="handle">
          <Icon type="ios-search-outline" size="18" />
        </Button>
        <i-Input placeholder="Searching" v-model.trim="templateParams.name" @on-keyup.enter="onSearch" />
      </EdFilter>
    </div>
    <div class="list-wrap">
      <AllTemplates v-if="showAll" :templates="templates"></AllTemplates>
      <SpecialTemplates v-else :templates="specialTemplates"></SpecialTemplates>
      <span v-show="!showAll && !specialTemplates.length">No result</span>
    </div>
    <Spin size="large" fix v-if="showSpin"></Spin>

    <!-- 预览弹窗 -->
    <Modal :mask-closable="false" v-model="showModal" class="modal">
      <div class="content-wrap" style="margin-top:25px;">
        <Preview :contents="templateInfo.contents" :showAbstracts="false"></Preview>
      </div>
      <div class="footer" slot="footer" style="text-align:center;">
        <Button size="large" v-btn-style="'green'" @click="onSelect(templateInfo.id)">select this template</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import AllTemplates from "./comps/templates-all.vue";
import SpecialTemplates from "./comps/templates-special.vue";
import TemplateServe from "../../../service/marketing/template.service";
import MarketsServe from "../../../service/marketing/markets.service";
import axios from "axios";
// import Emitter from "iview/src/mixins/emitter";
import { mapGetters, mapMutations } from "vuex";
import { OPERATES as operates } from "../../../configs/enums";
import { close } from 'fs';

export default {
  name: "MyTemplates",
  components: {
    AllTemplates,
    SpecialTemplates
  },
  data() {
    return {
      showSpin: false,
      showModal: false,
      showSearchFilter: false,
      categories: [],

      // 是否显示全部
      showAll: true,

      // 获取模板的请求参数
      templateParams: {
        name: '',
        templateCategoryId: 0
      },

      templates: [],
      specialTemplates: [],
      templateInfo: {}
    };
  },
  computed: mapGetters(["market", "stepIndex", "operate"]),
  watch: {
    'templateParams.templateCategoryId'(newVal) {
      if (!newVal && newVal !== 0) return;
      if (newVal === 0) {
        this.showAll = true;
        this.specialTemplates = [];
      }else {
        this.showAll = false;
        this.specialTemplates = this.templates.find(item => item.categoryId === newVal).children;
      }
//      this.specialTemplates = newVal === 0 ? [] : this.templates.find(item => item.categoryId === newVal).children;
    },
    operate(newVal) {
      this._todo(newVal);
    }
    /*specialTemplates(newVal) {
      console.log('specialTemplates', newVal);
    }*/
  },
  methods: {
    onSelect(id) {
      this.SET_MARKET({ type: 0 });
      this.$router.push({ path: '/Marketing/Editor', query: { templateId: id }});
    },
    onSearch() {
      this.showSpin = true;
      this.showAll = false;
//      this.templateParams.templateCategoryId = 0;
      this.templateParams.templateCategoryId = null;
      this._getTemplates();
      this.showSearchFilter = false;
//      this.showSpin = false;
    },
    _getCategories() {
      return TemplateServe.getTemplateCategories();
      /* TemplateServe.getTemplateCategories().then(res => {
          if (res.state === 0) {
            this.categories = res.list;
          }
        }) */
    },
    _getTemplates(first = false) {
      const params = {
        templateCategoryId: 0,
        name: this.templateParams.name
      }
      if (first) {
        return TemplateServe.getTemplates(params);
      } else {
        TemplateServe.getTemplates(params).then(res => {
//           console.log("templates", res);
            if (params.name) {
              console.log('name');
              this.specialTemplates = res.list;
              this.templateParams.name = '';
            }else{
              console.log('no name');
              this.specialTemplates = [];
              this.templates = this._normalizeList(this.categories, res.list);
            }
          this.showSpin = false;
        });
      }
    },

     _getTemplateInfo(id, cb) {
      TemplateServe.getTemplateInfo(id).then(res => {
//        console.log('_getTemplateInfo :', res);
        this.templateInfo = res;
        if (cb) cb();
      });
    },

    _editTemplateName(arg, child) {
       this.showSpin = true;
      TemplateServe.editTemplate({
        id: arg.id,
        name: arg.name
      }).then(res => {
        child.$emit('on-edited', true);
        // this.broadcast("TemplateItem", "on-edited", arg.name);
        this.templateParams = {
          name: '',
          templateCategoryId: 0
        },
        this._getTemplates();
        this.$Message.success(res.message);
      });
    },

    _initData() {
      axios.all([this._getCategories(), this._getTemplates(true)]).then(
        axios.spread((categories, templates) => {
//          console.log('templates', templates);
          categories.list.unshift({
            id: 0,
            name: 'All categories'
          });
          this.categories = categories.list;
          this.templates = this._normalizeList(this.categories, templates.list);
//         console.log('templates :', this.templates);

          this.showSpin = false;
        })
      );
    },
    _normalizeList(categories, templates) {
      const result = [];
      categories.forEach(cat => {
        if (cat.id !== 0) {
          result.push({
            categoryId: cat.id,
            category: cat.name,
            children: templates.filter(tem => tem.templateCategoryId === cat.id)
          });
        }
      });
      return result;
    },
    _todo(operate) {
      console.log("operate :", operate);
//      const id = localStorage.getItem("marketingId");

      switch (operate) {
        case operates.LAST:
          this.$router.push('/Marketing/Contents');
          break;
        case operates.SAVETOLIST:
          this.$router.push("/MyMarkets");
          break;
        case operates.SAVETODETAIL:
          this.$router.push("/MarketDetail/" + this.market.id);
          break;
      }
    },
    ...mapMutations(["SET_MARKET", "SET_STEP_INDEX", "SET_OPERATE"])
  },
  created() {
    this.showSpin = true;
    this.SET_OPERATE(operates.FREE);
//    console.log('stepIndex', this.stepIndex);
    if (this.stepIndex !== 1) {
      this.SET_STEP_INDEX(1);
    }
    this._initData();
  },
  mounted() {
    // 回车修改模板名称
    this.$on("on-edited", args => {
      this._editTemplateName({
        id: args.id,
        name: args.name
      }, args.child);
    });

    // 放大预览
    this.$on("on-preview", id => {
      this._getTemplateInfo(id, () => {
        this.showModal = true;
      });
    });

    // 选中模板
    this.$on("on-selected", id => {
      this.onSelect(id);
    });
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
.templates {
  position: relative;
  min-height: 300px;
  .assortment {
    display: flex;
    justify-content: flex-end;
    padding: 15px 20px;
    background-color: @bg-shallow-blue;
    .select {
      text-align: left;
      width: 200px;
      margin-right: 15px;
    }
  }
  .list-wrap {
    padding: 20px;
    span{
      font-size: @font-size-mid;
    }
  }
}
</style>
