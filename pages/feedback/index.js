// pages/feedback/index.js
/**
 * 上传图片思路解析（点击加号上传图片）
 * 1.调用小程序内置的选择图片api
 * 2.获取到图片的路径（数组）
 * 3.把图片路径存到data的变量中
 * 4.页面就可以根据图片数组进行循环显示
 * 
 * 删除上传的图片思路：
 * 1.获取被点击的元素的索引
 * 2.获取data中的数组图片
 * 3.根据索引，在数组中删除图片路径
 * 4.把数组重新设置回data中
 * 
 * 点击提交按钮，提交意见时：
 * 1.获取文本域的内容（data中定义变量表示输入的内容，文本域绑定事件，事件触发时把文本域的值存入变量）
 * 2.对这些内容进行合法性验证
 * 3.验证通过，将用户选择的图片图片上传到专门的图片的服务器返回图片外网的链接
 *    便利图片数组挨个上传，自己再维护图片数组，存放图片上传后的外网链接
 * 4.将文本域和外网图片的路径一起提交到服务器
 * 5.清空当前页面并返回到上一页
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tabs数据
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      },
    ],
    // 存放图片路径的数组
    chooseImgs: [],
    // 文本域的内容
    textVal: '',
  },
  // 外网的图片的路径数组
  UpLoadImgs: [],
  // 子组件传递过来的tabs点击事件
  handleTabsItemChange(e) {
    console.log(e)
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
  // 点击+选择图片
  handleChooseImg() {
    // 小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式：原图、压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源：相册、相机
      sourceType: ['album', 'camera'],
      // 成功之后的回调
      success: (result) => {
        this.setData({
          // 图片数组进行拼接（第二次上传时是拼接而不是覆盖）
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      },
      fail: () => { },
      complete: () => { }
    })
  },
  // 点击自定义图片组件，删除
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset;
    // 获取data中的图片数组
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },
  //文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  //提交意见按钮事件
  handleFormSubmit() {
    // 1.获取文本域的内容
    const { textVal, chooseImgs } = this.data;
    // 2.合法性验证（去掉两端空格后判断是否为空）
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '请输入合法内容',
        icon: 'none',
        mask: true,
      });
      return
    }
    // 3.准备上传图片到专门的服务器
    // 小程序内置的api文件上传每次只能上传一个文件，所以遍历的方式来上传文件
    wx.showLoading({
      title: '正在上传中....',
      mask: true,
    });
    // 判断有没有需要上传的数组 
    if(chooseImgs.length != 0){
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://images.ac.cn/Home/Index/UploadAction/',
          // 被上传的文件的路径
          filePath: v,
          //上传的文件的名称，后台来获取文件
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result)
            let url =JSON.parse (result.data).url
            this.UpLoadImgs.push(url)
            // 所有的图片都上传完毕了才触发
            if(i===chooseImgs.length-1){
              // 关闭弹窗
              wx.hideLoading();
              consoloe.log('把文本的内容和外网的图片数组提交至后台中')
              // 重置页面并返回上衣页面
              this.setData({
                textVal:'',
                chooseImgs:[]
              })
              wx.navigateBack({
                delta:1
              })
            }
          },
        });
      })
    }else{
      // 没有需要上传的图片
      console.log('只是提交了文本')
        // 关闭弹窗
        wx.hideLoading()
        wx.navigateBack({
          delta:1
        })
    }  
  }
})