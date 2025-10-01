export default {
  pages: [
    'pages/login/index',
    'pages/dataReportList/index',
    'pages/dataReportDetail/index',
    'pages/qualityControl/index',
    'pages/qualityDetail/index',
    'pages/departmentList/index',
    'pages/departmentForm/index',
    'pages/patientList/index',
    'pages/patientAdd/index',
    'pages/patientDetail/index',
    'pages/index/index',
    'pages/dataReport/index',
    'pages/oralAI/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '督查',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    custom: true,
    color: '#999999',
    selectedColor: '#007aff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        pagePath: 'pages/dataReportList/index',
        text: '数据上报'
      },
      {
        pagePath: 'pages/qualityControl/index',
        text: '督查'
      },
      {
        pagePath: 'pages/oralAI/index',
        text: '口腔AI'
      }
    ]
  }
}