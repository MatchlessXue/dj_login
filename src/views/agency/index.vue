<template>
  <el-popover placement="bottom" width="380" trigger="hover" @show="initUnreadMessageList">
    <div slot="reference" :class="`lo_r_item lo_message ${messageNum === 0 ? '' : 'has_message'}`"></div>
    <div class="lo_message_popover" v-loading="messageLoading">
      <!-- <header>新消息</header>
      <div v-if="unReadMessageNum === 0" class="lo_message_popover_nothing">
        暂无消息
      </div>
      <ul v-else>
        <li v-for="i in unReadMessageList" :key="i.messageId" @click="toFrame(`/login/#/message/${i.messageId}`)">
          <time v-text="formatMessageTime(i.sendTime)">2019-08-10 12:28:26</time>
          <span v-text="i.messageTitle">版本更新版本更新版本更新版本更新版本更新版本更新版本更新版本更新…</span>
        </li>
      </ul>
      <footer @click="toFrame('/login/#/message')">查看全部</footer> -->
      <div class="ac-wraper">
        <div class="ac-container">
          <transition
            name="ac-drawer-fade"
            @after-enter="afterEnter"
            @after-leave="afterLeave">
            <div class="ac-context" >
              <el-radio-group v-model="radio">
                <el-radio-button :label="1">待办</el-radio-button>
                <el-radio-button :label="2">
                  <template v-if="messageNum > 0">
                    <el-badge :value="messageNum" :max="99" class="item">消息</el-badge>
                  </template>
                  <template v-else>消息</template>
                </el-radio-button>
              </el-radio-group>
              <agend-task v-show="radio === 1" ref="agendTaskRef"></agend-task>
              <news-task v-show="radio === 2" ref="newsTaskRef" @func="getTotalNum"></news-task>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </el-popover>

</template>
<script>
import moment from 'moment'
import agendTask from './agendTask.vue'
import newsTask from './newsTask.vue'
export default {
  name: 'agency',
  components: { agendTask, newsTask },
  data () {
    return {
      visible: true,
      radio: 1,
      messageNum: 0,
      unReadMessageNum: 0,
      messageLoading: false,
      unReadMessageList: [],
      unReadMessageListLoadTime: null
    }
  },
  methods: {
    getTotalNum (data) {
      this.messageNum = data
    },
    afterEnter () {
      this.$emit('opened')
    },
    afterLeave () {
      this.$emit('closed')
    },
    hasMessage () {
      this._api({
        url: 'platform/message/getUnReadMessageNums',
        webType: 'api',
        type: 'post'
      }).then(res => {
        this.unReadMessageNum = res.data.unReadCount
      })
    },
    initUnreadMessageList () {
      this.$refs.newsTaskRef.messageType()
      // if (this.unReadMessageListLoadTime && (+new Date() - this.unReadMessageListLoadTime < 300000)) return
      // this.messageLoading = true
      // this._api({
      //   url: 'platform/message/getPageByAccount',
      //   webType: 'api',
      //   type: 'post',
      //   urlAppend: true,
      //   params: {
      //     'page': 1,
      //     'pageSize': 5,
      //     'relation': 2,
      //     'readStatus': 1
      //   }
      // }).then(res => {
      //   this.unReadMessageList = res.data.records
      //   this.unReadMessageNum = res.data.total
      //   this.unReadMessageListLoadTime = +new Date()
      // }).catch(() => {}).finally(() => {
      //   this.messageLoading = false
      // })
    },
    formatMessageTime (timeStr) {
      let res = moment(timeStr).format('MM/DD hh:mm')
      res = res === 'Invalid date' ? '-' : res
      return res
    }
  },
  created () {
    // this.hasMessage()
  }
}
</script>
<style type="scss" scoped>

</style>
