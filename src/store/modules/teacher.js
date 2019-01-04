import { teacherList, teacherEdit, teacherDelete, teacherDetail, addTeacher, getTeacherList, getChinaArea, getEducationDegree, getTeacherProfessionalTitle, getHonourDegree, getHonour, ossPolicyByLogo, ossPolicyByTreatise } from '@/api/teacher'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const teacher = {
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
    // 师资列表查询
    TeacherList({ commit }, teacher) {
      return new Promise((resolve, reject) => {
        teacherList(teacher).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            response.data.list.forEach((val, index) => {
              if (val.sex === 1) {
                val.sex = '男'
              } else {
                val.sex = '女'
              }
              if (val.status === 1) {
                val.status = '在职'
              } else {
                val.status = '离职'
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
    // 师资编辑
    TeacherEdit({ commit }, teacher) {
      return new Promise((resolve, reject) => {
        teacherEdit(teacher).then(response => {
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
    // 师资删除
    TeacherDelete({ commit }, teacherId) {
      return new Promise((resolve, reject) => {
        teacherDelete(teacherId).then(response => {
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
    // 师资详情
    TeacherDetail({ commit }, teacherId) {
      return new Promise((resolve, reject) => {
        teacherDetail(teacherId).then(response => {
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
    // 师资添加
    AddTeacher({ commit }, teacher) {
      return new Promise((resolve, reject) => {
        addTeacher(teacher).then(response => {
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
    GetTeacherList({ commit }, teacher) {
      return new Promise((resolve, reject) => {
        getTeacherList(teacher).then(response => {
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
    // 获取区域
    getChinaArea({ commit }, type) {
      return new Promise((resolve, reject) => {
        getChinaArea(type).then(response => {
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
    // 获取学历
    getEducationDegree({ commit }) {
      return new Promise((resolve, reject) => {
        getEducationDegree().then(response => {
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
    // 获取学历
    getTeacherProfessionalTitle({ commit }) {
      return new Promise((resolve, reject) => {
        getTeacherProfessionalTitle().then(response => {
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
    // 荣誉等级列表
    getHonourDegree({ commit }) {
      return new Promise((resolve, reject) => {
        getHonourDegree().then(response => {
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
    // 荣誉列表
    getHonour({ commit }) {
      return new Promise((resolve, reject) => {
        getHonour().then(response => {
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
    // OSS 头像
    getOssPolicyByLogo({ commit }) {
      return new Promise((resolve, reject) => {
        ossPolicyByLogo().then(response => {
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
    // OSS 论文
    ossPolicyByTreatise({ commit }) {
      return new Promise((resolve, reject) => {
        ossPolicyByTreatise().then(response => {
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

export default teacher
