import request from '@/utils/request'

// 班级作业详情
export function getHomeworkDetail(detail) {
  return request({
    url: '/api/auth/v1/homework/' + detail.id,
    method: 'get'
  })
}
// 班级作业列表
export function getClassHomeworkList(homework) {
  return request({
    url: '/api/auth/v1/homework',
    method: 'get',
    params: homework
  })
}
// 删除作业
export function deleteHomework(id) {
  return request({
    url: '/api/auth/v1/homework/' + id,
    method: 'delete'
  })
}
// 推送作业
export function pushHomework(id) {
  return request({
    url: '/api/auth/v1/homework/push/' + id,
    method: 'post'
  })
}
// 推荐作业(用于新增作业)
export function recommendHomework(params) {
  return request({
    url: 'api/auth/v2/homework/recommendHomework',
    method: 'get',
    params: params
  })
}
// 保存作业
export function saveHomework(homework) {
  return request({
    url: '/api/auth/v2/homework',
    method: 'post',
    data: homework
  })
}

// 作业库详情
export function getHomeworkLibDetail(detailLib) {
  return request({
    url: '/api/auth/v1/homework/homeworkLibDetail/' + detailLib.id,
    method: 'get'
  })
}
// 个人作业详情
export function personalHomeworkDetail(id) {
  return request({
    url: '/api/auth/v1/homework/student/homeworkDetail/' + id,
    method: 'get'
  })
}

// 查询作业库
export function getHomeworkLibList(param) {
  return request({
    url: '/api/auth/v1/homework/homeworkLibList?pageNum=' + param.pageNum + '&pageSize=' + param.pageSize +
      '&name=' + param.name + '&sportItemNames=' + param.sportItemNames + '&gradeIds=' + param.gradeIds + '&sex=' + param.sex + '&difficulty=' +
      param.difficulty,
    method: 'get'
  })
}

// 查询作业库
export function gradeUnion() {
  return request({
    url: '/api/auth/v1/gradeUnion',
    method: 'get'
  })
}
// 修改作业
export function updateHomework(homework) {
  return request({
    url: '/api/auth/v1/homework/' + homework.id,
    method: 'post',
    data: homework
  })
}
