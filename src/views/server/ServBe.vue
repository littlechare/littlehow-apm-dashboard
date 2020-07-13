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
  name: 'apm-dependence-serv-be',
  data () {
    return {
      tableData: {
        loaded: false,
        total: 0,
        pagination: {},
        data: []
      },
      searchForm: {
        serverName: ''
      },
      fields: [
        {
          align: 'center',
          label: '应用名',
          minWidth: 170,
          prop: 'serverName'
        },
        {
          align: 'center',
          label: '被依赖服务名',
          minWidth: 170,
          prop: 'dependenceServerName'
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
      _common.queryBeDependenceServer(Object.assign(params, formData)).then((res) => {
        this.tableData.data = res || []
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
