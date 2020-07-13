<template>
  <div class="order_buy content_view_box">
    <div class="header_title">
      <el-form :inline="true" :model="searchForm" label-position="left">
        <el-form-item label="服务名">
          <el-input v-model.trim="searchForm.serverName" clearable placeholder="请输入服务名" @keyup.enter.native="searchFuc()"></el-input>
        </el-form-item>
        <el-form-item label="依赖服务名">
          <el-input v-model.trim="searchForm.dependenceServerName" clearable placeholder="请输入依赖服务名" @keyup.enter.native="searchFuc()"></el-input>
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
    </filter-table>
  </div>
</template>

<script>
import FilterTable from '@/components/FilterTable.vue'
import { _common } from '@/api'

export default {
  name: 'apm-dependence-detail',
  data () {
    return {
      tableData: {
        loaded: false,
        total: 0,
        pagination: {},
        data: []
      },
      searchForm: {
        serverName: '',
        dependenceServerName: ''
      },
      history: [],
      fields: [
        {
          align: 'center',
          label: '服务名',
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
          label: '依赖服务名',
          minWidth: 160,
          prop: 'dependenceServerName'
        },
        {
          align: 'center',
          label: '依赖接口名',
          minWidth: 120,
          prop: 'dependenceServerUri'
        }
      ]
    }
  },
  components: {
    FilterTable
  },
  created () {
    this.searchForm.serverName = this.$route.params.serverName
    this.searchForm.dependenceServerName = this.$route.params.dependenceServerName
  },
  methods: {
    changePagination (pagination) {
      this.tableData.pagination = pagination
      this.getTableData()
    },
    searchFuc () {
      this.getTableData()
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
      _common.queryDependenceDetail(Object.assign(params, formData)).then((res) => {
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
        serverName: this.$route.params.serverName,
        dependenceServerName: this.$route.params.dependenceServerName
      }, this.getSearchFormParams(this.searchForm))
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
