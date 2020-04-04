// pages/goods_detail/index.js
// 引入用来发送请求的方法（路径一定要完整）
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
// 点击加入购物车思路：
// 1.绑定点击事件 2.获取缓存中的购物车数据（数组格式）
// 3.判断当前的商品是否已存在于购物车
// 4.已存在的，修改商品数据（购物车数量++）,重新把购物车数组填充回缓存中
// 5.不存在购物车的数组中，直接给购物车数组添加一个新元素（带上购买的属性num）,
//    重新把购物车数组填充回缓存中
// 6.给用户弹出提示

/**
 * 收藏功能思路
 * 1.页面onShow的时候，加载缓存中的商品收藏的数据
 * 2.判断该商品是否被收藏？是：改变图标；否：无操作
 * 3.点击收藏商品按钮：判断该商品是否存在于缓存中？是：把该商品从收藏数组中删除，切换图标；
 *      否：把商品添加到收藏数组中，存入到缓存中即可，切换图标
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 是否被收藏
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // onshow中无法项onload直接获取options参数：需要获取页面栈来获取options
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1]
    let options = currentPage.options
    
    const {goods_id} = options
    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({
      url:"/goods/detail",
      data:{goods_id}
    })
    this.GoodsInfo = goodsObj
    // 获取缓存中商品收藏的数组(有可能是空数组，这里做一下类型转换)
    let collect = wx.getStorageSync("collect")||[]
    // 判断商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // 如果后台给的数据中有webp格式的图片，苹果手机是不支持的
        // 解决办法替换（确保后台存在1.webp=>1.jpg）
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics,
      },
      isCollect
    })
  },

  //点击轮播图 放大图片
  handlePreviewImage(e){
    // 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
  //  接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current:current,
      urls:urls
    })
  },

  // 加入购物车函数
  handleCartAdd(){
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart")||[]
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    if(index===-1){
      // 不存在，第一次添加
      this.GoodsInfo.num=1
      this.GoodsInfo.checked=true
      cart.push(this.GoodsInfo)
    }else{
      // 已经存在购物车中，执行num++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart",cart)
    // 弹窗提示
    wx.showToast({
      title:'加入成功',
      icon:'success',
      mask:true,
    })
  },
  // 点击商品收藏图标
  handleCollect(){
    let isCollect = false;
    // 1.获取缓存中的商品收藏数组
    let collect  = wx.getStorageSync("collect")||[]
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    // 3.当index不为-1时，证明收藏数组中已有该商品
    if(index!==-1){
      // 能找到，已经收藏过了，在数组中删除该商品
      collect.splice(index,1)
      isCollect=false
      wx.showToast({
        title:"取消成功",
        icon:'success',
        mask:true
      })
    }else{
      // 没有收藏过
      collect.push(this.GoodsInfo)
      isCollect=true
      wx.showToast({
        title:"收藏成功",
        icon:'success',
        mask:true
      })
    }
    // 4.把数组存入缓存中
    wx.setStorageSync("collect",collect)
    // 5.修改data中的属性 isCollect
    this.setData({
      isCollect
    })
  }
})