module.exports = {
  theme:"",
  plugins: ['autobar'],
  title: "法号-梦遗",
  description: "前端技术博客",
  base: "/books/",
  plugins: ['permalink-pinyin', ['autobar', {'pinyinNav': true}], 'rpurl'],
  head: [
    ["link",{ rel: "icon",href: "/assets/logo1.png" }]
  ],
  markdown: {
    lineNumbers: false,
  },
  themeConfig: {
    smoothScroll: true,
    // nav: require("./config/nav"),
    // sidebar: {
    //     '/front/': [{
    //       title: '前端分类',
    //       collapsable: false,
    //       children: [
    //         {
    //           title: 'Javascript',
    //           children: [
    //             'javascript/prototype',
    //             'javascript/callStack',
    //             'javascript/this'
    //           ]
    //         }
    //       ]
    //     }, {
    //       title: '源码分析',
    //       collapsable: false,
    //       children: [
    //         'codeAnalysis/',
    //         'codeAnalysis/lru-cache'
    //       ],
    //     }],    
    // },
    lastUpdated: "Last Updated",
    repo: "https://github.com/Paulhejia/books/",
    editLinks: false,
  },
};