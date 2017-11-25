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
  }))
  .listen(2334)
