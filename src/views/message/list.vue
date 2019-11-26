<template>
  <div class="lo_message_list" v-loading="loading">
    <header class="lo_message_list_header">系统消息</header>
    <div class="lo_message_list_ul">
      <ul>
        <li v-for="i in list" :key="i.messageAccountId" :class="`${i.readStatus === 1 ? 'unread' : ''}`">
          <router-link :to="`/message/${i.messageId}`">
            <time>{{i.sendTime}}</time>
            <h4>{{i.messageTitle}}</h4>
            <p>{{i.messageAbstract}}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="lo_message_list_page">
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
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      pagination: {
        page: 1,
        pageSize: 50,
        total: 0
      },
      list: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      this._api({
        url: 'platform/message/getPageByAccount',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          'page': this.pagination.page,
          'pageSize': this.pagination.pageSize,
          'relation': 2
        }
      }).then(res => {
        this.list = res.data.records
        this.pagination.total = res.data.total
      }).catch(() => {}).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.pagination.page = val
      this.init()
    }
  }
}
</script>
