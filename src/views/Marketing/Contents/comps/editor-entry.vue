<template>
  <div class="entry-wrap">
    <div class="template" @click="$emit('on-entry')">
      <Card class="card">
        <div style="text-align:center">
          <img src="../../../../assets/images/templte.png" />
          <h3>Template</h3>
          <span>Use a readily available template to send messages quickly.</span>
        </div>
      </Card>
    </div>

    <div class="html-editor" @click="$emit('on-entry', 'html')">
      <Card class="card">
        <div style="text-align:center">
          <img src="../../../../assets/images/html-editor.png" />
          <h3>HTML editor</h3>
          <span>Use the html editor  to creat new contents.</span>
        </div>
      </Card>
    </div>

    <div class="text-editor" @click="$emit('on-entry', 'text')">
      <Card class="card">
        <div style="text-align:center">
          <img src="../../../../assets/images/text-editor.png" />
          <h3>Text editor</h3>
          <span>Use the text editor  to creat new contents.</span>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ContentEntry'
  }
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/variable";
  .entry-wrap{
    width: 920px;
    margin: 50px auto 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div{
      width: 30%;
      cursor: pointer;
      .card{
        padding: 10px 0 50px;
        h3{
          font-size: @font-size-lg;
          margin: 20px 0;
        }
        span{
          font-size: @font-size-normal;
        }
      }
    }
  }
</style>
