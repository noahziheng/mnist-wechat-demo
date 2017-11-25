'use strict'
const Koa = require('koa')
const wechat = require('co-wechat')

const app = new Koa()

const config = {
  token: 'noahwechattoken',
  appid: 'wx5ef5f11fc7b49498'
}

app
  .use(wechat(config).middleware(async (message, ctx) => {
    console.log(message)
    if (message.MsgType === 'image') {
      return 'OK!'
    } else if (message.MsgType === 'text') {
      if (message.Content === 'MNIST') return 'MNIST服务状态：OK'
      else return message.Content
    } else {
      return ''
    }
  }))
  .listen(2334)
