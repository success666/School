import request from '@/utils/request'

// 场地列表
export function placeList(place) {
  return request({
    url: '/api/auth/v1/field/details',
    method: 'get',
    params: place
  })
}

// 场地编辑
export function placeEdit(place) {
  return request({
    url: '/api/auth/v1/field/update',
    method: 'post',
    data: place
  })
}
// 获取默认场地
export function defaultPlace(place) {
  return request({
    url: '/api/auth/v1/field/defalut',
    method: 'get',
    params: place
  })
}
// 新增场地
export function addPlace(place) {
  return request({
    url: '/api/auth/v1/field',
    method: 'post',
    data: place
  })
}
// 场地详情
export function placeDetail(place) {
  return request({
    url: '/api/auth/v1/field/details',
    method: 'get',
    params: place
  })
}

// 场地模版下载
export function placeTemplate() {
  return request({
    url: '/api/auth/v1/field/downTemplate',
    method: 'get'
  })
}

// 场地配置达标准参考链接
export function fieldstandardDocument() {
  return request({
    url: '/api/auth/v1/field/standardDocument',
    method: 'get'
  })
}
