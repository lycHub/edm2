<template>
  <div class="choose-time">
    <div class="back" @click="hasSelectArrange = false" :style="{visibility: hasSelectArrange ? 'visible' : 'hidden'}">
      <Button type="text" size="large"><Icon type="ios-arrow-back" size="18" class="icon" />Back</Button>
    </div>
    <div class="methods-wrap" ref="methodWrap">
      <ChooseMethods :methods="methods" class="method" :style="{visibility: hasSelectArrange ? 'hidden' : 'visible'}" @on-select="onSelect"></ChooseMethods>
      <ChooseMethods :methods="arranges" class="method" :style="{visibility: hasSelectArrange ? 'visible' : 'hidden'}" @on-select="onSelect"></ChooseMethods>
    </div>
  </div>
</template>

<script>
  import ChooseMethods from './choose-methods.vue'
  import img_send_now from '../../../../../assets/images/icon22.png'
  import img_arrange_marketing from '../../../../../assets/images/icon23.png'
  import img_send_batches from '../../../../../assets/images/icon24.png'
  import img_fixed_time from '../../../../../assets/images/icon25.png'
  import img_recipients_time from '../../../../../assets/images/icon26.png'
  import img_best_time from '../../../../../assets/images/icon27.png'
  import { STRAREGY } from '../../../../../configs/enums';

  export default {
    name: 'ChooseTime',
    components: {
      ChooseMethods
    },
    data() {
      return {
        methods: [{
          id: 0,
          img: img_send_now,
          title: 'Send at now',
          desc: 'Start your marketing now',
          btnLabel: 'Send'
        }, {
          id: 5,
          img: img_arrange_marketing,
          title: 'Arrange marketing',
          desc: 'Arrange the marketing plan in your preferred way',
          btnLabel: 'Arrange'
        }],

        arranges: [{
          id: 1,
          img: img_fixed_time,
          title: 'Fixed time and timezone',
          desc: 'Your marketing campaign will be enabled on the specified date and time.',
          btnLabel: 'Set time & timezone'
        }, {
          id: 2,
          img: img_recipients_time,
          title: "Recipients' time zone",
          desc: 'Your marketing promotion will be enabled according to the recipients\' timezone.',
          btnLabel: 'Set date & time'
        }, {
          id: 3,
          img: img_best_time,
          title: 'Best opening time for recipients',
          desc: 'Your marketing campaign will be launched within 24 hours when the recipient is most likely to open it.',
          btnLabel: 'Set different date & time'
        }],
        hasSelectArrange: false
      }
    },
    watch: {
      hasSelectArrange(newVal) {
        const dis = newVal ? '-100%' : 0;
        this.$refs['methodWrap'].style.transform = `translateX(${dis})`;
      }
    },

    methods: {
      onSelect(id) {
        let strategy = null;
        if (this.hasSelectArrange) {
          strategy = this.arranges.find(item => item.id === id);
        }else {
          if (STRAREGY[id] === 'Arrange marketing') {
            this.hasSelectArrange = true;
            strategy = null;
          }else {
            strategy = this.methods.find(item => item.id === id);
          }
        }
        if (strategy) {
          this.$emit('on-strategy', strategy);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
    .choose-time{
        padding: 15px 0;
        .back{
            &.hide{
                visibility: hidden;
            }
            .icon{
                vertical-align: sub;
            }
        }
        .methods-wrap{
            display: flex;
            will-change: transform;
            transform: translateX(0);
            transition: transform .2s;
            .method{
                width: 100%;
                flex-shrink: 0;
               /* visibility:hidden;
                &.active{
                    visibility: visible;
                }*/
            }
        }
    }
</style>
