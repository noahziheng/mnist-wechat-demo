'use strict'
const Koa = require('koa')
const wechat = require('co-wechat')

const app = new Koa()

const config = {
  token: 'THE TOKEN',
  appid: 'THE APPID',
  encodingAESKey: 'THE ENCODING AES KEY'
}

app
  .use(wechat(config).middleware(async (message, ctx) => {
    console.log(message)
  }))
  .listen(2334)
