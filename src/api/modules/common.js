import { opt } from '../index'

const baseURL = '/apm/'

export default {
  getSystemCallStatistics: (data = {}) => opt({ url: '/collection/dashboard/statistics/queryCall', data, baseURL }),
  getSystemCallDetail: (data = {}) => opt({ url: '/collection/dashboard/statistics/queryDetail', data, baseURL }),
  queryTraceLog: (data = {}) => opt({ url: '/collection/dashboard/log/queryTraceLog', data, baseURL }),
  queryServerBase: (data = {}) => opt({ url: '/collection/dashboard/server/baseList', data, baseURL }),
  queryServerInfo: (data = {}) => opt({ url: '/collection/dashboard/server/infoList', data, baseURL }),
  queryInterface: (data = {}) => opt({ url: '/collection/dashboard/server/interfaceList', data, baseURL }),
  queryDependenceServer: (data = {}) => opt({ url: '/collection/dashboard/dependence/server', data, baseURL }),
  queryBeDependenceServer: (data = {}) => opt({ url: '/collection/dashboard/dependence/serverBe', data, baseURL }),
  queryDependenceInterface: (data = {}) => opt({ url: '/collection/dashboard/dependence/interface', data, baseURL }),
  queryBeDependenceInterface: (data = {}) => opt({ url: '/collection/dashboard/dependence/interfaceBe', data, baseURL }),
  queryDependenceDetail: (data = {}) => opt({ url: '/collection/dashboard/dependence/detail', data, baseURL })
}
