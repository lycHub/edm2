<template>
  <div class="market-content">
    <Card disHover :bordered="false" v-if="!market.contents" class="no-content">
        <div style="text-align:center">
          <img src="../../../assets/images/no-content.png" />
          <b>You have not added anything yet！</b>
          <Button class="btn-green" size="large" v-btn-style="'green'" @click="onAddContents">Add contents</Button>
        </div>
      </Card>
    <TestMailPreview
      :abstracts="market.abstracts"
      :contents="market.contents"
      :contentFiles="market.contentFiles"
      :delFile="false"
      @on-change-abstracts="$emit('on-change-abstracts', $event)" v-else></TestMailPreview>
  </div>
</template>

<script>
  import {setStroge} from "../../../utils/tool";

  export default {
    name: 'MarketContent',
    props: {
      market: {
        type: Object,
        default: {}
      }
    },
    methods: {
      onAddContents() {
        setStroge([{
          key: 'marketingId',
          value: this.market.id
        }, {
          key: 'marketingName',
          value: this.market.name
        }]);
        this.$router.push("/Marketing/Contents");
      }
    }
  }
</script>

<style lang="less" scoped>
  .market-content{
    .no-content{
      b{
        display: block;
        margin: 15px 0;
      }
    }
  }
</style>
