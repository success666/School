import request from '@/utils/request'

// 查询学生列表
export function getStudentList(student) {
  return request({
    url: '/api/auth/v1/student',
    method: 'get',
    params: student
  })
}

// 新增学生
export function addStudent(student) {
  return request({
    url: '/api/auth/v1/student',
    method: 'post',
    data: student
  })
}
// 修改学生
export function updateStudent(student) {
  return request({
    url: '/api/auth/v1/student/' + student.id,
    method: 'post',
    data: student
  })
}
// 删除学生
export function deleteStudent(student) {
  return request({
    url: '/api/auth/v1/student/' + student.id + '?schoolClassId=' + student.schoolClassId,
    method: 'delete'
  })
}
// 批量导入学生
export function batchUpload(data) {
  return request({
    url: '/api/auth/v1/student/importExcel',
    method: 'post',
    data: { data }
  })
}
// 通过班级获取学生
export function getStudentListByClass(id) {
  return request({
    url: '/api/auth/v1/student/list',
    method: 'get',
    params: id
  })
}
// 查询学生详情
export function getStudentDetail(param) {
  return request({
    url: '/api/auth/v1/student/' + param.id,
    method: 'get',
    params: { schoolClassId: param.schoolClassId }
  })
}

// 编辑学生
export function editStudent(param) {
  return request({
    url: '/api/auth/v1/student/detailed/' + param.id,
    method: 'get',
    params: { schoolClassId: param.schoolClassId }
  })
}

// 学生模版下载
export function studentTemplate(param) {
  return request({
    url: '/api/auth/v1/student/downTemplate' + param.type,
    method: 'get'
  })
}

