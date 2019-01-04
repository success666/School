/**
 * Created by xxxxtech on 2018/7/23
 */
import request from '@/utils/request'

// 获取年级列表
export function getGrade() {
  return request({
    url: '/api/auth/v1/school/grade',
    method: 'get'
  })
}
// 获取班级列表
export function getClass(data) {
  return request({
    url: '/api/auth/v1/school/class/list',
    method: 'get',
    params: data
  })
}
