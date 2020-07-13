<template>
  <div class="order_buy content_view_box">
    <div class="header_title">
      <el-form :inline="true" :model="searchForm" label-position="left">
        <el-form-item label="TraceId">
          <el-input v-model.trim="searchForm.traceId" clearable placeholder="请输入traceId" @keyup.enter.native="searchFuc()"></el-input>
        </el-form-item>
        <el-form-item label="调用时间">
          <el-date-picker
            v-model="searchForm.timeRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFuc()" size="medium">搜索</el-button>
          <el-button @click="clearForm(searchForm)" size="medium">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <filter-table
      @changePagination="changePagination"
      :isExpand="true"
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
  name: 'order-buy',
  data () {
    return {
      tableData: {
        loaded: false,
        total: 0,
        pagination: {},
        data: []
      },
      searchForm: {
        traceId: '',
        timeRange: ''
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      fields: [
        {
          align: 'center',
          label: 'traceId',
          minWidth: 170,
          prop: 'traceId'
        },
        {
          align: 'center',
          label: '请求url',
          minWidth: 240,
          prop: 'requestUrl'
        },
        {
          align: 'center',
          label: '调用时间',
          minWidth: 120,
          prop: 'startTimeStr'
        },
        {
          align: 'center',
          label: '耗时（ms）',
          minWidth: 80,
          prop: 'during'
        },
        {
          type: 'expand',
          align: 'center',
          label: '请求参数：',
          prop: 'requestBodyStr',
          labelWidth: 140
        },
        {
          type: 'expand',
          align: 'center',
          label: '响应数据：',
          prop: 'responseBodyStr',
          labelWidth: 140
        },
        {
          type: 'expand',
          align: 'center',
          label: '调用服务信息：',
          prop: 'selfStr',
          labelWidth: 140
        },
        {
          type: 'expand',
          align: 'center',
          label: '被调用服务信息：',
          prop: 'remoteStr',
          labelWidth: 140
        },
        {
          type: 'expand',
          align: 'center',
          label: '异常信息：',
          prop: 'exceptionStr',
          labelWidth: 140
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
      if (searchForm.timeRange) {
        searchForm['startTime'] = searchForm.timeRange[0]
        searchForm['endTime'] = searchForm.timeRange[1]
      }
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
        item.startTimeStr = this.$formatDate(item.startTime)
        item.responseBodyStr = this.$formatJson(item.responseBody)
        item.requestBodyStr = this.$formatJson(item.requestBody)
        item.selfStr = this.$formatJson(item.self)
        item.remoteStr = this.$formatJson(item.remote)
        let exceptionStr = item.exception && item.exception.length > 0 ? item.exception.replace(/\n/g, '<br>').replace(/\t/g, '<span style="margin-left: 20px">&nbsp;</span>') : null
        if (exceptionStr) {
          exceptionStr = exceptionStr.replace(/\((.*?)\)/img, '(<span style="color: skyblue">$1</span>)')
          exceptionStr = '<div style="line-height: 18px; font-size: 14px; color: indianred">' + exceptionStr + '</div>'
        }
        item.exceptionStr = exceptionStr
      })
      return data
    },
    getTableList (params, formData = {}) {
      _common.queryTraceLog(Object.assign(params, formData)).then((res) => {
        this.tableData.data = res.data || []
        this.tableData.total = res.total
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
