import { getHomeworkDetail, getHomeworkLibDetail, getClassHomeworkList, deleteHomework, pushHomework, recommendHomework, saveHomework, getHomeworkLibList, personalHomeworkDetail, gradeUnion, updateHomework } from '@/api/homework'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const homework = {
    state: {
        id: '',
        token: getToken(),
        name: '',
        detail: {}
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
        // 班级作业详情
        GetHomeworkDetail({ commit }, detail) {
            return new Promise((resolve, reject) => {
                getHomeworkDetail(detail).then(response => {
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

        // 作业库详情
        GetHomeworkLibDetail({ commit }, detailLib) {
            return new Promise((resolve, reject) => {
                getHomeworkLibDetail(detailLib).then(response => {
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
        // 班级作业列表
        GetClassHomeworkList({ commit }, homework) {
            return new Promise((resolve, reject) => {
                getClassHomeworkList(homework).then(response => {
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
        // 删除作业
        DeleteHomework({ commit }, id) {
            return new Promise((resolve, reject) => {
                deleteHomework(id).then(response => {
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
        // 推送作业
        PushHomework({ commit }, id) {
            return new Promise((resolve, reject) => {
                pushHomework(id).then(response => {
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
        // 推荐作业(用于新增作业)
        RecommendHomework({ commit }, params) {
            return new Promise((resolve, reject) => {
                recommendHomework(params).then(response => {
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
        // 保存作业
        SaveHomework({ commit }, homework) {
            return new Promise((resolve, reject) => {
                saveHomework(homework).then(response => {
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
        // 查询作业库
        GetHomeworkLibList({ commit }, param) {
            return new Promise((resolve, reject) => {
                getHomeworkLibList(param).then(response => {
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
        // 个人作业详情
        PersonalHomeworkDetail({ commit }, id) {
            return new Promise((resolve, reject) => {
                personalHomeworkDetail(id).then(response => {
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
        // 个人作业详情
        gradeUnion({ commit }) {
            return new Promise((resolve, reject) => {
                gradeUnion().then(response => {
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
        // 更新作业
        UpdateHomework({ commit }, data) {
            return new Promise((resolve, reject) => {
                updateHomework(data).then(response => {
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

export default homework