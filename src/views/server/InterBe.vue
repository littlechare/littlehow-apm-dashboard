<template>
  <div class="order_buy content_view_box">
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
  name: 'apm-dependence-inter-be',
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
      _common.queryBeDependenceInterface(Object.assign(params, formData)).then((res) => {
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
        uri: this.$route.params.uri
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
