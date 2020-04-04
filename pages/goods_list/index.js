// pages/goods_list/index.js

// 上拉加载思路：用户上滑页面 滚动条触底 开始加载下一页数据
// 1.找到滚动条触底事件 2.判断还有没有下一页数据
// 3.假如没有下一页数据，弹出提示；
// 4.加入还有下一页数据，来加载下一页数据

// 下拉刷新页面：重置数据清空数组，重置页码为1,重新发送请求

// 引入用来发送请求的方法（路径一定要完整）
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs数据
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    // 商品列表数据
    goodsList:[],
  },
  
  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  // 总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList()
  },

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams})
    //获取总条数
    const total= res.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 拼接了数组
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新的窗口
      wx.stopPullDownRefresh()
  },

  // 子组件传递过来的tabs点击事件
  handleTabsItemChange(e){
    console.log(e)
    // 获取被点击的标题索引
    const {index} = e.detail
    // 修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false)
    // 赋值
    this.setData({
      tabs
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 发送请求
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   *  页面上滑，滚动条触底事件
   */
  onReachBottom: function () {
    // 判断还有没有下一页数据（通过比较当前页码和总页码）
    if(this.QueryParams.pagenum >= this.totalPages){
      //当前页码大于或等于总页码时，代表没有数据了
      wx.showToast({
        title: '我是有底线的...',
        icon: 'none',
      });
    }else{
      // 有下一页数据，重新发送请求
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})