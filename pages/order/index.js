// pages/order/index.js
/**
 * 页面被打开的时候（onShow）：
 * 判断缓存中有无token,无跳转到授权页面，有往下进行
 * 获取url上的参数type,根据type去发送请求获取订单数据，渲染页面
 * 点击不同的标题时：重新发送请求渲染数据
 */
// 引入用来发送请求的方法（路径一定要完整）
import { request } from "../../request/index.js";
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs数据
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      },
    ],
    // 存放订单的数组
    orders: []
  },


  onLoad(options) {
    console.log(options);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(options) {
    // const token = wx.getStorageSync("token")
    // if (!token) {
    //   wx.navigateTo({
    //     url: '/pages/auth/index',
    //   });
    //   return
    // }
    // onshow中无法接受参数options,只有在onload中可以，
    // 那如何获取到url中的type参数呢？
    // 1.获取当前小程序的页面栈-数组，长度最大是10，数组中索引最大的页面就是当前页面
    let pages = getCurrentPages();
    // 2.在当前页面中可以拿到参数options
    let currentPage = pages[pages.length - 1];
    // 3.获取url上的参数
    const { type } = currentPage.options
    // 激活选中页面标题 当type=1时index=0
    this.changeTitleByindex(type-1)
    this.getOrders(type);
  },
    //获取订单列表的方法
    async getOrders(type) {
      const res = await request({ url: "/my/orders/all", data: { type } })
      console.log(res)
      this.setData({
        // 对日期做处理
        orders: res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
      })
    },
  // 根据标题索引来激活选中标题数组
  changeTitleByindex(index) {
    // 修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值
    this.setData({
      tabs
    })
  },
  // 子组件传递过来的tabs点击事件
  handleTabsItemChange(e) {
    console.log(e)
    // 获取被点击的标题索引
    const { index } = e.detail
    this.changeTitleByindex(index)
    // 重新发送请求 type=1时index=0
    this.getOrders(index+1)
  },
})