// pages/cart/index.js
// 小程序内置api获取用户的收货地址  wx.chooseAddress
// 获取用户对小程序所授予获取地址的权限状态 scope
//1假设用户点击获取收货地址的提示框，确定的话 authSetting scope.address  scope值为true,直接获取地址
//2假设用户点击获取收货地址的提示框，取消的话  scope值为false
//  诱导用户自己打开授权设置页面，当用户重新给与收货地址权限的时候，获取收获地址
//3假设用户点击获取收货地址的提示框，取消的话  scope值为undefined，直接获取收获地址

import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },
  // 点击收货地址触发的事件
  async handleChooseAddress() {
    // wx.chooseAddress小程序内置的api用来调用用户的收货的地址
    // wx.chooseAddress({
    //   success: (result)=>{
    //     console.log(result)
    //   },
    // });
    // wx.getSetting({
    //   success:(result)=>{
    //     console.log(result)
    //   }
    // })

    // 1.获取权限状态
    // wx.getSetting({
    //   success:(result)=>{
    //     // 获取权限状态时，发现一些属性名很怪异的时候，要用[]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if(scopeAddress===true||scopeAddress===undefined){
    //       wx.chooseAddress({
    //         success: (result1)=>{
    //           console.log(result1)
    //         },
    //       });
    //     }else{
    //       // 用户 以前拒绝过授予权限，先诱导用户打开授权页面
    //         wx.openSetting({
    //           success:(result2)=>{
    //             wx.chooseAddress({
    //               success: (result3)=>{
    //                 console.log(result3)
    //               },
    //             });
    //           }
    //         })
    //     }
    //   }
    // })

    // 1.获取权限状态
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    // 2.判断权限状态
    if (scopeAddress === false) {
      await openSetting();
    }
    const address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
    // 将获取到的地址放入缓存中
    wx.setStorageSync("address", address)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取本地存储中的地址数据，把数据设置给data中的一个变量
    const address = wx.getStorageSync("address")
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || []
    // // 计算全选
    // // const allChecked  =cart.length?cart.every(v=>v.checked):false
    // let allChecked  = true
    // // 总价格 总数量
    // let totalPrice=0;
    // let totalNum=0;
    // cart.forEach(v=>{
    //   // 计算总价格和总数量的前提是：商品被选中
    //   if(v.checked){
    //     totalPrice+=v.num*v.goods_price
    //     totalNum+=v.num
    //   }else{
    //     allChecked  = false
    //   }
    // })
    // // 判断数组是否为空
    // allChecked=cart.length!=0?allChecked:false
    // // 给data赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    this.setData({ address })
    this.setCart(cart)
  },

  // 商品单选框发生改变时
  handleItemChange(e) {
    // 1.获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2.获取购物车数组
    let { cart } = this.data
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id)
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },

  // 全选按钮发生变化时
  handleItemAllCheck() {
    // 获取data中的数据
    let { cart, allChecked } = this.data
    // 修改值
    allChecked = !allChecked
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 把修改后的值填充回data或者缓存中
    this.setCart(cart)
  },

  // 商品数量编辑
  async handleItemNumEdit(e) {
    // 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cart } = this.data
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 进行数量修改之前，判断是否等于1，等于1 弹窗提示用户是否删除
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: "是否想要删除？" })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 进行数量修改
      cart[index].num += operation
    }
    // 设置回缓存和data中
    this.setCart(cart)
  },

  // 点击结算按钮
  async handlePay() {
    // 1先判断有无收获地址
    const {address,totalNum} =this.data
    if(!address){
      await showToast({title:"您还没有选择收货地址"})
      return
    }
    // 2再判断有无选购的商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品哦`"})
      return
    }
    //3跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    }); 
  },

  //设置购物车状态 重新计算 价格等等
  setCart(cart) {
    //1 计算全选
    //const allChecked = cart.length?cart.every(v => v.checked):false;
    let allChecked = true;
    //1 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    //判断数组为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },
})