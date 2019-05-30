<template>
  <div class="confirm-time">
    <div class="pt">
      <div class="pic">
        <img :src="strategy.img">
      </div>
      <b>{{strategy.title}}</b>
      <p>{{strategy.desc}}</p>
    </div>
    <Form inline class="form" ref="form" :model="formValues">
      <div class="batches" v-show="strategyArr[strategy.id] === 'Send in batches'">
        <FormItem class="item" prop="batches">
          <label slot="label">Batches</label>
          <Select class="select batch" v-model="formValues.batches">
            <Option v-for="item in batches" :value="item" :key="item">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem class="item interval" prop="interval">
          <label slot="label">Interval</label>
          <Select class="select interval" v-model="formValues.interval">
            <Option v-for="item in [1, 3, 6, 24]" :value="item" :key="item">{{item}}</Option>
          </Select>
          <span class="min">min</span>
        </FormItem>
      </div>
      <div class="select-time">
        <FormItem class="item" prop="date">
          <DatePicker
            type="date"
            placeholder="Select date"
            v-model="formValues.date"
            :options="dateOption"
            :clearable="false"
            :editable="false">
          </DatePicker>
        </FormItem>
        <FormItem class="item" prop="time">
          <TimePicker
            type="time"
            format="HH:mm"
            :steps="[1, 5]"
            placeholder="Select time"
            v-model="formValues.time"
            :clearable="false"
            :editable="false">
          </TimePicker>
        </FormItem>
        <FormItem class="item cst" v-show="strategyArr[strategy.id] !== 'Recipients\' time zone'">
          <EdSelect
            :count="623"
            :panelWidth="450"
            :creatable="false"
            :visible="visible"
            @on-search="onSearch"
            @on-visible-change="visible = $event">
            <span slot="handle" class="handle">{{selectedTimeZone.offset}}</span>
            <EdScroll :data="timeZones" ref="edScroll">
              <div>
                <EdSelectItem
                  v-for="item in filterTimeZones"
                  :key="item.title"
                  :id="item.title"
                  :editable="false"
                  :deletable="false">
                  <span v-highlight @click="onSelectTimeZone(item)">{{item.title}}({{item.offset}})</span>
                </EdSelectItem>
              </div>
            </EdScroll>
          </EdSelect>
        </FormItem>
      </div>
    </Form>
    <div class="btns">
      <Button class="btn cancel" v-btn-style @click="$emit('on-cancel')">Cancel</Button>
      <Button class="btn" v-btn-style="'blue'" @click="onArrange">Arrange</Button>
    </div>
  </div>
</template>

<script>
import { STRAREGY } from "../../../../configs/enums";
import {format, setMinutes, setHours, isFuture} from 'date-fns';

export default {
  name: "ConfirmTime",
  props: {
    strategy: {
      type: Object,
      required: true
    },
    timeZones: {
      type: Array,
      required: true
    },

    // 收件人数量
    batchLen: Number
  },

  data() {
    return {
      visible: false,
      filterTimeZones: this.timeZones,
      selectedTimeZone: {
        offset: 'CST'
      },
      formValues: {
        batches: 2,
        interval: 1,
        date: new Date(),
        time: new Date()
      },

      dateOption: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      }
    };
  },
  computed: {
    batches(){
      if (this.strategyArr[this.strategy.id] === 'Send in batches' && this.batchLen >= 200) {
        const max = Math.ceil(this.batchLen / 100);
        const arr = [];
        for (let a = 2; a <= max; a++) {
          arr.push(a);
        }
        return arr;
      }else {
        return [];
      }
    }
  },
 /* watch: {
    strategy(newVal) {
      console.log('strategy', newVal);
    }
  },*/

  methods: {
    onArrange() {
//      console.log("formValues :", this.formValues);
      const selectTime = this.formValues.time.split(':', 2);
      const selectDt = setMinutes(setHours(this.formValues.date, selectTime[0]), selectTime[1]);
//      console.log(differenceInMilliseconds(selectDt, new Date()) > 60000);
      if (isFuture(selectDt)) {
        // const timeZone = this.selectedTimeZone.title ? this.selectedTimeZone.title + ' ' + this.selectedTimeZone.offset : '';
        const timeZone = this.selectedTimeZone.title || '';
        let params = {};
        const commonParams = {
          type: this.strategy.id,
          date: format(this.formValues.date, "YYYY-MM-DD"),
          time: this.formValues.time
        }

        if ((this.strategyArr[this.strategy.id] !== "Recipients' time zone") && !timeZone) {
          this.$Modal.warning({
            title: 'select time zone please'
          });
        }else {
          if (this.strategyArr[this.strategy.id] === 'Send in batches') {
            params = {
              batches: this.formValues.batches,
              interval: this.formValues.interval,
              timeZone,
              ...commonParams
            }
          }else {
            params = {
              timeZone,
              ...commonParams
            }
          }
          this.$emit('on-arrange', params);
        }
      }else {
        this.$Modal.warning({
          title: 'The selected time should not be earlier than the current time'
        });
      }
    },
    onSearch(key) {
      this.filterTimeZones = this.timeZones.filter(item => item.title.indexOf(key) !== -1);
    },
    onSelectTimeZone(item) {
      this.selectedTimeZone = item;
      this.visible = false;
    }
  },
  created() {
    this.strategyArr = STRAREGY;
  }
};
</script>

<style scoped lang="less">
@import "~assets/styles/variable";
.confirm-time {
  width: 520px;
  margin: 30px auto;

  .pt {
    text-align: center;
    b {
      display: block;
      font-size: @font-size-mid;
      margin: 15px 0;
    }
    p {
      max-width: 300px;
      margin: 0 auto;
      font-size: @font-size-normal;
    }
  }
  .form {
    margin-top: 15px;
    text-align: center;
    .batches {
      .item {
        width: 230px;
        label {
          font-size: @font-size-normal;
        }
        .select {
          width: 150px;
          text-align: left;
        }

        &.interval {
          width: 240px;
          .select {
            margin-right: 8px;
          }
        }
      }
    }
    .select-time {
      .cst {
        .handle {
          cursor: pointer;
          color: @color-primary;
        }
      }
    }
  }
  .btns {
    text-align: center;
    .cancel {
      margin-right: 20px;
    }
  }
}
</style>
