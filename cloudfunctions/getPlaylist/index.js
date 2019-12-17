// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 初始化云数据库
const db = cloud.database()

// 发送请求数据的方法
const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist') //获取 playlist 集合

// 每次请求数量
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async(event, context) => {
  // const list = await playlistCollection.get() //原有数据
  // console.log(list)
  
  const countResult = await playlistCollection.count() // 获取总的数据  对象格式
  const total = countResult.total //转换为数字格式

  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 请求发起的次数
  const tasks = [] //任务对象，放入promise数组 
  for (let i = 0; i < batchTimes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get() //第几条开始取数据,去多少条
    tasks.push(promise)
  }

  let list = {
    data: []
  }
  // 数据赋值
  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 获取最新歌单信息
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  // console.log(playlist)

  //  获取参数去重 
  let newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
      if (flag) {
        newData.push(playlist[i])
      }
  }

  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({ //插入数据，data是参数，异步所以加上await
      data: {
        ...newData[i], // 循环插入
        createTime: db.serverDate(), //插入数据的服务器时间
      }
    }).then((res) => {
      console.log(res)
      console.log('插入成功')
    }).catch((err) => {
      console.error('插入失败 ')
    })
  }
  return newData.length
}