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
      <el-table-column label="操作" width="230px">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="downServer(scope.row)">下线</el-button>
          <el-button type="primary" plain @click="upServer(scope.row)">上线</el-button>
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
          label: 'ip地址',
          minWidth: 170,
          prop: 'ip'
        },
        {
          align: 'center',
          label: '端口号',
          minWidth: 80,
          prop: 'serverPort'
        },
        {
          align: 'center',
          label: '心跳间隔时间',
          minWidth: 80,
          prop: 'heartbeatDistance'
        },
        {
          align: 'center',
          label: '当前状态',
          minWidth: 80,
          prop: 'status'
        },
        {
          align: 'center',
          label: '最后心跳时间',
          minWidth: 80,
          prop: 'lastHeartbeatStr'
        },
        {
          align: 'center',
          label: '最后上线时间',
          minWidth: 80,
          prop: 'lastUpTimeStr'
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
      _common.queryServerInfo(Object.assign(params, formData)).then((res) => {
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
    },
    downServer ({ serverName }) {
      this.$alert(serverName + '下线功能暂时不可用', '温馨提示', {
        confirmButtonText: '确定'
      })
    },
    upServer ({ serverName }) {
      this.$alert(serverName + '上线功能暂时不可用', '温馨提示', {
        confirmButtonText: '确定'
      })
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
