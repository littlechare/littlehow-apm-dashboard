import { Message } from 'element-ui'

let showMessage = true
export const errorFuc = (error) => {
  if (error.response && error.response.status === 401) {
    if (showMessage) {
      showMessage = false
      Message.error('登录已失效！')
      setTimeout(() => {
        showMessage = true
      }, 1000)
      sessionStorage.clear()
    }
  } else if ((error.response && error.response.status === 403)) {
    Message.error('您的权限不足，无权限操作，请联系管理员！')
  } else if (error.message.indexOf('timeout') > -1) {
    Message.error('请求超时！')
  }
  return Promise.reject(error.response)
}
