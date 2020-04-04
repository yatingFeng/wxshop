// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs数据
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false
      },
    ],
    // 收藏商品数据
    collect:[]
  },
  onShow(){
    const collect = wx.getStorageSync("collect")||[]
    this.setData({
      collect
    })
  },
  // 子组件传递过来的tabs点击事件
  handleTabsItemChange(e) {
    // 获取被点击的标题索引
    const { index } = e.detail
    // 修改原数组
    let { tabs } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值
    this.setData({
      tabs
    })
  },
})