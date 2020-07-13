<template>
  <div class="order_buy content_view_box">
    <div class="header_title">
      <el-form :inline="true" :model="searchForm" label-position="left">
        <el-form-item label="服务名">
          <el-input v-model.trim="searchForm.serverName" clearable placeholder="请输入服务名" @keyup.enter.native="searchFuc()"></el-input>
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
      <el-table-column label="操作" width="460px">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="goServerDetail(scope.row)">服务详情</el-button>
          <el-button type="primary" plain @click="goInterfaceDetail(scope.row)">接口详情</el-button>
          <el-button type="primary" plain @click="goServerDependence(scope.row)">依赖服务</el-button>
          <el-button type="primary" plain @click="goServerBeDependence(scope.row)">被依赖服务</el-button>
        </template>
      </el-table-column>
    </filter-table>
  </div>
</template>

<script>
import FilterTable from '@/components/FilterTable.vue'
import { _common } from '@/api'

export default {
  name: 'apm-dependence',
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
          label: '应用中文名',
          minWidth: 170,
          prop: 'serverNameCn'
        },
        {
          align: 'center',
          label: '服务数量',
          minWidth: 80,
          prop: 'serverCount'
        },
        {
          align: 'center',
          label: '服务上线数',
          minWidth: 80,
          prop: 'serverUp',
          textColor: 'green'
        },
        {
          align: 'center',
          label: '服务下线数',
          minWidth: 80,
          prop: 'serverDown',
          textColor: 'red'
        },
        {
          align: 'center',
          label: '应用root',
          minWidth: 80,
          prop: 'contextPath'
        },
        {
          align: 'center',
          label: '展示名',
          minWidth: 80,
          prop: 'displayName'
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
      })
      return data
    },
    getTableList (params, formData = {}) {
      _common.queryServerBase(Object.assign(params, formData)).then((res) => {
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
        pageSize: this.tableData.pagination.pageSize
      }, this.getSearchFormParams(this.searchForm))
    },
    goServerDetail ({ serverName }) {
      this.$router.push({ name: 'apm-dependence-info', params: { serverName: serverName } })
    },
    goInterfaceDetail ({ serverName }) {
      this.$router.push({ name: 'apm-dependence-interface', params: { serverName: serverName } })
    },
    goServerDependence ({ serverName }) {
      this.$router.push({ name: 'apm-dependence-serv', params: { serverName: serverName } })
    },
    goServerBeDependence ({ serverName }) {
      this.$router.push({ name: 'apm-dependence-serv-be', params: { serverName: serverName } })
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
