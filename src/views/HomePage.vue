<template>
  <div class="content_view_box">
    <div class="header_title">
      <p style="line-height: 50px">服务调用信息</p>
    </div>
    <el-divider content-position="center">调用统计</el-divider>
    <div class="block">
      <span class="demonstration">时间范围</span>
      <el-date-picker
        v-model="pieTimeRange"
        type="datetimerange"
        range-separator="至"
        value-format="timestamp"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="refreshPieChart"
      >
      </el-date-picker>
    </div>
    <el-divider content-position="left"></el-divider>
    <div class="content_view_box">
      <table width="100%">
        <tr style="width: 100%">
          <td style="width: 48%;">
            <div ref="systemCallChart" style="width: 100%; height: 400px;"></div>
          </td>
          <td style="width: 48%">
            <div ref="interfaceCallChart" style="width: 100%; height: 400px; float: left;"></div>
          </td>
        </tr>
      </table>
      <el-divider content-position="center">分时统计</el-divider>
      <div class="block">
        <span class="demonstration">时间范围:</span>
        <el-date-picker
          v-model="linearTimeRange"
          type="datetimerange"
          range-separator="至"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="refreshPieChart"
        >
        </el-date-picker>
        <span class="demonstration">系统名称:</span>
        <el-input placeholder="请输入系统名称(多个系统请用,隔开)" v-model="serverNameInput" style="width: 300px" clearable>
        </el-input>
        <span class="demonstration">接口名称:</span>
        <el-input placeholder="请输入接口uri(多个接口请用,隔开)" v-model="interfaceNameInput" style="width: 300px" clearable>
        </el-input>
        <el-button
          type="primary"
          style="margin-left: 20px"
          @click="refreshLinearChart(linearTimeRange,serverNameInput,interfaceNameInput)"
          plain>刷新</el-button>
      </div>
      <el-divider content-position="left"></el-divider>
      <table width="100%">
        <tr style="width: 100%">
          <td style="width: 48%;">
            <div ref="systemCallDetailChart" style="width: 100%; height: 400px; float:left; margin-top: 50px;"></div>
          </td>
          <td style="width: 48%">
            <div ref="interfaceCallDetailChart" style="width: 100%; height: 400px; float: left;"></div>
          </td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script>
import chart from 'echarts'
import { _common } from '@/api'

export default {
  name: 'homePage',
  data () {
    return {
      systemCallChart: null,
      interfaceCallChart: null,
      systemCallDetailChart: null,
      interfaceCallDetailChart: null,
      hourTime: 60 * 60 * 1000,
      pieTimeRange: [],
      linearTimeRange: [],
      serverNameInput: null,
      interfaceNameInput: null,
      pie: {
        title: {
          text: '系统调用统计',
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
          formatter: function (param) {
            console.log(param)
            let returnValue = ''
            if (param.data.server !== param.name) {
              returnValue += '<span style="color: bisque">系统名:' + param.data.server + '</span><br/>'
              returnValue += '<span style="color:skyblue">接口名:' + param.name + '</span><br/>'
            } else {
              returnValue += '<span style="color:skyblue">系统名:' + param.name + '</span><br/>'
            }
            returnValue += '<span style="color: orange">总调用数:' + param.value + ' (' + param.percent + '%)</span><br>'
            returnValue += '<span style="color:cyan">成功笔数:' + param.data.success + '</span><br/>'
            returnValue += '<span style="color:yellow">失败笔数:' + param.data.fail + '</span>'
            return returnValue
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '访问统计',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      linear: {
        title: {
          text: '系统调用详情'
        },
        dataZoom_bak: [
          {
            show: true,
            realtime: true,
            start: 0,
            end: 100
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
          }
        ],
        tooltip: {// 折点显示信息重新设置
          trigger: 'axis',
          formatter: function (params) {
            let v = params[0].name
            for (let i = 0, len = params.length; i < len; i++) {
              let span = '<span style="display:inline-block;margin-right:5px;'
              span += 'border-radius:10px;width:9px;height:9px;background-color:' + params[i].color + '"></span>'
              v = v + '<br>' + span + params[i].seriesName + ' : ' + params[i].value
            }
            return v
          }
        },
        legend: {
          data: ['销量', '成交']
        },
        xAxis: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLabel: {
            rotate: 30,
            formatter: function (msg) {
              return msg.slice(-4, -2) + '日' + msg.slice(-2) + '点'
            }
          }
        },
        yAxis: {// 设置单位
          axisLabel: {
            rotate: 30,
            formatter: '{value}'
          }
        },
        series: []
      }
    }
  },
  mounted () {
    this.systemCallChart = chart.init(this.$refs.systemCallChart)
    this.systemCallChart.setOption(this.pie)
    this.interfaceCallChart = chart.init(this.$refs.interfaceCallChart)
    this.pie.title.text = '接口调用统计'
    this.interfaceCallChart.setOption(this.pie)
    let now = new Date().getTime()
    this.pieTimeRange.push(now - 3 * 24 * this.hourTime, now)
    this.refreshPieChart(this.pieTimeRange)
    // 折线图实现
    this.linearTimeRange.push(now - 5 * this.hourTime, now)
    this.systemCallDetailChart = chart.init(this.$refs.systemCallDetailChart)
    // this.systemCallDetailChart.setOption(this.linear)
    this.interfaceCallDetailChart = chart.init(this.$refs.interfaceCallDetailChart)
  },
  methods: {
    refreshPieChart (v) {
      _common.getSystemCallStatistics({ startTime: v[0], endTime: v[1], type: '1', top: 10 }).then((result) => {
        this.pie.title.text = '系统调用统计'
        this.changePieOption(result, this.systemCallChart)
      })
      _common.getSystemCallStatistics({ startTime: v[0], endTime: v[1], type: '2', top: 10 }).then((result) => {
        this.pie.title.text = '接口调用统计'
        this.changePieOption(result, this.interfaceCallChart)
      })
    },
    changePieOption (v, chart) {
      let legend = []
      let value = []
      v.forEach((vv) => {
        let name = vv.uri
        if (!name) {
          name = vv.serverName
        }
        legend.push(name)
        value.push({ value: vv.totalCount, name: name, success: vv.successCount, fail: vv.failCount, server: vv.serverName })
      })
      this.pie.legend.data = legend
      if (this.pie.title.text === '系统调用统计') {
        this.serverNameInput = legend.join(',')
        this.refreshLinearChart(this.linearTimeRange, this.serverNameInput, this.interfaceNameInput)
      } else {
        this.interfaceNameInput = legend.slice(0, 3).join(',')
        this.refreshLinearChart(this.linearTimeRange, this.serverNameInput, this.interfaceNameInput)
      }
      this.pie.series[0].data = value
      chart.setOption(this.pie)
    },
    refreshLinearChart (v, serverNames, interfaceNames) {
      if (serverNames) {
        _common.getSystemCallDetail({ startTime: v[0], endTime: v[1], type: '1', serverName: serverNames, top: 10 }).then((result) => {
          this.linear.title.text = '系统调用详情'
          this.changeLinerOption(result, this.systemCallDetailChart, 'bar', 'serverName')
        })
      }
      if (interfaceNames) {
        _common.getSystemCallDetail({ startTime: v[0], endTime: v[1], type: '2', serverName: interfaceNames, top: 10 }).then((result) => {
          this.linear.title.text = '接口调用详情'
          this.changeLinerOption(result, this.interfaceCallDetailChart, 'line', 'uri')
        })
      }
    },
    changeLinerOption (v, chart, linerType, property) {
      let xAlisData = []
      let series = []
      let legend = []
      let once = true
      v.forEach((vv) => {
        let serie = { name: vv[property], type: linerType, data: [] }
        legend.push(vv[property])
        let totalCount = vv.totalCount
        for (let k in totalCount) {
          if (once) {
            xAlisData.push(k)
          }
          serie.data.push(totalCount[k])
        }
        once = false
        series.push(serie)
      })
      this.linear.xAxis.data = xAlisData
      this.$set(this.linear, 'series', series)
      this.linear.legend.data = legend
      chart.setOption(this.linear, true)
    }
  }
}
</script>

<style scoped lang="scss">
  .demonstration {
    margin-right: 10px;
    margin-left: 15px;
    font-size: 16px;
  }

  .block {
    margin-bottom: 15px;
  }
</style>
