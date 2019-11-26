<template>
  <div class="ho_main">
    <section class="ho_card" v-if="dashboardItem.length !== 0">
      <header class="ho_card_header">
        <h3>待办事项</h3>
      </header>
      <div class="ho_card_body">
        <div class="ho_dashboard">
          <div v-for="i in dashboardItem"
            :key="i.type"
            @click="goUrl(i.fullUrl ? i.fullUrl : i.url)"
            :class="`ho_dashboard_item ho_dashboard_${i.type}`">
            <i></i>
            <em>{{dashboard[i.number]}}</em>
            <strong>{{i.name}}</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="ho_card">
      <header class="ho_card_header">
        <h3>快速指引</h3>
      </header>
      <div class="ho_card_body">
        <div class="ho_flow" id="ho_flow">
          <ul :style="`transform:scale(${flowZoom})`">
            <template v-for="(i, k) in flow">
              <li
                :key="`item${k + 1}`"
                :class="`${(i.permissions && userInfo && userInfo.verifiedStatus !== 1) ? '' : 'disable'}`"
                :title="`${(i.permissions && userInfo && userInfo.verifiedStatus !== 1) ? i.name : '暂无权限'}`"
                @click="clickFlowItem(i)">
                <i :class="`flow_icon flow_icon_${i.icon}`"></i>
                <strong v-text="i.name"></strong>
              </li>
            </template>
            <span v-for="(i, k) in 'ilovegaona'.split('')" :key="`line${k + 1}`" :class="`flowline flowline${k+1}`"></span>
            <span v-for="(i, k) in 'iloveu'.split('')" :key="`arrow${k + 1}`" :class="`flowarrow flowarrow${k+1}`"></span>
          </ul>
        </div>
      </div>
    </section>

  </div>
</template>
<script>
import CONFIG from '@/config'
import lstore from '@/utils/lstore'
// 引入前端本地默认的导航基础数据
import LinkData from '@/json/homelink'
export default {
  name: 'HelloWorld',
  components: {},
  data () {
    let dashboardItem = LinkData.dashboardItem.filter(item => {
      if (item.type === 'dispatch' && this._auth('base')) {
        return false
      }
      return true
    })
    return {
      flow: LinkData.flow,
      flowZoom: 1,
      dashboard: {
        pickup: 0,
        receipt: 0,
        trace: 0
      },
      dashboardItem: dashboardItem
    }
  },
  created () {

  },
  mounted () {
    this.getData()
    this.flowBoxReSize()
    this.getMenu()
    this.flow.forEach(item => {
      console.log('item', item, this.userInfo)
      if (this.userInfo && this.userInfo.verifiedStatus === 1) {
        item.permissions = false
      }
    })
    console.log('this.flow', this.flow)
  },
  methods: {
    getData () {
      this.initFlow()
      this.initDashboard()
      if (this.$store.getters.GET_USER_INFO.verifiedStatus !== 1) {
        this._api({
          url: 'order/workbench/reposts',
          webType: 'api',
          type: 'get',
          params: {}
        }).then(res => {
          this.dashboard = res.data
        })
      }
    },
    getMenu () {
      // 从readis接口获取正式的首页导航基础数据
      this._api({
        url: 'common/common/getCommonValue',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          key: 'LoginMainUrl'
        }
      }).then(res => {
        let o = JSON.parse(res.data)
        if (JSON.stringify(LinkData) !== res.data) {
          this.flow = o.flow
          this.dashboardItem = o.dashboardItem
          this.initFlow()
          this.initDashboard()
        }
      })
    },
    setMenu () {
      // 更新首页导航基础数据接口，请勿调用
      this._api({
        url: 'common/common/updateCommonValue',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          key: 'LoginMainUrl',
          value: JSON.stringify(LinkData)
        }
      }).then(res => {
        console.log('更新成功')
      })
    },
    initFlow () {
      let menuList = lstore.get(CONFIG.menuList);
      (this.flow || []).forEach(item => {
        for (let menu of menuList) {
          if (menu.url === item.url) {
            item.permissions = true
            if (item.name === '导入运单' && item.permissions === true) {
              this.flow.filter(i => {
                if (i.name === '添加运单') {
                  i.permissions = true
                }
              })
            }
            return
          }
        }
      })
    },
    initDashboard () {
      let menuList = lstore.get(CONFIG.menuList)
      let obj = JSON.parse(JSON.stringify(this.dashboardItem))
      for (let index in obj) {
        let item = obj[index]
        let res = false
        for (let menu of menuList) {
          if (menu.url === item.url) {
            res = true
          }
        }
        if (!res) {
          delete obj[index]
        }
      }
      this.dashboardItem = obj.filter(function (item) { return item })
    },
    clickFlowItem (item) {
      if (this.userInfo && this.userInfo.verifiedStatus === 1) return false
      if (item.permissions) {
        let search = item.search ? item.search : ''
        let url = item.url + search
        window.location.href = url
      }
    },
    flowBoxReSize () {
      const reSize = () => {
        let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 60
        if (w <= 1180) {
          this.flowZoom = w / 1180
        } else if (this.flowZoom !== 1) {
          this.flowZoom = 1
        }
      }
      window.addEventListener('resize', reSize)
      window.addEventListener('load', reSize)
    },
    goUrl (url) {
      window.location.href = url
    }
  },
  destroyed () {

  },
  computed: {
    userInfo () {
      return this.$store.getters.GET_USER_INFO
    }

  }
}
</script>
