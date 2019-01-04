import request from '@/utils/request'

// 获取班级心率报告
export function heartRateReport(course) {
  return request({
    url: '/api/auth/v1/course/classReportHeartRate',
    method: 'get',
    params: course
  })
}
// 获取学生信息
export function courseStudentInfo(course) {
  return request({
    url: '/api/auth/v1/course/courseLeaveStudent',
    method: 'get',
    params: course
  })
}
// 班级报告运动量
export function schoolClassExerciseVolume(course) {
  return request({
    url: '/api/auth/v1/course/schoolClassExerciseVolume',
    method: 'get',
    params: course
  })
}
// 获取个人报告
export function personalReport(params) {
  return request({
    url: '/api/auth/v1/course/personalReport?courseId=' + params.courseId + '&studentId=' + params.studentId,
    method: 'get',
    params: {}
  })
}
// 个人班级报告运动量
export function personCourseExerciseVolume(params) {
  return request({
    url: '/api/auth/v1/course/personCourseExerciseVolume?courseId=' + params.courseId + '&studentId=' + params.studentId,
    method: 'get',
    params: {}
  })
}
// 个人报告心率
export function personalReportHeartRate(params) {
  return request({
    url: '/api/auth/v1/course/personalReportHeartRate?courseId=' + params.courseId + '&studentId=' + params.studentId,
    method: 'get',
    params: {}
  })
}
// 获取跳绳测试数据
export function skip(param) {
  return request({
    url: '/api/auth/v1/course/testRankingRecord',
    method: 'get',
    params: param
  })
}
// 个人报告获取跳绳数据
export function personalSkip(params) {
  return request({
    url: '/api/auth/v1/course/personalSkip?courseId=' + params.courseId + '&studentId=' + params.studentId,
    method: 'get',
    params: {}
  })
}
// 课堂表现管理列表
export function lessonList(params) {
  return request({
    url: '/api/auth/v1/course/schoolClassCourseRecord',
    method: 'get',
    params: params
  })
}
