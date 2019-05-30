<template>
    <Card class="card" :bordered="false" dis-hover>
        <div class="wrap">
            <img :src="info.img" />
            <div class="des">
                <b>{{info.title}}</b>
                <span>{{info.desc}}</span>
            </div>
            <Button v-btn-style="'blue'" @click="$emit('on-select')">{{info.btnLabel}}</Button>
        </div>
    </Card>
</template>

<script>
  export default {
    name: 'ChooseItem',
    props: {
      info: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style lang="less" scoped>
    .card{
        .wrap{
            text-align: center;
            .des{
                margin: 15px 0;
                b{
                    display: block;
                    margin-bottom: 5px;
                }
            }
        }
    }
</style>