<template>
  <el-container>
    <!-- 左边菜单 -->
    <el-aside class="my-aside-main" :style="!isCollapse?'':'width:100px'">
      <h1 class="lo_logo">
        <img :src="logoUrl" alt="">
      </h1>
      <el-menu :default-active="menuIndex"  :router="false" :collapse="isCollapse" unique-opened class="sidebar-menu">
        <!-- 一级循环 -->
        <template v-for="(i, k) in menuhtml">
          <el-submenu v-if="menuHasChild(i.childList)" :key="k" :index="`${k}`">
            <template slot="title">
              <i :class="`lo_icon lo_icon_${i.icon}`"></i>
              <strong>{{i.menuName}}</strong>
            </template>
            <!-- 二级循环 -->
            <template v-for="(ii, kk) in i.childList">
              <template v-if="ii.visible === '0'">
                <el-submenu v-if="menuHasChild(ii.childList)" :key="kk" :index="`${k}-${kk}`">
                  <template slot="title">{{ii.menuName}}</template>
                  <!-- 三级循环 -->
                  <template v-for="(iii, kkk) in ii.childList">
                    <template v-if="iii.visible === '0'">
                      <el-menu-item :key="kkk" :index="`${k}-${kk}-${kkk}`" @click="toFrame(iii.url)">
                        {{iii.menuName}}
                      </el-menu-item>
                    </template>
                  </template>
                </el-submenu>
                <!-- 无三级二级菜单 -->
                <el-menu-item v-else :key="kk" :index="`${k}-${kk}`" @click="toFrame(ii.url)">
                  {{ii.menuName}}
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
          <!-- 无二级顶级菜单 -->
          <el-menu-item v-else :key="k" :index="`${k}`" @click="toFrame(i.url)" class="lo_top_menu">
            <i :class="`lo_icon lo_icon_${i.icon}`"></i>
            <strong>{{i.menuName}}</strong>
            <span slot="title">{{i.menuName}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <div class="el-container is-vertical">
      <!--头部 nav-->
      <el-header class="lo_header">
<!--        <el-button @click="addMessage">添加一个消息</el-button>-->
        <el-popover ref="popover_user_drop" placement="bottom-end" width="160" trigger="hover" popper-class="popover-user-drop" v-model="visible_user_drop">
          <ul class="dropdown-menu">
            <li class="user_drop_items">
              <a href="javascript:;" class="sub_acc_link" @click="toFrame('/tms/#/account/settings')"><span class="icon iconfont iconsetting"></span>账户设置</a>
            </li>
            <li class="user_drop_items">
              <a href="javascript:;" class="sub_acc_link" @click="openVisible"><span class="icon iconfont iconusersetting"></span>修改密码</a>
            </li>
            <li class="dj-splitline">
              <div></div>
            </li>
            <li class="user_drop_items" @click="doSignout">
              <a href="javascript:;" id="logoutBtn"><span class="icon iconfont icontuichu"></span>退出登录</a>
            </li>
          </ul>
        </el-popover>
        <div class="lo_header_right">
          <div class="lo_r_item lo_gohelp" @click="toFrame(helpurl,'_blank')">
            帮助中心
          </div>
          <div class="lo_r_item lo_goapprove" @click="goWorkFlow()">
            待我审的<i v-if="number !== 0" class="number">{{number}}</i>
          </div>
          <!-- 消息中心 -->
          <agency-ring></agency-ring>
          <div class="lo_r_item lo_userinfo" v-popover:popover_user_drop>
            <img src="../assets/avatar2.jpg"/>
            <strong>{{userInfo.accountName || ''}}</strong>
          </div>
        </div>
        <div class="lo_header_search">
          <el-input class="lo_search_input" v-model="queryData" placeholder="请输入运单号或客户单号"></el-input>
          <el-button class="lo_search_btn" icon="el-icon-search" @click="inquireClick" ></el-button>
        </div>
      </el-header>
      <!--中间主区域-->
      <el-main ref="mainLayout" class="main-body" :class="isCollapse?'main-open':''">
        <transition name="fade" mode="out-in">
          <iframe id="mainframe" name="mainframe" src="/login/#/home" style="width:100%;height:calc(100vh - 50px);display:block;"></iframe>
        </transition>
      </el-main>
      <modifypass :isvisible="isvisible" @close="changeVisible"></modifypass>
    </div>
  </el-container>
</template>
<script type="text/javascript">
import { HELP_URL } from '../utils/constance'
import modifypass from './setting/modifypass.vue'
import iframe from '@/utils/iframe'
import CONFIG from '@/config'
import lstore from '@/utils/lstore'
import goFrame from '@/utils/goFrame'
import { setTimeout, clearTimeout } from 'timers'
import agencyRing from './agency/index.vue'
export default {
  name: 'HelloWorld',
  components: {
    modifypass,
    agencyRing
  },
  data () {
    var processor = (context) => {
      return {
        performProcessing: () => {},
        process: function () {
          clearTimeout(context.timeoutId)
          var that = this
          context.timeoutId = setTimeout(() => {
            that.performProcessing()
          }, 500)
        }
      }
    }

    return {
      number: 0,
      timeoutId: null,
      processor: processor(this),
      ismenushow: true,
      loading: false,
      isCollapse: true,
      visible_user_drop: false,
      menuList: [],
      frameInterTimer: null,
      menuIndex: '0',
      queryData: '',
      numberToApprove: 0,
      menuhtml: [],
      mainUserInfo: null,
      helpurl: HELP_URL,
      isvisible: false,
      logoUrl: lstore.get(CONFIG.logoUrl) || '/login/image/logo.svg',
      isRouterFromDomain: false
    }
  },
  computed: {
    userInfo () {
      let user = this.$store.getters.GET_USER_INFO || this.$store.getters.GET_LOGIN_USER
      return user || { accountName: '' }
    },
    currentNumberToApprove () {
      return this.numberToApprove > 99 ? '99+' : `${this.numberToApprove}`
    }
  },
  watch: {
  },
  methods: {
    // addMessage () {
    //   let user = this.mainUserInfo
    //
    //   // 搜索参数（需要后端提供 messageExtraParam 字段 ）
    //   let searchData = {
    //     type: 'specialFee',
    //     expenseCode: '',
    //     relCode: 'YD20170802'
    //   }
    //
    //   let testData = [
    //     {
    //       messageTitle: '我是标题',
    //       messageAbstract: '我是摘要',
    //       messageContent: '我是内容，支持html富文本结构',
    //       // number  1:汇报 3：业务   5：报警  7：审批   9：系统
    //       messageType: 3,
    //       // 需要后端带的参数
    //       messageExtraParam: JSON.stringify(searchData),
    //       sender: {
    //         'tenantId': user.tenantId,
    //         'departId': user.departmentId,
    //         'accountId': user.accountId
    //       },
    //       reciverList: [
    //         {
    //           'tenantId': user.tenantId,
    //           'departId': user.departmentId,
    //           'accountId': user.accountId
    //         }
    //       ]
    //     }
    //   ]
    //   this.$http.post('/api/platform/message/sendMessageBatch', testData).then(res => {
    //     this.$message('成功了')
    //   })
    //
    // },
    getNumberToApprove (context) {
      context._api({
        url: '/wf/approve/getApproveList',
        webType: 'api',
        type: 'get',
        params: { page: 1, pageSize: 10, tabType: 1 }
      }).then(res => {
        // console.log('login>getApproveList>res515', res)
        context.numberToApprove = (res.data && res.data.total) || 0
      }, error => {
        console.log(error)
      })
    },
    openVisible () {
      this.isvisible = true
    },
    changeVisible (isvisible) {
      this.isvisible = false
    },
    menuHasChild (menuArr) {
      let res = false
      if (typeof menuArr === 'object' && menuArr.constructor === Array) {
        menuArr.forEach(item => {
          if (item.visible === '0') res = true
        })
      }
      return res
    },
    inquireClick () {
      if (this.queryData === '') return false
      this._api({
        url: 'selectByPage',
        webType: 'order',
        type: 'get',
        params: { page: 1, pageSize: 10, globalSearch: this.queryData }
      }).then(
        res => {
          if (res.data.records && res.data.records.length) {
            this.checkWaybill()
          } else {
            this.$message.info('跟踪不到此运单')
          }
        },
        err => {
          console.log(err)
          this.$message({ type: 'error', message: '系统异常，请联系管理员' })
        }
      )
    },
    checkWaybill () {
      let loading = this.$loading({
        lock: true,
        text: '正在查询'
      })
      this.toFrame('/tms/#/dashboard')
      let _index = ''
      let _url = null
      this.menuhtml.forEach((element, index) => {
        if (element.perms.indexOf('track') >= 0) {
          if (!element.url) {
            _index = index + '-0'
            _url = element.childList.length > 0 ? element.childList[0].url : null
          } else {
            _index = index
            _url = element.url
          }
        }
      })
      this.menuIndex = _index
      _url = _url + '/' + this.queryData
      setTimeout(() => {
        this.toFrame(_url || '')
        loading.close()
      }, 1000)
    },
    toFrame (htmlurl, target) {
      goFrame(htmlurl, target)
    },
    toggleAside () {
      this.isCollapse = !this.isCollapse
    },
    handleAfterSignout () {
      this.$store.commit('SET_USER_INFO')
      this.$store.commit('SET_LOGIN_USER')
      this.$store.commit('SET_ACCESSTOKEN', '')
      this.$router.push('/login')
      lstore.remove(CONFIG.accessRecord)
    },
    doSignout () {
      // const that = this
      this.$confirm('真的要注销登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendLogOut()
      }).catch(() => {})
    },
    sendLogOut () {
      this._api({
        url: 'logout',
        webType: 'root',
        type: 'post'
      }).then(
        res => {
          this.handleAfterSignout()
        },
        err => {
          console.log(err)
          this.handleAfterSignout()
        }
      ).catch(err => {
        console.log(err)
        this.handleAfterSignout()
      })
    },
    getLoginStatus () {
      if (!this.$store.getters.GET_CURRENTUSERINFO) {
        this.$router.push({ path: '/login' })
      }
    },
    getUserInfo () {
      this._api({
        url: 'accountinfo',
        webType: 'root',
        type: 'post'
      }).then(
        res => {
          if (!res.code) {
            this.mainUserInfo = res.data
            this.menuhtml = res.data.treeList
            this.$store.commit('SET_TENANTID', this.mainUserInfo.tenantId)
            this.$store.commit('SET_USER_INFO', this.mainUserInfo)
            this.showDefaultPage()
            lstore.set(CONFIG.menuTree, this.menuhtml)
            lstore.set(CONFIG.menuList, res.data.menuList)
            // 设置自定义logo
            let logo = res.data.logoUrl || '/login/image/logo.svg'
            this.logoUrl = logo
            lstore.set(CONFIG.logoUrl, logo)
          } else {
            if (res.code === 401) {
              this.$router.push({ path: '/login' })
            }
          }
        },
        err => {
          console.log(err)
        }
      ).catch(err => {
        console.log(err)
      })
    },
    showDefaultPage () {
      const goDefault = () => {
        if (this.menuhtml && this.menuhtml.length) {
          let page = this.menuhtml[0]
          let url = page.url || (page.childList.length > 0 ? page.childList[0].url : '')
          this.toFrame(url)
        }
      }
      // 从本地存储获取路径
      let record = lstore.get(CONFIG.accessRecord)
      if (record) {
        try {
          if (+new Date() <= record.time) {
            this.toFrame(record.url)
          }
        } catch (error) {
          goDefault()
        }
      } else {
        goDefault()
      }
    },
    goWorkFlow () {
      this.toFrame('/work-flow/#/workflow/list')
    },
    pendingApproval () {
      this._api({
        url: 'order/businessApprove/page?page=1&pageSize=20',
        webType: 'api',
        type: 'post',
        urlAppend: true,
        params: {
          operationType: 10
        }
      }).then(res => {
        this.number = res.data.total
      })
    }
  },
  created () {
    if (self.name) {
      this.toFrame('/login/#/home')
    }
    let that = this
    this.getUserInfo()
    setTimeout(() => {
      iframe(document.getElementById('mainframe'), index => {
        this.menuIndex = index
      })
    }, 1000)
    that.pendingApproval()
    setTimeout(() => {
      that.pendingApproval()
    }, 1000 * 60 * 10)
    window.addEventListener('message', function (e) {
      let data = e.data
      if (data.type === 'login') {
        that.$router.push({ path: '/login' })
        return
      }
      if (data.type === 'ring') {
        that.numberToApprove = data.value
        return
      }
      if (data.type === 'approval') {
        that.number = data.value
        return
      }
      if (data.type === 'approvalChange') {
        that.pendingApproval()
        return
      }
      if (!data.value) {
        let value = that.$store.getters[data.field]
        if (that.$el.querySelector('#mainframe').contentWindow) {
          that.$el.querySelector('#mainframe').contentWindow.postMessage({
            value: value
          }, window.location.origin)
        }
      } else {
        that.$store.commit(data.field, data.value)
      }
    }, false)

    this.processor.process()
  },
  destroyed () {

  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/') {
      next(vm => {
        vm.isRouterFromDomain = true
      })
    } else {
      next(vm => {
        vm.isRouterFromDomain = false
      })
    }
  }
}
</script>
<style lang="scss">
    .number {
        display: block;
        padding: 2px 2px;
        min-height: 16px;
        min-width: 16px;
        text-align: center;
        line-height: 12px;
        position: absolute;
        top: 7px;
        right: -13px;
        background-color: red;
        color: white !important;
        font-size: 12px;
        border-radius: 12px;
    }
</style>
