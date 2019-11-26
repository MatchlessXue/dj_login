<template>
  <div class="lo_message_main" v-loading="loading">
    <!-- <el-button @click="$router.push('/message')" size="mini" type="text">返回上一页</el-button> -->
    <div class="lo_message_detail">
      <h1 class="lo_message_detail_title" v-text="dat.messageTitle">新闻标题</h1>
      <time class="lo_message_detail_time" v-text="dat.sendTime">2019-08-10 11:41:37</time>
      <article class="article_content" v-html="dat.messageContent"></article>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      id: this.$route.params.id,
      dat: {},
      loading: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.loading = true
      this._api({
        url: 'platform/message/detail',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          'messageId': this.id
        }
      }).then(res => {
        this.dat = res.data
      }).catch(() => {
        this.$router.push('/message')
      }).finally(() => {
        this.loading = false
      })
    }
  },
  watch: {
    '$route' (to, from) {
      this.id = this.$route.params.id || 0
      this.getData()
    }
  }
}
</script>
