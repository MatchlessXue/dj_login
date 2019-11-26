<template>
    <div class="lo_setting_menu">
      <el-button-group>
        <el-button size="mini" @click="() => addMenu()"> 新增菜单 </el-button>
        <el-button size="mini" @click="() => {filterText = !filterText}" v-text="`${filterText ? '显示隐藏菜单' : '不显示隐藏菜单'}`"></el-button>
      </el-button-group>
      <el-tree
        ref="tree"
        :data="menuhtml"
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        :props="props"
        :filter-node-method="isShow"
        :expand-on-click-node="false"
        >
        <p class="custom-tree-node" slot-scope="{ node, data }">
          <strong>{{ node.label }}</strong>
          <span><em>排序：</em>{{data.displayOrder ? data.displayOrder : '未设置'}}</span>
          <span><em>状态：</em><u v-if="data.visible === '0'">显示</u><i v-else>隐藏</i></span>
          <el-button
            type="text"
            size="mini"
            @click="() => editMenu(data)"
            >
            编辑
          </el-button>
        </p>
      </el-tree>
      <el-dialog
        :title="formmenu.menuId ? '编辑菜单' : '新增菜单'"
        :visible.sync="dialogMenuFormVisible"
        :close-on-click-modal="false"
        custom-class="dj-dialog"
        >
        <el-form v-model="formmenu" label-width="80px" style="width:400px;">
          <el-form-item label="菜单名称">
            <el-input v-model="formmenu.menuName"></el-input>
          </el-form-item>
          <el-form-item label="图标名称">
            <el-input v-model="formmenu.icon"></el-input>
          </el-form-item>
          <el-form-item label="父级" v-if="formmenu.parentId!=='0'">
            <el-cascader v-model="formmenu.parentArr" change-on-select :options="menuhtml" :props="props"></el-cascader>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch
              v-model="formmenu.visible"
              active-value="0"
              inactive-value="1">
            </el-switch>
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="formmenu.displayOrder" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="URL">
            <el-input v-model="formmenu.url"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogMenuFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectMenu">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
  components: {
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    menuhtmls: {
      handler: function () {
        this.$refs.tree.filter(this.filterText)
      },
      deep: true
    }
  },
  data () {
    return {
      filterText: false,
      dialogMenuFormVisible: false,
      selectedRow: '',
      activeNames: '',
      menuhtml: [],
      menulist: [],
      parentList: [],
      props: {
        label: 'menuName',
        value: 'menuId',
        children: 'childList'
      },
      formmenu: {
        'displayOrder': 0,
        'icon': '',
        'menuId': '',
        'menuName': '',
        'menuType': '',
        'parentId': [],
        'parentArr': [],
        'perms': '',
        'url': '',
        'visible': '0'
      }
    }
  },
  computed: {
    tenantId () {
      let tenantId = this.$store.getters.GET_TENANTID
      return tenantId || ''
    }
  },
  methods: {
    isShow (value, data) {
      if (value && data.visible === '1') {
        return false
      }
      return true
    },
    addMenu () {
      this.formmenu = {
        'displayOrder': 0,
        'icon': '',
        'menuId': '',
        'menuName': '',
        'menuType': '',
        'parentId': [],
        'parentArr': [],
        'perms': '',
        'url': '',
        'visible': '0'
      }
      this.dialogMenuFormVisible = true
    },
    editMenu (val) {
      val.parentId = [val.parentId]
      Object.assign(this.formmenu, val)
      delete this.formmenu.children
      this.dialogMenuFormVisible = true
    },
    selectMenuVisible (val) {

    },
    handleChange (val) {

    },
    selectMenu (val) {
      let params = { ...this.formmenu }
      console.log(params)
      let pid = params.parentArr.reverse()[0]
      // params.parentId = params.parentId.pop();
      params.parentId = pid || '0'
      delete params.childList
      delete params.parentArr
      delete params.key
      console.log(params)
      this._api({
        url: 'addorupd',
        webType: 'menu',
        type: 'post',
        params: params,
        urlAppend: 1
      }).then(
        res => {
          this.dialogMenuFormVisible = false
          this.$message({ type: 'info', message: '保存成功' })
          this.getMenuList()
        },
        err => {
          console.log(err)
          this.$message({ type: 'error', message: '保存失败' })
        }
      )
    },
    getMenuList () {
      this._api({
        url: 'listAllTree',
        webType: 'menu',
        type: 'post'
      }).then(
        res => {
          this.cleardata(res.data)
        },
        err => {
          console.log(err)
        }
      )
    },
    cleardata (menuhtmls) {
      function clear (array, key) {
        array.forEach((itm, idx) => {
          itm.key = itm.parentId === '0' ? '0' : `${key}-${itm.parentId}`
          itm.parentArr = itm.key.split('-')
          if (itm.childList.length > 0) {
            clear(itm.childList, itm.key)
          } else {
            delete itm.childList
          }
        })
      }
      clear(menuhtmls, '0')
      console.log(menuhtmls)
      this.menuhtml = menuhtmls
    },
    getMenuListAll () {
      this._api({
        url: 'listAll',
        webType: 'menu',
        type: 'post',
        params: { tenantId: this.tenantId }
      }).then(
        res => {
          this.menulist = res.data
        },
        err => {
          console.log(err)
        }
      )
    }
  },
  mounted: function () {
    this.getMenuList()
    this.getMenuListAll()
  },
  destroyed () {

  }
}
</script>
