/**
 * Created by xxxxtech on 2018/7/17.
 */
import { getTestItemList, deleteTestItem, getTestItemDetail, getRecomData, getRecomDetailData, updateSelves, testItemTemplate, getTestItem, addTestItem, deleteBatchTestItem, updateBatchSelves, physicalDetailExport } from '@/api/physical'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { formatDate } from '@/utils/index'

const testItem = {
  state: {
    id: '',
    token: getToken(),
    name: '',
    schoolYearStart: '',
    schoolYearEnd: '',
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
    SET_TESTITEM_ID: (state, id) => {
      state.id = id
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
    // 查询体测列表
    GetTestItemList({ commit }, testItem) {
      if (typeof testItem.schoolYear !== 'undefined') {
        const list = testItem.schoolYear.split('-')
        if (list.length > 0) {
          testItem.schoolYearStart = list[0]
          testItem.schoolYearEnd = list[1]
        }
      }
      // commit('SET_TOKEN', getToken())
      // commit('SET_NAME', testitem.name)
      // commit('SET_SACHOOL_YEAR_START', testitem.schoolYearStart)
      // commit('SET_SACHOOL_YEAR_END', testitem.schoolYearEnd)
      // commit('SET_CLASS_ID', testitem.classId)
      // commit('SET_SCHOOL_ID', testitem.schoolId)
      // commit('SET_GRADE_ID', testitem.gradeId)
      return new Promise((resolve, reject) => {
        getTestItemList(testItem).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            if (response.data) {
              const list = response.data.list
              list.forEach((item, value) => {
                item.healthTestTime = formatDate(item.healthTestTime, 'yyyy-MM-dd')
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
    DeleteTestItem({ commit }, id) {
      return new Promise((resolve, reject) => {
        deleteTestItem(id).then(response => {
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
    UpdateSelves({ commit }, testItem) {
      return new Promise((resolve, reject) => {
        updateSelves(testItem).then(response => {
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
    // 查询体测详情
    GetTestItemDetail({ commit }, testItem) {
      return new Promise((resolve, reject) => {
        getTestItemDetail(testItem).then(response => {
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
    // 获取体测指导
    GetRecomData({ commit }, testItem) {
      return new Promise((resolve, reject) => {
        getRecomData(testItem).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            if (response.data == null) {
              Message({
                message: '指导点不存在',
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
    // 获取体测指导
    GetRecomDetailData({ commit }, testItem) {
      return new Promise((resolve, reject) => {
        getRecomDetailData(testItem).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            if (response.data == null) {
              Message({
                message: '指导点不存在',
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
    // 获取体测项目
    GetTestItem({ commit }, testItem) {
      return new Promise((resolve, reject) => {
        getTestItem(testItem).then(response => {
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
    AddTestItem({ commit }, testItem) {
      return new Promise((resolve, reject) => {
        addTestItem(testItem).then(response => {
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
    // 批量删除体测记录
    DeleteBatchTestItem({ commit }, ids) {
      return new Promise((resolve, reject) => {
        deleteBatchTestItem(ids).then(response => {
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
    UpdateBatchSelves({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateBatchSelves(data).then(response => {
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
    // 体测-下载模版
    TestItemTemplate({ commit }, data) {
      return new Promise((resolve, reject) => {
        testItemTemplate().then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            console.info('-----> ' + JSON.stringify(response))
            // var url = response.data
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

export default testItem
