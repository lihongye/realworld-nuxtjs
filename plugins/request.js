/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'
// 创建请求对象

export const request = axios.create({
  baseURL: 'http://realworld.api.fed.lagounews.com'
})

// 通过插件机制获取到上下文对象
export default ({ store }) => {
  request.interceptors.request.use(function (config) {
    const { user } =store.state
    if (user && user.token){
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })
}

