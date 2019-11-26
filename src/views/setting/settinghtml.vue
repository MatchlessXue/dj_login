<template>
    <div style="padding:0 20px;">
        <el-table :data="rolelist" stripe style="width: 100%">
            <el-table-column prop="roleName" label="角色" > </el-table-column>
            <el-table-column  label="操作" width="300">
                <template slot-scope="scope">
                    <el-button @click="selectMenuVisible(scope.row)">菜单权限设置</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="菜单角色权限" :visible.sync="dialogFormVisible">
            <el-tree
                ref="tree"
                :data="menuhtml"
                show-checkbox
                node-key="menuId"
                :default-expanded-keys="[]"
                :default-checked-keys="checkedkeys"
                :props="props">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectMenu">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script type="text/javascript">
export default {
  name: 'setting',
  components: {
  },
  data () {
    return {
      dialogFormVisible: false,
      dialogMenuFormVisible: false,
      selectedRow: '',
      activeNames: '',
      menuhtml: [],
      rolelist: [],
      checkedkeys: [],
      props: {
        label: 'menuName',
        children: 'childList'
      },
      formmenu: {
        'displayOrder': 0,
        'icon': '',
        'menuId': '',
        'menuName': '',
        'menuType': '',
        'parentId': '',
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
    editMenu (val) {
    },
    selectMenuVisible (val) {
      this.selectedRow = val
      // this.dialogFormVisible = true;
      this.getRoleMenuList()
    },
    selectMenu () {
      let _keys = this.$refs['tree'].getCheckedKeys()
      let _param = { menus: _keys,
        roleId: this.selectedRow.roleId,
        tenantId: this.tenantId
      }
      this._api({
        url: 'addupdaterole',
        webType: 'role',
        type: 'post',
        params: _param,
        urlAppend: 1
      }).then(
        res => {
          this.$message({ type: 'info', message: 'success' })
          this.dialogFormVisible = false
        },
        err => {
          this.$message({ type: 'error', message: 'error' })
          console.log(err)
        }
      ).catch(err => {
        this.$message({ type: 'error', message: 'error' })
        console.log(err)
      })
    },
    getUserInfo (res) {
      this._api({
        url: 'accountinfo',
        webType: 'root',
        type: 'post'
      }).then(
        res => {
          this.mainUserInfo = res.data
          this.menuhtml = res.data.menuList
        },
        err => {
          console.log(err)
        }
      ).catch(err => {
        console.log(err)
      })
    },
    handleChange (val) {

    },
    getRoleList () {
      this._api({
        url: 'listAll',
        webType: 'role',
        type: 'post',
        params: { tenantId: this.tenantId }
      }).then(
        res => {
          this.rolelist = res.data
        },
        err => {
          console.log(err)
        }
      ).catch(err => {
        console.log(err)
      })
    },
    getRoleMenuList () {
      this._api({
        url: 'rolemenulist',
        webType: 'role',
        type: 'post',
        params: {
          roleId: this.selectedRow.roleId
        }
      }).then(
        res => {
          this.dialogFormVisible = true
          let tempData = [];
          (res.data || []).forEach(function (itm, idx) {
            tempData.push(itm.menuId)
          })
          this.checkedkeys = tempData
        },
        err => {
          console.log(err)
        }
      ).catch(err => {
        console.log(err)
      })
    }
  },
  mounted: function () {
    this.getUserInfo()
    this.getRoleList()
  },
  destroyed () {

  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">

</style>
