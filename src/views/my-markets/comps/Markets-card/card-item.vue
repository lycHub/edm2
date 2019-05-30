<template>
  <div class="card-item" @mouseleave="showBack = false">
    <div class="front" v-if="!showBack">
      <div class="cover-img" @mouseenter="showBack = true">
        <img :src="item.coverImg" v-if="item.coverImg">
        <div class="no-contents" v-else>
          <Icon class="icon" custom="i-icon icon-youjian" size="50" />
          <span>No content has been created yet</span>
        </div>
      </div>
      <div class="bottom">
        <div class="txt">
          <span class="title">{{item.name}}</span>
          <div class="extras">
            <div class="status">
              <i v-dot="status[item.status] === 'sent' ? 'green' : 'prev'"></i>
              {{status[item.status]}}
            </div>
            <Divider type="vertical"/>
            <span class="time">{{item.createTime | format('MMM/DD/YYYY')}}</span>
          </div>
        </div>
        <!--<Tooltip content="Copy" placement="top" transfer>
          <Icon type="ios-copy" size="22" class="icon copy" />
        </Tooltip>-->
        <More class="more">
          <Icon type="md-more" size="22" class="icon more"/>
          <div slot="items">
            <DropdownItem style="font-size:14px !important;" @click.native="onOperate('copy', item)">Copy</DropdownItem>
            <DropdownItem
              v-show="status[item.status] !== 'deleted' && status[item.status] !== 'sent'"
              style="font-size:14px !important;"
              @click.native="onOperate('edit', item)">
              Edit
            </DropdownItem>
            <DropdownItem
              v-show="status[item.status] !== 'deleted'"
              style="font-size:14px !important;"
              @click.native="onOperate('delete', item)">
              Delete
            </DropdownItem>
          </div>
        </More>
      </div>
    </div>

    <div class="back" v-else>
      <Card class="card">
        <p slot="title">{{item.name}}</p>
        <ul>
          <li>
            <span class="title">Subject</span>
            <span class="info" v-html="emojiParse(item.subject)"></span>
          </li>
          <li>
            <span class="title">Sender</span>
            <span class="info">{{item.senderEmail}}</span>
          </li>
          <li>
            <span class="title">Create at</span>
            <span class="info">{{item.createTime | format}}</span>
          </li>
          <li v-show="status[item.status] === 'sent' || status[item.status] === 'arranged'">
            <span class="title">Sent at</span>
            <span class="info">{{item.time | format}}</span>
          </li>
          <li v-show="status[item.status] === 'deleted'">
            <span class="title">deleted at</span>
            <span class="info">{{item.lastAccess | format}}</span>
          </li>
        </ul>
        <router-link tag="div" :to="{ name: 'MarketDetail', params: { id: item.id }}" class="detail">View detail</router-link>
        <!-- <div class="detail">View detail</div> -->
      </Card>
    </div>
  </div>
</template>

<script>
import { STATUS } from "../../../../configs/enums";
import {setStroge} from "../../../../utils/tool";
export default {
  name: "CardItem",
  props: {
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      showBack: false,
      status: STATUS
    };
  },
  methods: {
    // 编辑或删除
    onOperate(type, item) {
      // console.log(type, id);
      switch (type) {
        case "edit":
          setStroge([{
            key: 'marketingId',
            value: item.id
          }, {
            key: 'marketingName',
            value: item.name
          }, {
            key: 'isEdit',
            value: true
          }]);
          this.$router.push("/Marketing");
          break;
        case "delete":
          this.$Modal.confirm({
            title:
              "Once this email marketing is deleted, it cannot be recovered！Do you want to continue？",
            onOk: () => {
              this.$emit("on-delete", item.id);
            }
          });
          break;
        case "copy":
          this.$router.push('/Copy/' + item.id);
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~assets/styles/variable.less";
@import "~assets/styles/mixin.less";
.card-item {
  position: relative;
  width: 250px;
  height: 350px;
  box-shadow: 0 1px 3px @border-prev;
  border-radius: 5px;
  border: solid 1px @border-box;
  .front {
    height: 100%;
    .cover-img {
      height: 100%;
      overflow: hidden;
      background-color: @color-white;
      /*img {
        width: 190%;
        transform: translate(-23.5%);
      }*/

      .no-contents{
        text-align: center;
        font-size: @font-size-mid;
        .icon{
          display: block;
          // color: @color-green;
          margin: 15px 0;
        }

      }
    }
    .bottom {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px 20px;
      width: 100%;
      bottom: 0;
      background-color: @color-white;
      border-radius: 0 0 5px 5px;
      box-shadow: 0 -2px 3px rgba(100, 100, 100, 0.1);
      border-top: solid 1px @border-card;
      .txt {
        width: 180px;
        font-size: @font-size-normal;
        color: @font-color-dull-prey;
        .no-wrap();
        .extras {
          display: flex;
          margin-top: 10px;
        }
      }
      .more {
        cursor: pointer;
      }
    }
  }

  .back {
    position: relative;
    height: 100%;
    .card {
      height: 100%;
      ul li {
        margin-bottom: 15px;

        span {
          display: block;
          margin-top: 8px;
          .no-wrap();
        }
      }
      .detail {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        background-color: @bg-btn-primary;
        padding: 15px;
        color: @color-white;
        font-size: @font-size-mid;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
