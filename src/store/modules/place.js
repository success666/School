import { placeList, placeEdit, defaultPlace, addPlace, placeDetail, placeTemplate, fieldstandardDocument } from '@/api/place'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const place = {
  state: {
    id: '',
    token: getToken(),
    name: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    }
  },

  actions: {
    // 场地列表查询
    PlaceList({ commit }, place) {
      return new Promise((resolve, reject) => {
        placeList(place).then(response => {
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
    // 场地编辑
    PlaceEdit({ commit }, place) {
      return new Promise((resolve, reject) => {
        placeEdit(place).then(response => {
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
    // 获取默认场地
    DefaultPlace({ commit }, place) {
      return new Promise((resolve, reject) => {
        defaultPlace(place).then(response => {
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
    // 场地新增
    AddPlace({ commit }, place) {
      return new Promise((resolve, reject) => {
        addPlace(place).then(response => {
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
    // 场地详情
    PlaceDetail({ commit }, place) {
      return new Promise((resolve, reject) => {
        placeDetail(place).then(response => {
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
    // 场地-下载模版
    PlaceTemplate({ commit }) {
      return new Promise((resolve, reject) => {
        placeTemplate().then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response.data)
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
    // 场地配置达标准参考链接
    fieldstandardDocument({ commit }) {
      return new Promise((resolve, reject) => {
        fieldstandardDocument().then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response.data)
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

export default place
