/**
 * Created by xxxxtech on 2018/7/17.
 */
import { healthTemplate, getHealthItemDetail, getHealthList, deleteHealthItem, updateHealthSelves, deleteBatchHealth, updateBatchHealth, addHealth } from '@/api/physical'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { formatDate } from '@/utils/index'

const health = {
  state: {
    id: '',
    token: getToken(),
    name: '',
    schoolYearStart: 0,
    schoolYearEnd: 0,
    classId: '',
    schoolId: '',
    gradeId: '',
    schoolYear: '',
    pageNum: '',
    pageSize: '',
    files: [],
    schoolName: '',
    schoolGradeName: '',
    schoolClassName: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_SACHOOL_YEAR_START: (state, schoolYearStart) => {
      state.schoolYearStart = schoolYearStart
    },
    SET_SACHOOL_YEAR_END: (state, schoolYearEnd) => {
      state.schoolYearEnd = schoolYearEnd
    },
    SET_CLASS_ID: (state, classId) => {
      state.classId = classId
    },
    SET_SCHOOL_ID: (state, schoolId) => {
      state.schoolId = schoolId
    },
    SET_GRADE_ID: (state, gradeId) => {
      state.gradeId = gradeId
    },
    SET_FILES: (state, files) => {
      state.files = files
    },
    SET_SCHOOL_NAME: (state, schoolName) => {
      state.schoolName = schoolName
    },
    SET_SCHOOL_GRADE_NAME: (state, schoolGradeName) => {
      state.schoolGradeName = schoolGradeName
    },
    SET_SCHOOL_CLASS_NAME: (state, schoolClassName) => {
      state.schoolClassName = schoolClassName
    }
  },

  actions: {
    // 查询体检详情
    GetHealthItemDetail({ commit }, healthItem) {
      return new Promise((resolve, reject) => {
        getHealthItemDetail(healthItem).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            if (response.data == null) {
              Message({
                message: '查询失败',
                type: 'error',
                duration: 2 * 1000
              })
              return
            }
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
    // 查询体测列表
    GetHealthList({ commit }, health) {
      if (typeof health.schoolYear !== 'undefined') {
        const list = health.schoolYear.split('-')
        if (list.length > 0) {
          health.schoolYearStart = list[0]
          health.schoolYearEnd = list[1]
        }
      }
      return new Promise((resolve, reject) => {
        getHealthList(health).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            if (response.data) {
              const list = response.data.list
              list.forEach((item, value) => {
                item.healthExamTime = formatDate(item.healthExamTime, 'yyyy-MM-dd')
              })
            }
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
    // 删除体测
    DeleteHeadlthItem({ commit }, id) {
      return new Promise((resolve, reject) => {
        deleteHealthItem(id).then(response => {
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
    // 体测上下架
    UpdateHealthSelves({ commit }, health) {
      return new Promise((resolve, reject) => {
        updateHealthSelves(health).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            resolve(response)
            var msg = ''
            if (health.status === 1) {
              msg = '上架'
            } else {
              msg = '下架'
            }
            Message({
              message: msg + '成功',
              type: 'success',
              duration: 2 * 1000
            })
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
    // 批量删除体测记录
    DeleteBatchHealth({ commit }, ids) {
      return new Promise((resolve, reject) => {
        deleteBatchHealth(ids).then(response => {
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
    // 体测-批量上下架
    UpdateBatchHealth({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateBatchHealth(data).then(response => {
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
    // 新增体测报告
    AddHealth({ commit }, health) {
      return new Promise((resolve, reject) => {
        addHealth(health).then(response => {
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
    // 体检-下载模版
    HealthTemplate({ commit }) {
      return new Promise((resolve, reject) => {
        healthTemplate().then(response => {
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

export default health
