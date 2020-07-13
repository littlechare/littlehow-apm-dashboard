import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/Index.vue'
// 路由模块

Vue.use(Router)
/* meta中 group 字段用于menu中归属哪一个组 */
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      component: () =>
        import(/* webpackChunkName: "Not-found" */ '../views/NotFound.vue')
    },
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: { group: { path: '', name: '首页' }, title: '首页' },
      redirect: () => {
        return '/homePage'
      },
      children: [
        {
          path: '/homePage',
          name: 'homePage',
          meta: {
            group: { path: '/homePage', name: '首页' },
            title: '首页',
            isKeepAlive: true
          },
          component: () =>
            import(/* webpackChunkName: "homePage" */ '../views/HomePage.vue') // 后台首页
        },
        {
          path: '/apmc/traceLog',
          name: 'apm-traceLog',
          meta: { group: { path: '/apmc/traceLog', name: '调用日志' }, title: '调用日志', isKeepAlive: true },
          component: () => import(/* webpackChunkName: "apmc-traceLog" */ '@/views/log/Index.vue')
        },
        {
          path: '/apmc/dependence',
          name: 'apm-dependence',
          meta: { group: { path: '/apmc/dependence', name: '服务依赖信息' }, title: '服务信息', isKeepAlive: true },
          component: () => import(/* webpackChunkName: "apmc-dependence" */ '@/views/server/Index.vue')
        },
        {
          path: '/apmc/dependence/info/:serverName',
          name: 'apm-dependence-info',
          meta: { group: { path: '/apmc/dependence/info', name: '服务依赖信息' }, title: '服务详细信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-info" */ '@/views/server/ServerInfo.vue')
        },
        {
          path: '/apmc/dependence/interface/:serverName',
          name: 'apm-dependence-interface',
          meta: { group: { path: '/apmc/dependence/interface', name: '服务依赖信息' }, title: '接口详细信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-info" */ '@/views/server/InterfaceInfo.vue')
        },
        {
          path: '/apmc/dependence/serv/:serverName',
          name: 'apm-dependence-serv',
          meta: { group: { path: '/apmc/dependence/serv', name: '服务依赖信息' }, title: '服务依赖信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-serv" */ '@/views/server/Serv.vue')
        },
        {
          path: '/apmc/dependence/serv/be/:serverName',
          name: 'apm-dependence-serv-be',
          meta: { group: { path: '/apmc/dependence/servBe', name: '服务依赖信息' }, title: '服务被依赖信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-serv-be" */ '@/views/server/ServBe.vue')
        },
        {
          path: '/apmc/dependence/inter/:serverName',
          name: 'apm-dependence-inter',
          meta: { group: { path: '/apmc/dependence/inter', name: '服务依赖信息' }, title: '接口依赖信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-inter" */ '@/views/server/Inter.vue')
        },
        {
          path: '/apmc/dependence/inter/be/:serverName',
          name: 'apm-dependence-inter-be',
          meta: { group: { path: '/apmc/dependence/interBe', name: '服务依赖信息' }, title: '接口被依赖信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-inter-be" */ '@/views/server/InterBe.vue')
        },
        {
          path: '/apmc/dependence/detail/:serverName/:dependenceServerName',
          name: 'apm-dependence-detail',
          meta: { group: { path: '/apmc/dependence/detail', name: '服务依赖信息' }, title: '服务依赖详细信息' },
          component: () => import(/* webpackChunkName: "apmc-dependence-detail" */ '@/views/server/Detail.vue')
        }
      ]
    }
  ]
})
