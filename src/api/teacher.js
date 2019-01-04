import request from '@/utils/request'

// 师资列表
export function teacherList(teacher) {
  return request({
    url: '/api/auth/v1/teacher',
    method: 'get',
    params: teacher
  })
}

// 师资编辑
export function teacherEdit(teacher) {
  return request({
    url: '/api/auth/v1/teacher/' + teacher.id,
    method: 'post',
    data: teacher
  })
}

// 师资删除
export function teacherDelete(teacherId) {
  return request({
    url: '/api/auth/v1/teacher/' + teacherId,
    method: 'delete'
  })
}

// 师资详情
export function teacherDetail(teacherId) {
  return request({
    url: '/api/auth/v1/teacher/' + teacherId,
    method: 'get',
    data: {}
  })
}

// 师资添加
export function addTeacher(teacher) {
  return request({
    url: '/api/auth/v1/teacher',
    method: 'post',
    data: teacher
  })
}

// 师资详情列表
export function getTeacherList(data) {
  return request({
    url: '/api/auth/v1/teacher/stats/list',
    method: 'get',
    params: data
  })
}

// 获取区域
// type为1，代表省份
export function getChinaArea(type) {
  return request({
    url: '/api/auth/v1/chinaArea/' + type,
    method: 'get',
    params: {}
  })
}

// 学历
export function getEducationDegree() {
  return request({
    url: '/api/auth/v1/educationDegree',
    method: 'get',
    params: {}
  })
}

// 职称
export function getTeacherProfessionalTitle() {
  return request({
    url: '/api/auth/v1/teacherProfessionalTitle',
    method: 'get',
    params: {}
  })
}

// 荣誉等级列表
export function getHonourDegree() {
  return request({
    url: '/api/auth/v1/honourDegree',
    method: 'get',
    params: {}
  })
}

// 荣誉列表
export function getHonour() {
  return request({
    url: '/api/auth/v1/honour',
    method: 'get',
    params: {}
  })
}

// OSS
export function ossPolicyByLogo() {
  return request({
    url: '/api/auth/v1/oss/policy?dir=logo/teacher',
    method: 'get',
    params: {}
  })
}
export function ossPolicyByTreatise() {
  return request({
    url: '/api/auth/v1/oss/policy?dir=treatise/teacher',
    method: 'get',
    params: {}
  })
}
