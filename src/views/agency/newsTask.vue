<template>
  <div class="lo_message_list">
    <div class="lo_message_list_ul">
      <div class="tab_left">
        <div class="tabs" :class="{ 'action': item.messageType === mesType }" v-for="item in messageTypes" :key="item.messageType" @click="changeMesType(item.messageType)">
          <template v-if="Number(item.unReadCount) > 0">
            <el-badge :value="item.unReadCount" :max="99" class="item"> {{item.messageTypeName}}</el-badge>
          </template>
          <template v-else>{{item.messageTypeName}}</template>
        </div>
      </div>
      <div class="tab_content" ref="tabContent">
        <div class="con_btn" @click="readBatch()">全部设为已读</div>
        <div class="con_main" ref="tabMain" :class="'mes' + mesType" v-loading="loading" :element-loading-text="loadingText">
          <ul>
            <li v-for="i in list" :key="i.messageAccountId">
              <div @click="gotoIFrame(i, i.messageId, i.readStatus)" class="ms-txt">
                <h4>{{i.messageTitle}}<span v-if="i.readStatus === 1" class="title"></span></h4>
                <span class="span">{{i.sendTime}}</span>
                <p v-if="Number(mesType) === 9">{{i.messageAbstract}}</p><!-- 系统展示摘要，其他模块展示内容 -->
                <div class="html-text" v-else v-html="i.messageContent"></div>
              </div>
            </li>
          </ul>
        </div>
        <div class="load_more">
          <div v-if="pagination.total > pagination.page" @click="loadMore()">点击加载更多</div>
          <div v-else style="color: rgba(0,0,0,.5)">已无更多</div>
        </div>
      </div>

    </div>
    <!-- <div class="lo_message_list_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="pagination.page"
        :page-sizes="[50, 100, 200, 500]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div> -->
  </div>
</template>
<script>
import goFrame from '@/utils/goFrame'
export default {
  data () {
    return {
      loading: false,
      loadingText: '',
      pagination: {
        page: 1,
        pageSize: 20,
        total: 1
      },
      clientHeight: '',
      totalNum: 0, // 未读消毒数
      mesType: '', // 当前选中类型
      messageTypes: [], // 消息类型
      list: [] // 消息内容
    }
  },
  created () {
    this.messageType()
  },
  mounted () {
    this.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function temp () {
      this.clientHeight = `${document.documentElement.clientHeight}`
    }
    const _this = this
    setInterval(function () {
      _this.list = []
      _this.messageType(1)
    }, 1000 * 60 * 15)
  },
  watch: {
    // 如果 `clientHeight` 发生改变，这个函数就会运行
    clientHeight: function () {
      this.changeFixed(this.clientHeight)
    }
  },
  methods: {
    changeFixed (clientHeight) {
      this.$refs.tabContent.style.height = clientHeight - 118 + 'px'
      this.$refs.tabMain.style.height = clientHeight - 118 - 80 + 'px'
    },
    init () {
      this.loading = true
      this._api({
        url: 'platform/message/getPageByAccount',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          'messageType': this.mesType,
          'page': this.pagination.page,
          'pageSize': this.pagination.pageSize,
          'relation': 2
        }
      }).then(res => {
        let list = []
        let lists = []
        this.list = []
        this.list = [...this.list, ...res.data.records]
        this.list.forEach(item => {
          if (!list.includes(item.messageAccountId)) {
            list.push(item.messageAccountId)
            lists.push(item)
          }
        })
        this.list = lists
        this.pagination.total = res.data.pages
      }).catch(() => {}).finally(() => {
        this.loading = false
      })
    },
    getUnReadMessageNums () {
      return this._api({
        url: 'platform/message/getUnReadMessageNums',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {}
      }).then(res => {
        if (res && res.data && res.data.length) {
          return res.data.filter(item => {
            return item.messageType === '1' || item.messageType === '9' || item.messageType === '3' || item.messageType === '5' || item.messageType === '7'
          })
        }
        return []
      })
    },
    messageType (show) {
      return this.getUnReadMessageNums().then(res => {
        this.messageTypes = res
        if (res.data && res.data.length) this.messageTypes = res.data
        const _this = this
        this.totalNum = 0
        this.messageTypes.forEach(item => {
          _this.totalNum += Number(item.unReadCount)
        })
        this.$emit('func', this.totalNum)
        this.mesType = this.mesType ? this.mesType : this.messageTypes[0].messageType
        if (!show) {
          this.list = []
        }
        if (show !== 1) this.init()
      })
    },
    readBatch () {
      this._api({
        url: 'platform/message/readMessageBatch',
        webType: 'api',
        type: 'get',
        params: {
          messageType: this.mesType
        }
      }).then(res => {
        this.messageType()
      })
    },
    changeMesType (mesType) {
      this.mesType = mesType
      this.pagination.page = 1
      this.list = []
      this.init()
    },
    loadMore () {
      if (this.pagination.total > this.pagination.page) {
        this.pagination.page++
        this.init()
      }
    },
    // handleSizeChange (val) {
    //   this.pagination.pageSize = val
    //   this.init()
    // },
    // handleCurrentChange (val) {
    //   this.pagination.page = val
    //   this.init()
    // },

    // 消息已读接口
    messageRead (messageId) {
      return this._api({
        url: 'platform/message/detail',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          'messageId': messageId
        }
      })
    },
    async gotoIFrame (item, messageId, readStatus) {
      let params = {}
      try {
        params = JSON.parse(item.messageExtraParam)
      } catch (e) {}
      console.log('查看当前消息', item, params)

      if (readStatus !== 2) {
        this.loadingText = '跳转中...'
        await this.messageRead(messageId)
        await this.messageType(true)
        this.loadingText = ''
      }

      // 1:汇报 3：业务 5：报警  7：审批   9：系统
      let messageType = parseInt(item.messageType)

      if (messageType === 9) {
        goFrame(`/login/#/message/${messageId}`)
      }
      // 报表
      if (messageType === 1) {
        goFrame(`/chart/#/revenuestatistics/main?type=${params.type}`)
      }
      if (messageType === 3) {
        switch (params.type) {
          case 'track': // 跟踪-全部运单
            goFrame(`/track/#/index/${params.waybillCode || ' '}`)
            break
          case 'exception': // 跟踪-异常处理
            goFrame(`/track/#/exception/${params.relCode || ' '}`)
            break
          case 'claim': // 跟踪-索赔赔偿
            goFrame(`/track/#/claimCompensation/${params.relCode || ' '}`)
            break
          case 'specialFee': // 跟踪-特殊费
            goFrame(`/track/#/specialFee/${params.relCode || ' '}/${params.expenseCode || ' '}`)
            break
          case 'account-receipt': // 收款确认 settlementBatches 结算批次
            goFrame(`/finance/#/account/receipt?settlementBatches=${params.settlementBatches}`)
            break
          case 'account-payment': // 付款确认 settlementBatches 结算批次
            goFrame(`/finance/#/account/payment?settlementBatches=${params.settlementBatches}`)
            break
          case 'account-statementmanage': // 该结算批次详情 settlementBatches（结算批次）、processPaymentId（核算单id）、objType（类型：客户1、承运商2、司机3）、payType（收付款，收款1，付款2）
            goFrame(`/finance/#/account/statementmanage?settlementBatches=${params.settlementBatches}&processPaymentId=${params.processPaymentId}&objType=${params.objType}&payType=${params.payType}`)
            break
          case 'account-invoices': // 确认开票 processCode 开票编号
            goFrame(`/finance/#/account/invoices?processCode=${params.processCode}`)
            break
          case 'account-invoice': // 确认收票 processCode 收票编号
            goFrame(`/finance/#/account/invoice?processCode=${params.processCode}`)
            break
          case 'settle-customer-order': // 客户账单 documentCode 账单号
            goFrame(`/finance/#/settle/customer/order?documentCode=${params.documentCode}`)
            break
          case 'settle-carrier-order': // 承运商账单 documentCode 账单号
            goFrame(`/finance/#/settle/carrier/order?documentCode=${params.documentCode}`)
            break
          case 'settle-driver-order': // 司机账单 documentCode 账单号
            goFrame(`/finance/#/settle/driver/order?documentCode=${params.documentCode}`)
            break
          case 'account-receipt-none': // 司机账单 documentCode 账单号
            goFrame(`/finance/#/account/receipt`)
            break
          default:
            console.warn('暂无此类型')
        }
      }
      if (messageType === 5) {
        switch (params.type) {
          case 'account-receipt': // 收款确认 settlementBatches 结算批次
            goFrame(`/finance/#/account/receipt?settlementBatches=${params.settlementBatches}`)
            break
          case 'account-payment': // 付款确认 settlementBatches 结算批次
            goFrame(`/finance/#/account/payment?settlementBatches=${params.settlementBatches}`)
            break
          case 'account-receipt-none': // 司机账单 documentCode 账单号
            goFrame(`/finance/#/account/receipt`)
            break
          case 'settle-order-filter': // 账单逾期  处理
            if (params.objType === 1) {
              goFrame(`/finance/#/settle/customer/order?documentCode=${params.documentCode}`)
            }
            if (params.objType === 2) {
              goFrame(`/finance/#/settle/carrier/order?documentCode=${params.documentCode}`)
            }
            if (params.objType === 3) {
              goFrame(`/finance/#/settle/driver/order?documentCode=${params.documentCode}`)
            }
            break
          case 'track-receipt': // 收款确认 settlementBatches 结算批次
            let externalType = params.externalType || ' '
            goFrame(`/track/#/receipt/${externalType}?projectName=${params.productName}&transportDateStart=${params.transportDateStart}&transportDateEnd=${params.transportDateEnd}`)
            break
          default:
            console.warn('暂无此类型')
        }
      }
      if (messageType === 7) {
        if (params.operationType) {
          goFrame(`/work-flow/#/workflow/list/${params.operationType || ' '}/${params.approvalCode || ' '}`)
        }
      }
    }
  }
}
</script>
<style scoped>
  .html-text >>> strong {
    font-weight: bold;
  }
</style>
