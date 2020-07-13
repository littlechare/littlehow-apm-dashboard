<template>
  <div class="order_buy content_view_box">
    <div class="header_title">
      <el-form :inline="true" :model="searchForm" label-position="left">
        <el-form-item label="接口名">
          <el-input v-model.trim="searchForm.interfaceName" clearable placeholder="请输入接口名" @keyup.enter.native="searchFuc()"></el-input>
        </el-form-item>
        <el-form-item label="类名">
          <el-input v-model.trim="searchForm.className" clearable placeholder="请输入类名" @keyup.enter.native="searchFuc()"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFuc()" size="medium">搜索</el-button>
          <el-button @click="clearForm(searchForm)" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <filter-table
      :isShowPagination="false"
      @changePagination="changePagination"
      :isExpand="false"
      :loaded="tableData.loaded"
      :tableData="tableData.data"
      :fields="fields"
      :total="tableData.total"
      :currentPageSizes="[10, 20, 50, 100, 200, 300, 400, 500]"
      layout="total, sizes, prev, pager, next, jumper">
      <el-table-column label="操作" width="260px">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="interfaceDependence(scope.row)">依赖接口</el-button>
          <el-button type="primary" plain @click="interfaceBeDependence(scope.row)">被依赖接口</el-button>
        </template>
      </el-table-column>
    </filter-table>
  </div>
</template>

<script>
import FilterTable from '@/components/FilterTable.vue'
import { _common } from '@/api'

export default {
  name: 'apm-dependence-info',
  data () {
    return {
      tableData: {
        loaded: false,
        total: 0,
        pagination: {},
        data: []
      },
      searchForm: {
        interfaceName: '',
        className: ''
      },
      history: [],
      fields: [
        {
          align: 'center',
          label: '应用名',
          minWidth: 160,
          prop: 'serverName'
        },
        {
          align: 'center',
          label: '接口名称',
          minWidth: 160,
          prop: 'uri'
        },
        {
          align: 'center',
          label: '类名',
          minWidth: 160,
          prop: 'className'
        },
        {
          align: 'center',
          label: '方法名',
          minWidth: 120,
          prop: 'methodName'
        },
        {
          align: 'center',
          label: '接口说明',
          minWidth: 120,
          prop: 'serviceExplain'
        }
      ]
    }
  },
  components: {
    FilterTable
  },
  created () {
  },
  methods: {
    changePagination (pagination) {
      this.tableData.pagination = pagination
      this.getTableData()
    },
    searchFuc () {
      this.tableData.pagination.pageIndex = 1
      let orig = [].concat(this.history)
      let interfaceName = this.searchForm.interfaceName
      let className = this.searchForm.className
      if (interfaceName || className) {
        this.tableData.data = orig.filter((item) => {
          let flag = false
          if (interfaceName) {
            flag = item.uri === interfaceName
          }
          if (className) {
            flag = flag || item.className === className
          }
          return flag
        })
      } else {
        this.tableData.data = this.history
      }
    },
    clearForm (form) {
      this.$emptyObjValue(form)
      this.searchFuc()
    },
    getSearchFormParams (searchForm) {
      let obj = {}
      for (let key in searchForm) {
        if (searchForm.hasOwnProperty(key) && searchForm[key] && key !== 'timeRange') {
          obj[key] = searchForm[key]
        }
      }
      return obj
    },
    dataHandel (data = []) {
      data.forEach(item => {
        item.lastHeartbeatStr = this.$formatDate(item.lastHeartbeat)
        item.lastUpTimeStr = this.$formatDate(item.lastUpTime)
      })
      return data
    },
    getTableList (params, formData = {}) {
      _common.queryInterface(Object.assign(params, formData)).then((res) => {
        this.tableData.data = res || []
        this.history = this.tableData.data
        // this.tableData.total = res.total
        this.tableData.loaded = true
        this.dataHandel(this.tableData.data)
      }).finally(() => {
        this.tableData.loaded = true
      })
    },
    getTableData () {
      this.getTableList({
        pageIndex: this.tableData.pagination.pageIndex,
        pageSize: this.tableData.pagination.pageSize,
        serverName: this.$route.params.serverName
      }, this.getSearchFormParams(this.searchForm))
    },
    interfaceDependence ({ uri, serverName }) {
      this.$router.push({ name: 'apm-dependence-inter', params: { uri: uri, serverName: serverName } })
    },
    interfaceBeDependence ({ uri, serverName }) {
      this.$router.push({ name: 'apm-dependence-inter-be', params: { uri: uri, serverName: serverName } })
    }
  }
}
</script>
<style lang="scss">
  .order_buy{
    .el-table thead th:last-child{
      text-align: center
    }
    .reject-reson{
      margin-top: 30px;
    }
  }
</style>
