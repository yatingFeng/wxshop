// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    // 被收藏的商品数量
    collectNums:0,
  },

  onShow(){
    // 从缓存中获取到信息
    const userinfo = wx.getStorageSync("userinfo")
    // 从缓存中获取到收藏的商品数组信息
    const collect = wx.getStorageSync("collect")||[]
    this.setData({userinfo,collectNums:collect.length})
  }
})