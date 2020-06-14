
// 运算优先级
const priority = {
  "+" : 1,
  "-" : 1,
  "*" : 2,
  "/" : 2,
  ")" : 3,
  "(" : 0
}

// pages/calc/calc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formula: '',
    numStk : [],
    optStk: [],
    result: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  clickBtn: function (e) {
    this.data.result !== '' && this.setData({result: ''}) 
    let value = e.target.id
    if (value.startsWith('num') || value.startsWith('op')) {
      let index = value.indexOf('_')
      let num = value.slice(index + 1)
      this.setData({
        formula: this.data.formula += num
      })
    }
    if (value.startsWith('fun')) {
      let index = value.indexOf('_')
      let op = value.slice(index + 1)
      switch (op) {
        case 'history':
          this.nav2History()
          break
        case 'cls':
          this.clsWindow()
          break
        case 'del':
          this.del()
          break
        case 'equal':
          this.computeResult()
          break
        default:
          break;
      }
    }
  },
  nav2History: function () {
    wx.navigateTo({
      url: '../history/history',
    })
  },
  clsWindow: function () {
    this.setData({
      formula: '',
      numStk: [],
      optStk: []
    })
  },
  del: function () {
    let length = this.data.formula.length
    this.setData({
      formula: length > 0 ? this.data.formula.substring(0, length - 1) : ''
    })
  },
  computeResult: function () {
    let length = this.data.formula.length 
    for (let i = 0; i < length; ++i) {
      if ('0' <= this.data.formula[i] && this.data.formula[i] <= 9) {
        console.log(this.data.formula[i]);
        this.data.numStk.push(this.data.formula[i])
      } else if (this.data.formula[i] === '(') {
        this.data.optStk.push(this.data.formula[i])
      } else if (this.data.formula[i] === '(') {
        let opt 
        while((opt = this.data.optStk.pop()) != '(') {
          let num2 = parseFloat(this.data.numStk.pop())
          let num1
          if (this.data.numStk.length === 0) {
            num1 = 1
          } else {
            num1 = parseFloat(this.data.numStk.pop())
          }
          let optRetNum = this.calc(num1, num2, opt)  
          this.data.numStk.push(optRetNum)
        }
      } else {
        if (this.data.optStk.length === 0 || this.data.optStk[this.data.optStk.length - 1]
          === '(')
          {
            this.data.optStk.push(this.data.formula[i])
          } else if (priority[this.data.formula[i]] > priority[this.data.formula.length - 1]) {
            this.data.optStk.push(this.data.formula[i])
          } else {
            let opt = this.data.optStk[this.data.optStk.length - 1]
            while (priority[opt] >= priority[this.data.formula[i]]) {
              let num2 = parseFloat(this.data.numStk.pop())
              let num1
              if (this.data.numStk.length === 0) {
                num1 = 0
              } else {
                console.log(this.data.numStk)
                num1 = parseFloat(this.data.numStk.pop())
              }

              let optRetNum = this.calc(num1, num2, opt)
              this.data.numStk.push(optRetNum)
              this.data.optStk.pop()
              if (this.data.optStk.length === 0) {
                break
              }
              opt = this.data.optStk[this.data.optStk.length - 1]
            }
            this.data.optStk.push(this.data.formula[i])
          }
      } 
    }

    while(this.data.optStk.length > 0) {
      let num2 = parseFloat(this.data.numStk.pop())
      let num1
      if (this.data.numStk.length === 0) {
        num1 = 0
      } else {
        num1 = parseFloat(this.data.numStk.pop())
      }
      let opt = this.data.optStk.pop()
      let optRetNum = this.calc(num1, num2, opt)
      this.data.numStk.push(optRetNum)
    }
    this.data.result = parseFloat(this.data.numStk.pop())
    this.setData({
      result: this.data.result
    })
    // 获取数据
    let history = wx.getStorageSync('history')
    if (!history) {
      history = []
    }
    history.push(`${this.data.formula}=${this.data.result}`)
    // 保存数据到缓存
    wx.setStorageSync('history', history)
    this.clsWindow()
    // 清空数组
    // this.data.numStk = []
  },
  convert2num: function (value, result) {
    let index = value.indexOf('_')
    let num = value.slice(index + 1)
    let mark = value.slice(0, index)
    while (mark !== 'op') {
      result += value
    }
  },
  calc: function(num1, num2, opt) {
    var r = 0;
		if (opt === '+') {
			r = num1 + num2
		}
		else if (opt === '-') {
			r = num1 - num2
		}
		else if (opt === '*') {
			r = num1 * num2
		}
		else if (opt === '/') {
			r = num1 / num2
		}
		else if (opt === '%') {
			r = num1 % num2
		}
		return r
  }
})