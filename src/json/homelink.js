export default {
  flow: [
    {
      name: '添加运单',
      icon: '',
      url: '/waybill/#/waybill/add',
      permissions: false
    }, {
      name: '导入运单',
      icon: '',
      url: '/waybill/#/waybill',
      search: '?showImportTemplate=true',
      permissions: false
    }, {
      name: '运单调度',
      icon: '',
      url: '/dispatch/#/dispatch',
      permissions: false
    }, {
      name: '运单跟踪',
      icon: '',
      url: '/track/#/index',
      permissions: false
    }, {
      name: '回单管理',
      icon: '',
      url: '/track/#/receipt',
      permissions: false
    }, {
      name: '客户对账',
      icon: '',
      url: '/finance/#/settle/customer',
      permissions: false
    }, {
      name: '承运商对账',
      icon: '',
      url: '/finance/#/settle/carrier',
      permissions: false
    }, {
      name: '司机对账',
      icon: '',
      url: '/finance/#/settle/driver',
      permissions: false
    }
  ],
  dashboardItem: [
    {
      url: '/dispatch/#/dispatch',
      name: '待调度运单',
      type: 'dispatch',
      number: 'pickup'
    }, {
      url: '/track/#/index',
      fullUrl: '/track/#/onTheWay',
      name: '运输中的运单',
      type: 'waybill',
      number: 'trace'
    }, {
      url: '/track/#/receipt',
      name: '待回单',
      type: 'receipt',
      number: 'receipt'
    }
  ]
}
