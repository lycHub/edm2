<template>
  <Card class="sended" dis-hover :bordered="false">
    <div class="wrap_logo">
      <Icon type="ios-send" class="icon" />
      <p>Your test email has been sent</p>
    </div>
    <div class="wrap">
      <span>The email has been sent to：</span>
      <div class="emails">
        <CellGroup class="group">
          <Cell :title="item" v-for="item in list" :key="item" />
        </CellGroup>
        <p>Note：If the sender of this test message shares the same domain as the recipient, your message may be in the spam folder.</p>
      </div>
      <div class="btns">
        <Button type="text" class="btn" @click="$emit('on-action')">Send more test emails</Button>
        <Button type="text" class="btn" @click="$emit('on-action', 'history')">View historical information</Button>
      </div>
    </div>
  </Card>
</template>

<script>
import EmailServe from '../../../service/marketing/email.service'
export default {
  name: "TestMailSended",
  props: {
    list: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../assets/styles/variable";
.sended {
  .wrap_logo{
    text-align: center;
    padding: 30px 0;
    .icon{
      font-size: 70px;
      color: @font-color-primary;
    }
    p{
      font-size: @font-size-normal;
      color: @font-color-primary;
    }
  }
  .wrap{
    .emails{
      margin: 12px 0;
      .group{
        margin: 15px 0;
      }
    }
    .btns{
      text-align: center;
      .btn{
        color: @font-color-primary;
        font-size: @font-size-normal;
      }
    }
  }
}
</style>
