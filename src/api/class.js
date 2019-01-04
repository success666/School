import request from '@/utils/request'

// 查询班级列表
export function getClassList(data) {
  return request({
    url: '/api/auth/v1/school/class',
    method: 'get',
    params: data
  })
}
// 删除班级
export function deleteClass(data) {
  return request({
    url: '/api/auth/v1/school/class/' + data.id,
    method: 'delete'
  })
}
// 查询班级详情
export function getClassDetail(data) {
  return request({
    url: '/api/auth/v1/school/class/' + data.id,
    method: 'get'
  })
}
// 修改班级信息
export function updateClass(data) {
  return request({
    url: '/api/auth/v1/school/class/' + data.id,
    method: 'post',
    data: data
  })
}
// 新增班级
export function addClass(data) {
  return request({
    url: '/api/auth/v1/school/class',
    method: 'post',
    data: data
  })
}
