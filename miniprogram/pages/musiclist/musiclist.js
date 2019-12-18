// pages/musiclist/musiclist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '这次有点慢！',
    })
    console.log(options)
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistID,
        $url: 'musiclist'
      }
    }).then((res) => {
      console.log(res)
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name,
          description: pl.description
        }
      })
      // console.log(this.data.listInfo)
      this._setMusiclist()
      wx.hideLoading()
    })

  },
  // 数据缓存
  _setMusiclist() {
    wx.setStorageSync('musiclist', this.data.musiclist)

  }

})