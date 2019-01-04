import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_YAPI, // api的base_url
  timeout: 10000, // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.status.code === 500) {
      Message({
        message: res.status.msg,
        type: 'error',
        duration: 2000
      })
      return Promise.reject('error')
    } else if (res.status.code === 2010001) {
      Message({
        message: res.status.msg,
        type: '登录信息失效，重新登录',
        duration: 2000
      })
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
      return Promise.reject('error')
    } else if (res.status.code === 2010006) {
      MessageBox({
        message: '<div>账号已停用，请联系客服电话</div><div>4008003403</div>',
        title: '提示',
        center: true,
        dangerouslyUseHTMLString: true
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
    // const res = response.data
    // if (res.status.code !== 200) {
    //   Message({
    //     message: res.status.msg,
    //     type: 'error',
    //     duration: 2000
    //   })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload()// 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      // return Promise.reject('error')
    // } else {
    //   return response.data
    // }
  },
  error => {
    // console.log('err' + error) // for debug
    Message({
      message: '请求失败',
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
