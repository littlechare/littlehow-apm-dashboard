const filters = {
  toFixed (amount = 0, fix = 6) { // 保留小数
    return Number(String(amount).match(new RegExp(`^\\d+(?:\\.\\d{0,${fix}})?`)) || 0)
  },
  moment (value, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!value) return ''
    return window.moment(value).format(format)
  }
}
const install = Vue => Object.entries(filters).forEach(([key, func]) => Vue.filter(key, func))

export default {
  filters,
  install
}
