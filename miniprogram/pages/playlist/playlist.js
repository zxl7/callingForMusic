// pages/palylist/palylist.js
const MAX_LIMIT = 15
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    // 轮播图
    playlist: [], //歌单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getPlaylist()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      playlist: []
    })
    this._getPlaylist()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  _getPlaylist() {
    wx.showLoading({
      title: '快马加鞭赶来啦',
    })

    // 向云服务请求获取歌单列表
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then((res) => {
      console.log(res)
      // 写入数据
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      // 停止当前页面下拉刷新
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})