import request from '@/utils/request'

// 器材详情
export function details(params) {
  return request({
    url: '/api/auth/v1/equipment/details?schoolYearStart=' + params.schoolYearStart + '&schoolYearEnd=' + params.schoolYearEnd,
    method: 'get',
    data: {}
  })
}

// 获取默认器材
export function defalut() {
  return request({
    url: '/api/auth/v1/equipment/defalut',
    method: 'get',
    data: {}
  })
}

// 新增器材
export function addEquipment(params) {
  return request({
    url: '/api/auth/v1/equipment',
    method: 'post',
    data: params
  })
}

// 编辑器材
export function editEquipment(params) {
  return request({
    url: '/api/auth/v1/equipment/update',
    method: 'post',
    data: params
  })
}

// 器材导出
export function exportEquipment(params) {
  return request({
    url: '/api/auth/v1/equipment/export?schoolYearStart=' + params.schoolYearStart + '&schoolYearEnd=' + params.schoolYearEnd,
    method: 'get',
    data: params
  })
}

// 器材模版下载
export function equipmentTemplate() {
  return request({
    url: '/api/auth/v1/equipment/downTemplate',
    method: 'get'
  })
}

// 器材配置达标准参考链接
export function standardDocument() {
  return request({
    url: '/api/auth/v1/equipment/standardDocument',
    method: 'get'
  })
}
