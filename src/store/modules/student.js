import { getStudentList, getStudentDetail, addStudent, updateStudent, deleteStudent, getStudentListByClass, editStudent, studentTemplate } from '@/api/student'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const student = {
  state: {
    id: '',
    token: getToken()
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
    // 查询学生列表
    GetStudentList({ commit }, student) {
      return new Promise((resolve, reject) => {
        getStudentList(student).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            response.data.list.forEach((val, index) => {
              if (val.sex === 1) {
                val.sex = '男'
              } else {
                val.sex = '女'
              }
            })
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
    // 获取学生详情
    GetStudentDetail({ commit }, student) {
      return new Promise((resolve, reject) => {
        getStudentDetail(student).then(response => {
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
    // 新增学生
    AddStudent({ commit }, student) {
      return new Promise((resolve, reject) => {
        addStudent(student).then(response => {
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
    // 修改学生
    UpdateStudent({ commit }, student) {
      return new Promise((resolve, reject) => {
        updateStudent(student).then(response => {
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
    // 删除学生
    DeleteStudent({ commit }, student) {
      return new Promise((resolve, reject) => {
        deleteStudent(student).then(response => {
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
    GetStudentListByClass({ commit }, data) {
      return new Promise((resolve, reject) => {
        getStudentListByClass(data).then(response => {
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
    EditStudent({ commit }, data) {
      return new Promise((resolve, reject) => {
        editStudent(data).then(response => {
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
    StudentTemplate({ commit }, data) {
      return new Promise((resolve, reject) => {
        studentTemplate().then(response => {
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

export default student
