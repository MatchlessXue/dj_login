<!-- 多选/单选下拉框 带搜索功能
  参考earlyWarning.vue 页面的搜索功能
  用法：<search-select  v-model="searchData.advertiser" :multiple="true" :dataList="data" :searchAttr="['id','name']" placeholder="placeholder">
            <template slot-scope="props">
                <el-option v-for="(item,index) in props.list" :key="item.id" :label="item.id+'-'+item.name" :value="item.id" :class="{selected:props.selected}"></el-option>
            </template>
        </search-select >
-->
<template>
    <div class="search_select_container">
        <!-- {{selectValue}} -->
        <el-select :value="selectValue" :disabled="disabled" class="search_select" :popper-class="dropdownclass" @input="$emit('input',arguments[0])"
        :multiple="multiple" collapse-tags :placeholder="placeholder" @change="selectChange" @visible-change="visibleChange">
            <el-input v-model="searchText" size="mini" placeholder="keyword" class="select_search"></el-input>
            <div class="select_btn" v-if="multiple">
                <div class="select_btn_inner clearfix">
                    <el-button class="fl" size="mini" @click="selectAll" :disabled="checkAll">Select all</el-button>
                    <el-button class="fr" size="mini" @click="deleteAll" :disabled="!isDelete">Delete all</el-button>
                </div>
            </div>
            <el-option class="place_option" v-show="multiple" label="" value="" disabled></el-option>
            <el-option v-if="hasAll"  label="All" value="" ></el-option>
            <slot :list="filterList" :selected="checkAll"></slot>
        </el-select>
    </div>
</template>

<script>
import emitter from 'element-ui/src/mixins/emitter'
import { removeArrayItem } from '../frame/util.js'
export default {
  name: 'search-select',
  componentName: 'search-select',
  mixins: [emitter],
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  data () {
    return {
      selectValue: this.multiple ? (this.value || []) : (this.value || ''),
      list: [],
      filterList: [],
      checkAll: false,
      searchText: ''
    }
  },
  props: {
    dataList: {
      type: Array,
      required: true
    },
    // 是否允许有all选项
    hasAll: {
      type: Boolean,
      default: false
    },
    value: { required: true },
    placeholder: String,
    /* 按照那些属性搜索 */
    searchAttr: [String, Array],
    /* 是否多选 */
    multiple: {
      type: Boolean,
      default: true
    },
    /* 选中value属性名 */
    valueAttr: {
      type: String,
      default: 'id'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dropdownclass: {
      type: String,
      default: ''
    }
  },
  computed: {
    /* 过滤后的id */
    listId () {
      let newArr = []
      this.filterList.forEach(item => {
        newArr.push(item[this.valueAttr])
      })
      return newArr
    },
    /* 是否禁用删除按钮 */
    isDelete () {
      if (this.multiple) {
        let selectNum = this.selectValue.length
        return selectNum > 0
      }
      return false
    },
    /* 可搜索的属性名 */
    attrs () {
      if (typeof this.searchAttr === 'string') {
        return this.searchAttr.slice('')
      }
      return this.searchAttr
    }
  },
  created () {
    if (this.multiple && !Array.isArray(this.value)) {
      this.emitChange([])
    }
    //  debugger
    if (!this.multiple && Array.isArray(this.value)) {
      this.emitChange('')
    }
  },
  mounted () {
    this.list = this.dataList
    this.filterList = this.dataList
  },
  methods: {
    /* 自定义搜索过滤 */
    filterMethod (text) {
      let attrs = this.attrs
      let list = [...this.list]
      let copy_text = text && text.toLowerCase()
      let textArr = []
      copy_text.replace(/([^\s,，]+)/g, (match, p1) => {
        textArr.push(p1)
      })

      if (textArr.length > 0) {
        let filterList = []
        textArr.forEach(item => {
          item = item.toString()
          let newList = list.filter(item2 => {
            for (let i = 0; i < attrs.length; i++) {
              let attr = attrs[i]
              let value = item2[attr].toString().toLowerCase()
              if (value.search(item) > -1) {
                return true
              }
            }
          })
          filterList = [...filterList, ...newList]
        })
        /* 去重 */
        var unique = {}
        filterList.forEach(gpa => {
          unique[JSON.stringify(gpa)] = gpa
        })
        filterList = Object.keys(unique).map(u => {
          return JSON.parse(u)
        })
        this.filterList = filterList
      } else {
        this.filterList = list
      }
    },
    /* 选中chanage */
    selectChange (value) {
      if (this.multiple) {
        if (this.hasAll && value.length && value.length > 1 && value.includes('all')) {
          value.shift()
        }
        if (value.length && value.includes('all')) {
          this.deleteAll('emitFromAll')
          value = ['all']
        }
      }

      this.$emit('change', value)
      this.emitChange(value)
    },

    /* 全选 */
    selectAll () {
      let selectValue = [...this.selectValue, ...this.listId]
      this.selectValue = Array.from(new Set(selectValue)) // 去重
      this.checkAll = true
      // 如果有all选项  则同时置为all  其余的不选择
      if (this.hasAll) {
        selectValue = ['all']
        this.selectValue = ['all']
      }
      this.emitChange(selectValue)
    },
    /* 删除全选 */
    deleteAll (emitFromAll) {
      /* 删除掉过滤出来的id */
      let ids = this.listId
      ids.forEach(item => {
        let i = this.selectValue.indexOf(item)
        if (i > -1) {
          this.selectValue.splice(i, 1)
        }
      })
      this.checkAll = false
      // 如果是有all选项 并且是由反选按钮 触发的事件 则给selectvalue置空
      if (this.hasAll && emitFromAll != 'emitFromAll') {
        this.selectValue = []
      }
      this.emitChange(this.selectValue)
    },
    emitChange (val) {
      this.$emit('input', val)
      this.dispatch('ElFormItem', 'el.form.change', val)
      // this.$emit("input", val);
    },
    /* 下拉框显示隐藏 */
    visibleChange (visible) {
      if (!visible) {
        this.searchText = ''
      }
    }
  },
  watch: {
    selectValue (newValue, oldValue) {
      // 判断全选状态
      if (this.multiple) {
        let checkedCount = newValue.length
        if (this.list.length > 0) {
          this.checkAll = checkedCount === this.list.length
        }
      }
      this.$emit('input', newValue)
      this.dispatch('ElFormItem', 'el.form.change', newValue)
    },
    value: {
      handler (val, oldVal) {
        // debugger
        this.selectValue = val
        // this.broadcast("ElInput", "inputSelect");  //影响  select 默认选中选不上，所以注释掉
      },
      deep: true
    },
    searchText (newValue, oldValue) {
      this.filterMethod(newValue)
    },
    dataList (newValue, oldValue) {
      this.list = newValue
      this.filterList = newValue
      // 判断全选状态
      if (this.multiple) {
        let checkedCount = this.selectValue.length
        if (newValue.length > 0) {
          this.checkAll = checkedCount === newValue.length
        }
      }
    }
  }
}
</script>
<style lang='scss'>
@import "../assets/style/vars.scss";
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after{
    right: 15px;
}
.search_select_container {
    position: relative;
    .search_select {
        position: relative;
        width: 100%;
    }
    .el-select__tags {
        width: 100% !important;
        max-width: 100% !important;
        & > span {
            display: inline-block;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
        }
    }
    .el-tag--small {
        height: 22px;
    }
    .el-select .el-tag {
        margin: 2px 0 0px 4px;
        .el-select__tags-text {
            float: left;
            height: 20px;
            line-height: 20px;
        }
    }
    .el-select .el-tag__close.el-icon-close {
        position: absolute;
        top: 4px;
        right: 2px;
    }
    .el-tag:first-child {
        display: inline-block;
        position: relative;
        // width: 64%;
        min-width: 50%;
        max-width: 64%;
        overflow: hidden;
        white-space: nowrap;
        .el-select__tags-text {
            // display: inline-block;
            float: left;
            text-overflow: ellipsis;
            width: 80%;
            overflow: hidden;
            white-space: nowrap;
        }
    }
}
.el-select-dropdown {
    .el-select-dropdown__item.place_option {
        height: 40px;
    }
    .el-select-dropdown__list {
        padding: 8px 0;
        position: relative;
    }
    .el-select-dropdown__item {
        font-size: $bodyFont !important;
        height: $lineHeight;
        line-height: $lineHeight;
        padding-right:  35px;
        span {
            line-height: $lineHeight !important;
        }
    }
    .select_search {
        padding: 0px 10px 0;
        .el-input__inner {
            line-height: 14px;
            padding-top: 7px;
            padding-bottom: 7px;
        }
    }
    .select_btn {
        position: absolute;
        z-index: 10;
        width: 100%;
        padding: 0 10px;
        margin-top: 5px;
        .select_btn_inner {
            text-align: center;
        }
    }
    button.el-button {
        width: 49%;
        &:not(.is-disabled) {
            border: unset;
        }
    }
    .el-button + .el-button {
        margin-left: 0px;
    }
}
</style>
