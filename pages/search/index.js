/**
 * 输入框绑定事件（值改变事件 input事件）
 * 1.获取到输入框的值
 * 2.合法性判断
 * 3.校验通过，把输入框的值发送到后台
 * 4.返回的数据打印到页面上
 * 
 * 防抖 （用定时器来解决）
 * 防抖：一般是输入框中，防止重复输入、防止重复发送请求
 * 节流：一般是用在页面下拉和上拉
 * 1.定义全局的定时器id
 * 
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
    // 用来存放搜索的结果
    goods: [],
    // 控制按钮的显示 与隐藏
    isFocus:false,
    // 输入框中的值
    inpValue:'',
  },
  TimeId: -1,
  // 输入框的值改变时触发的事件
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail
    // 检测合法性
    if (!value.trim()) {
      // 值不合法时，数组重置，按钮隐藏
      clearTimeout(this.TimeId)
      this.setData({
        goods:[],
        isFocus: false
      })
      return
    }
    // 显示按钮
    this.setData({
      isFocus: true
    })
    // 先清空定时器，在开启定时器，一秒之后发送请求
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      // 准备发送请求
      this.qsearch(value)
    }, 1000)
  },
  // 发送请求获取搜索数据
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } })
    this.setData({
      goods: res
    })
  },
  //点击取消按钮，输入框和数组中的值清空、图标隐藏 
  handleCancel(){
    this.setData({
      inpValue:'',
      goods:[],
      isFocus:false
    })
  }
})