/**
 * Created by xxxxtech on 2018/7/23.
 */
import { getGrade, getClass } from '@/api/common'
import { Message } from 'element-ui'

const common = {
  state: {
  },
  actions: {
    // 获取年级列表
    GetGrade({ commit }) {
      return new Promise((resolve, reject) => {
        getGrade().then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取年级列表
    GetClass({ commit }, data) {
      return new Promise((resolve, reject) => {
        getClass(data).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
          } else {
            Message({
              message: response.status.msg,
              type: 'error',
              duration: 2 * 1000
            })
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default common
