import { heartRateReport, courseStudentInfo, schoolClassExerciseVolume, personalReport, personCourseExerciseVolume , personalReportHeartRate, skip, personalSkip, lessonList } from '@/api/lesson'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const lesson = {
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
    HeartRateReport({ commit }, lesson) {
      return new Promise((resolve, reject) => {
        heartRateReport(lesson).then(response => {
          if (response.status.code === 200 || response.status.code === 0) {
            response.data.studentCourseHeartRateList.forEach((val, index) =>{
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
    CourseStudentInfo({ commit }, lesson) {
      return new Promise((resolve, reject) => {
        courseStudentInfo(lesson).then(response => {
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
    // 班级报告运动量
    SchoolClassExerciseVolume({ commit }, lesson) {
      return new Promise((resolve, reject) => {
        schoolClassExerciseVolume(lesson).then(response => {
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
    // 获取个人报告
    personalReport({ commit }, params) {
      return new Promise((resolve, reject) => {
        personalReport(params).then(response => {
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
    // 个人班级报告运动量
    personCourseExerciseVolume({ commit }, params) {
      return new Promise((resolve, reject) => {
        personCourseExerciseVolume(params).then(response => {
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
    // 个人报告心率
    personalReportHeartRate({ commit }, params) {
      return new Promise((resolve, reject) => {
        personalReportHeartRate(params).then(response => {
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
    Skip({ commit }, params) {
      return new Promise((resolve, reject) => {
        skip(params).then(response => {
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
    getPersonalSkip({ commit }, params) {
      return new Promise((resolve, reject) => {
        personalSkip(params).then(response => {
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
    LessonList({ commit }, data) {
      return new Promise((resolve, reject) => {
        lessonList(data).then(response => {
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

export default lesson
