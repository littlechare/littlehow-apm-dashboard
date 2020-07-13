import { errorFuc } from './httpError'
import axios from 'axios'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求拦截
axios.interceptors.request.use(
  config => {
    config.headers.terminal = sessionStorage.terminal
    config.headers['X-B3-Traceid'] = window.moment().valueOf() * 1000
    config.headers['X-B3-Spanid'] = window.moment().valueOf() * 1000
    if (sessionStorage.token) { config.headers['Boss-Token'] = sessionStorage.token }
    NProgress.start()
    return config
  },
  error => Promise.reject(error)
)
// 响应拦截
axios.interceptors.response.use(
  ({ data }) => {
    NProgress.done()
    return data
  },
  error => {
    NProgress.done()
    return Promise.reject(errorFuc(error))
  }
)

export const opt = options => {
  // const CancelToken = axios.CancelToken
  if (!options.method) options.method = 'post'
  return axios({
    ...options,
    timeout: 80000
  }).then(res => {
    if (res && (res.code === '000000' || res.respCode === '000000')) {
      return res.data
    } else {
      res.message && Message.error(res.message)
      return Promise.reject(res.message)
    }
  })
}

export { default as _common } from './modules/common'
