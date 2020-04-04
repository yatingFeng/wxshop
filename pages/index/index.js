//Page Object

// 引入用来发送请求的方法（路径一定要完整）
import { request } from "../../request/index.js";

Page({
  data: {
    // 存放轮播图数据
    swiperList: [],
    // 存放导航数据
    catesList: [],
    // 存放楼层数据
    floorList:[],
  },

  //options(Object)
  // onLoad页面开始加载，就会触发此函数
  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },

  // 获取轮播图数据方法
  getSwiperList() {
    // 1.发送异步请求获取轮播图数据
    // wx.request({
    //   url:'/home/swiperdata',
    //   success:(result) => {
    //     // 成功请求后，将获取到的值赋值给存放轮播图的数组
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   }
    // })
    request({
      url: "/home/swiperdata"
    })
      .then(result => {
        this.setData({
          swiperList: result
        })
      })
  },

  // 获取导航数据方法
  getCatesList() {
    request({
      url: "/home/catitems"
    })
      .then(result => {
        this.setData({
          catesList: result
        })
      })
  },

  // 获取楼层数据方法
  getFloorList() {
    request({
      url: "/home/floordata"
    })
      .then(result => {
        this.setData({
          floorList: result
        })
      })
  },
});