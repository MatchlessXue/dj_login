<template>
    <div>
        <el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="400px"
            :before-close="handleClose">
            <template>
                <el-form ref="formline" :inline="true" label-width="100px" :model="formInline" class="demo-form-inline" :rules="rules">
                    <el-form-item label="当前密码" prop="currentPassword">
                        <el-input v-model="formInline.currentPassword" show-password type="password" placeholder="请输入当前密码"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPassword" >
                        <el-input v-model="formInline.newPassword" show-password type="password" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <div style="margin-bottom:10px;padding-left:100px;">
                        <span style="display:inline-block;vertical-align: 6px;">密码强度</span>
                        <div style="display:inline-block;width:calc(100% - 140px);">
                            <el-progress :show-text='false' :text-inside="true"  :stroke-width="18" :percentage="pwdstate.percent" :status="pwdstate.color+''"></el-progress>
                        </div>
                    </div>
                    <el-form-item label="确认新密码" prop="confirmPassword">
                        <el-input v-model="formInline.confirmPassword" show-password type="password" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="modify">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'md5'
import CONFIG from '@/config'
import lstore from '@/utils/lstore'
export default {
  name: 'modify-pass',
  props: {
    isvisible: Boolean
  },
  data () {
    let that = this
    let checkpass = (rule, value, callback) => {
      if (value !== that.formInline.newPassword) {
        let tip = '确认密码和新密码不一致'
        callback(tip)
        return
      }
      callback()
    }
    return {
      pwdstate: {
        percent: 0,
        color: 'text'
      },
      formInline: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      dialogVisible: this.isvisible,
      rules: {
        currentPassword: [{ required: true, message: '请输入当前使用密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, message: '不少于6个字符', trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { min: 6, message: '不少于6个字符', trigger: 'blur' }, { validator: checkpass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    onSubmit () {

    },
    handleClose () {
      this.formInline.currentPassword = ''
      this.formInline.newPassword = ''
      this.formInline.currentPassword = ''
      this.setVisible()
    },
    setVisible () {
      this.dialogVisible = false
      this.$emit('close', false)
    },
    getPasswordLevl () {
      var val = this.formInline.newPassword
      var strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[-_]).*$', 'g')
      var mediumRegex = new RegExp('^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$', 'g')
      var enoughRegex = new RegExp('(?=.{6,}).*', 'g')
      if (enoughRegex.test(val) === false) {
        // 密码小于六位的时候，强度也是弱的
        this.pwdstate.percent = 33
        this.pwdstate.color = 'exception'
      } else if (strongRegex.test(val)) {
        // 密码为八位及以上并且字母数字特殊字符三项都包括,强度最强
        this.pwdstate.percent = 100
        this.pwdstate.color = 'success'
      } else if (mediumRegex.test(val)) {
        // 密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
        this.pwdstate.percent = 66
        this.pwdstate.color = 'text'
      } else {
        // 如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的
        this.pwdstate.percent = 33
        this.pwdstate.color = 'exception'
      }
    },
    modify () {
      this.$refs['formline'].validate((valid) => {
        if (valid) {
          this.updatepass()
        }
      })
    },
    updatepass () {
      let that = this
      let _param = { ...this.formInline }
      _param.currentPassword = md5(_param.currentPassword)
      _param.newPassword = md5(_param.newPassword)
      _param.confirmPassword = md5(_param.confirmPassword)
      this._api({
        url: 'modifyPassword',
        webType: 'accounts',
        type: 'post',
        params: _param
      }).then(res => {
        if (!res.code) {
          that.handleClose()
          lstore.remove(CONFIG.accessRecord)
          that.$router.push({ path: '/login' })
        }
      },
      err => {
        that.$message({ type: 'error', message: err.message })
      }
      )
    }
  },
  watch: {
    'formInline.newPassword': function () {
      this.getPasswordLevl()
    },
    isvisible (newval, oldval) {
      this.dialogVisible = newval
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
