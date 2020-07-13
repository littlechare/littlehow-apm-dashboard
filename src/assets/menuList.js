export default [
  {
    iconCls: 'el-icon-money',
    menuId: '1',
    menuName: '日志管理',
    request: null,
    children: [
      {
        iconCls: null,
        menuId: '2',
        menuName: '远程调用日志',
        request: '/apmc/traceLog'
      }
    ]
  },
  {
    iconCls: 'el-icon-s-data',
    menuId: '11',
    menuName: '服务信息',
    request: null,
    children: [
      {
        iconCls: null,
        menuId: '12',
        menuName: '服务信息',
        request: '/apmc/dependence'
      }
    ]
  }
]
