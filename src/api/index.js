import request from '@/utils/request'

// 实时课堂
export function course() {
  return request({
    url: '/api/auth/v1/statistics/home/course',
    method: 'get'
  })
}

// 课堂运动消耗（平均）
export function calorieExpend() {
  return request({
    url: '/api/auth/v1/statistics/home/course/calorieExpend',
    method: 'get'
  })
}

// 学生课堂实时运动数据（前10名学生的运动时长）
export function sportTimeRanking() {
  return request({
    url: '/api/auth/v1/statistics/home/course/sportTimeRanking',
    method: 'get'
  })
}

// 本周不同强度运动时长
export function strengthSportTime() {
  return request({
    url: '/api/auth/v1/statistics/home/course/strengthSportTime',
    method: 'get'
  })
}

// 学校设备使用位置
export function devicePosition() {
  return request({
    url: '/api/auth/v1/statistics/home/course/devicePosition',
    method: 'get'
  })
}

// 本周课外锻炼
export function extracurricularExercise() {
  return request({
    url: '/api/auth/v1/statistics/home/extracurricularExercise',
    method: 'get'
  })
}

// 统计设备信息
export function getStatisticsDeviceMessage() {
  return request({
    url: '/api/auth/v1/statistics/home/course/sportDataCount',
    method: 'get'
  })
}

// 体育作业
export function homework() {
  return request({
    url: '/api/auth/v1/statistics/home/homework',
    method: 'get'
  })
}

// 未参加学生人数
export function notAttend(param) {
  return request({
    url: '/api/auth/v1/statistics/home/student/notAttend',
    method: 'get',
    params: param
  })
}

// 运动时长（前一天）
export function sportTime() {
  return request({
    url: '/api/auth/v1/statistics/home/student/sportTime',
    method: 'get'
  })
}

// 运动未超过1小时学生
export function lessThanOneHour(param) {
  return request({
    url: '/api/auth/v1/statistics/home/student/sportTime/lessThanOneHour',
    method: 'get',
    params: param
  })
}

// 运动超过1小时学生
export function moreThanOneHour(param) {
  return request({
    url: '/api/auth/v1/statistics/home/student/sportTime/moreThanOneHour',
    method: 'get',
    params: param
  })
}

export function shoolYearDtl() {
  return request({
    url: '/api/auth/v1/home/stats/phy/shoolYearDtl',
    method: 'get'
  })
}
// 优良率低于25%的班级
export function classExcellentRate(param) {
  return request({
    url: '/api/auth/v1/home/stats/phy/classExcellentRate',
    method: 'get',
    params: param
  })
}

// 全区学校合格率
export function schoolQuaRate(param) {
  return request({
    url: '/api/auth/v1/home/stats/phy/schoolQuaRate',
    method: 'get',
    params: param
  })
}

// 学生综合体质不合格的人数
export function stuUnquaRate(param) {
  return request({
    url: '/api/auth/v1/home/stats/phy/stuUnquaRate',
    method: 'get',
    params: param
  })
}

// 全区学校优良率
export function schoolExcellentRate(param) {
  return request({
    url: '/api/auth/v1/home/stats/phy/schoolExcellentRate',
    method: 'get',
    params: param
  })
}

// 低于合格率94%的班级列表
export function classQuaRate(param) {
  return request({
    url: '/api/auth/v1/home/stats/phy/classQuaRate',
    method: 'get',
    params: param
  })
}
