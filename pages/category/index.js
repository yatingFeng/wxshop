// pages/category/index.js

// 引入用来发送请求的方法（路径一定要完整）
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据的数组
    leftMenuList: [],
    // 右侧商品数据的数组
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // scroll-view标签距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 由于商品页请求数据过多，所以采用缓存技术
    // 先判断一下本地存储中有没有旧的数据；{time:Date.now(),data:[...]}
    // 如果没有旧数据，直接发送请求
    // 有旧的数据并且旧的数据没有过期就使用本地存储中的旧数据即可

    // 1.获取本地存储中的数据（小程序中也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 判断本地存储中没有数据，发送请求获取数据
      this.getCates();
    } else {
      // 本地存储中有旧数据时，判断数据有没有过期，如果数据过期了也要重新发送请求
      if (Date.now() - Cates.time > 100000) {
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data
        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据方法
  async getCates() {
    // request({
    //   url: "/categories"
    // })
    //   .then(res => {
    //     this.Cates = res.data.message
    //     // 把接口的数据存入到本地存储中
    //     wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.Cates.map(v => v.cat_name)
    //     // 构造右侧的商品数据
    //     let rightContent = this.Cates[0].children
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })
    //   })

    // 使用es7的async await来发送请求
    const res = await request({ url: '/categories' })
    this.Cates = res
    // 把接口的数据存入到本地存储中
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates })
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name)
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 获取被点击的标题身上的索引
    // 给data中的currentIndex赋值,并重新赋值右侧商品
    const { index } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })

  },
})