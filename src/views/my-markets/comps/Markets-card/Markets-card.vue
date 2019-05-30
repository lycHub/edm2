<template>
  <div class="markets-card" ref="listWrap">
    <EdScroll :data="markets" :maxHeight="maxHeight" ref="scroll" @on-pull-up="onPullUp">
      <div>
        <div class="sec" v-for="(market, index) in markets" :key="index">
          <div class="month">
            <span>{{market.time}}</span>
            <Tooltip content="View report" placement="top" class="tool">
              <Icon type="md-stats" size="24" class="icon" />
            </Tooltip>
          </div>
          <div class="cards-wrap">
            <card-item class="item" v-for="item in market.list" :key="item.id" :item="item" @on-delete="$emit('on-delete', $event)"></card-item>
          </div>
        </div>
      </div>
    </EdScroll>
  </div>
</template>

<script>
import CardItem from "./card-item.vue";
import Resize from '../../resize.mix';
import { toDate } from "../../../../utils/tool";
import { format, isThisMonth } from 'date-fns';
export default {
  name: "MarketsCard",
  mixins: [Resize],
  components: {
    CardItem
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      markets: [],
      count: 0,
      totalPage: 0
    };
  },
  watch: {
    list: {
      handler(newVal) {
        this.markets = this._initialize(newVal);
      },
      immediate: true
    },
    /* markets(newVal) {
      console.log('markets :', newVal);
    } */
  },
  methods: {
    onPullUp() {
      this.$emit('on-pull-up');
    },

    // 组装数据
    _initialize(list) {
      const times = [];
      const result = [];
      const copyList = list.slice();
      copyList.forEach(item => {
        const date = toDate(item.time || item.createTime);
        item.timeFormat = isThisMonth(date) ? 'This Month' : format(toDate(date), 'MMM YYYY');
        if (times.indexOf(item.timeFormat) === -1) {
          times.push(item.timeFormat);
        }
      });
      times.forEach(time => {
        result.push({
          time,
          list: copyList.filter(item => item.timeFormat === time)
        });
      });
      return result;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~assets/styles/variable.less";
.markets-card {
  position: relative;
  background-color: @bg-shallow-blue;
  padding-top: 15px;
  .sec {
    margin-bottom: 35px;
    .month {
      padding-left: 20px;
      > span {
        font-size: @font-size-mid;
        vertical-align: sub;
      }
      .tool {
        margin-left: 8px;
        cursor: pointer;
      }
    }
    .cards-wrap {
      display: flex;
      flex-wrap: wrap;
      .item {
        margin: 35px 0 0 35px;
      }
    }
  }
}
</style>
