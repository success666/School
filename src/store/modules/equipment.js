import { details, defalut, addEquipment, editEquipment, exportEquipment, equipmentTemplate, standardDocument } from '@/api/equipment'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const equipment = {
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
    // 器材详情
    Details({ commit }, params) {
      return new Promise((resolve, reject) => {
        details(params).then(response => {
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
    // 获取默认器材（用于新增前的展示页面）
    Defalut({ commit }) {
      return new Promise((resolve, reject) => {
        defalut().then(response => {
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
    // 新增器材
    addEquipment({ commit }, params) {
      return new Promise((resolve, reject) => {
        addEquipment(params).then(response => {
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
    // 编辑器材
    editEquipment({ commit }, params) {
      return new Promise((resolve, reject) => {
        editEquipment(params).then(response => {
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
    // 导出器材
    exportEquipment({ commit }, params) {
      return new Promise((resolve, reject) => {
        exportEquipment(params).then(response => {
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
    // 器材-下载模版
    EquipmentTemplate({ commit }) {
      return new Promise((resolve, reject) => {
        equipmentTemplate().then(response => {
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
    // 器材配置达标准参考链接
    standardDocument({ commit }) {
      return new Promise((resolve, reject) => {
        standardDocument().then(response => {
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

export default equipment
