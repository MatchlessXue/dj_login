<template>
  <div>
    <div class="at-row" v-if="false">
      <p class="at-title">今日运单</p>
      <div class="at-ctext">
        <div class="at-citem">
          <dl @click="gotoIFrame(1)">
              <dt><img src="~@/assets/agency/yd-wdd.png" alt=""></dt>
              <dd>未提交调度</dd>
              <dd>{{tdata.waybillNotSub||0}}</dd>
          </dl>
        </div>
        <div class="at-citem">
          <dl @click="gotoIFrame(2)">
              <dt><img src="~@/assets/agency/yd-ocr.png" alt=""></dt>
              <dd>OCR未完成</dd>
              <dd>{{tdata.waybillNotOcr||0}}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="at-row" v-if="_auth('base')">
      <p class="at-title">待调度的运单</p>
      <div class="at-ctext">
        <div class="at-citem">
          <dl @click="gotoIFrame(3)">
              <dt><img src="~@/assets/agency/yn-ddd.png" alt=""></dt>
              <dd>待调度运单</dd>
              <dd>{{tdata.waybillNotDis||0}}</dd>
          </dl>
        </div>
      </div>
    </div>

    <!-- <div class="at-row">
      <p class="at-title">在途跟踪</p>
      <div class="at-ctext">
        <div class="at-citem at-item4">
          <dl @click="gotoIFrame(4)">
              <dt><img src="~@/assets/agency/gz-th.png" alt=""></dt>
              <dd>提货</dd>
              <dd>{{tdata.trackTh||0}}</dd>
          </dl>
        </div>
        <div class="at-citem at-item4">
          <dl @click="gotoIFrame(5)">
              <dt><img src="~@/assets/agency/gz-zz.png" alt=""></dt>
              <dd>中转</dd>
              <dd>{{tdata.trackZz||0}}</dd>
          </dl>
        </div>
        <div class="at-citem at-item4">
          <dl @click="gotoIFrame(6)">
              <dt><img src="~@/assets/agency/gz-ps.png" alt=""></dt>
              <dd>配送</dd>
              <dd>{{tdata.trackPs||0}}</dd>
          </dl>
        </div>
        <div class="at-citem at-item4">
          <dl @click="gotoIFrame(7)">
              <dt><img src="~@/assets/agency/gz-zd.png" alt=""></dt>
              <dd>直达</dd>
              <dd>{{tdata.trackZd||0}}</dd>
          </dl>
        </div>
      </div>
    </div> -->

    <div class="at-row">
      <p class="at-title">回单</p>
      <div class="at-ctext">
        <div class="at-citem">
          <dl @click="gotoIFrame(8)">
              <dt><img src="~@/assets/agency/dj-sj.png" alt=""></dt>
              <dd>司机上传的</dd>
              <dd>{{tdata.receiptDriverUploading||0}}</dd>
          </dl>
        </div>
        <div class="at-citem">
          <dl @click="gotoIFrame(9)">
              <dt><img src="~@/assets/agency/db-more.png" alt=""></dt>
              <dd>其他</dd>
              <dd>{{tdata.receiptUnregistered||0}}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="at-row">
      <p class="at-title">异常</p>
      <div class="at-ctext">
        <div class="at-citem">
          <dl @click="gotoIFrame(10)">
              <dt><img src="~@/assets/agency/dj-sj.png" alt=""></dt>
              <dd>司机提交的</dd>
              <dd>{{tdata.trackExceptionDriver||0}}</dd>
          </dl>
        </div>
        <div class="at-citem">
          <dl @click="gotoIFrame(11)">
              <dt><img src="~@/assets/agency/db-more.png" alt=""></dt>
              <dd>其他</dd>
              <dd>{{tdata.trackException||0}}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="at-row">
      <p class="at-title">待处理特殊费</p>
      <div class="at-ctext">
        <div class="at-citem">
          <dl @click="gotoIFrame(12)">
              <dt><img src="~@/assets/agency/dj-sj.png" alt=""></dt>
              <dd>司机上传的</dd>
              <dd>{{tdata.trackExpenseDriver||0}}</dd>
          </dl>
        </div>
        <div class="at-citem">
          <dl @click="gotoIFrame(13)">
              <dt><img src="~@/assets/agency/db-more.png" alt=""></dt>
              <dd>其他</dd>
              <dd>{{tdata.trackExpense||0}}</dd>
          </dl>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import goFrame from '@/utils/goFrame'
export default {
  data () {
    return {
      visible: true,
      tdata: {},
      agencyUrl: {
        1: `/waybill/?_=1568949#/waybill`,
        2: `/waybill/?_=1568949#/waybill`,
        3: `/dispatch/?_=1568951#/dispatch`,
        4: `/track/?_=1568950#/onTheWay`,
        5: `/track/?_=1568950#/onTheWay`,
        6: `/track/?_=1568950#/onTheWay`,
        7: `/track/?_=1568950#/onTheWay`,
        8: `/track/?_=1568951#/management`,
        9: `/track/?_=1568951#/receipt`,
        10: `/track/?_=1568950#/exception/''/2`,
        11: `/track/?_=1568950#/exception/''/1`,
        12: `/track/?_=1568950#/specialFee/''/''/2`,
        13: `/track/?_=1568950#/specialFee/''/''/1`
      }
    }
  },
  methods: {
    getData () {
      this._api({
        url: 'order/dealt/todolist',
        webType: 'api',
        type: 'get',
        urlAppend: true,
        params: {}
      }).then(res => {
        this.tdata = res.data
      }).catch(() => {})
    },
    gotoIFrame (type) {
      let _url = this.agencyUrl[type]
      console.log(_url)
      goFrame(_url)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style type="scss" scoped>

</style>
