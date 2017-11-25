'use strict'
const Koa = require('koa')
const wechat = require('co-wechat')

const app = new Koa()

const config = {
  token: 'noahwechattoken',
  appid: 'wx42738ccb58ad7249',
  encodingAESKey: 'gtGR775o8hab3T1vzciw00aX1zu0MyPyKfSavzzcBC0'
}

app
  .use(wechat(config).middleware(async (message, ctx) => {
    console.log(message)
  }))
  .listen(2334)
