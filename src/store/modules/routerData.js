const routerData = {
  state: {
    homeworkstatsStudent: {},
    homeworkliststats: {},
    studentHealthStatsList: {},
    teacherstats: {},
    teacherstatslist: {}

  },
  mutations: {
    SETHOMEWORKSTATS: (state, homeworkstats) => {
      state.homeworkstatsStudent = homeworkstats
    },
    SETHOMEWORKLISTSTATS: (state, homeworkliststats) => {
      state.homeworkliststats = homeworkliststats
    },
    SETSTUDENTHEALTHSTATSLIST: (state, data) => {
      state.studentHealthStatsList = data
    },
    SETTEACHERSTATS: (state, data) => {
      state.teacherstats = data
    },
    SETTEACHERSTATSLIST: (state, data) => {
      state.teacherstatslist = data
    }
  },
  actions: {
    setHomeworkStatsStudent(context, data) {
      context.commit('SETHOMEWORKSTATS', data)
    },
    setHomeworkListStats(context, data) {
      console.log(11)
      context.commit('SETHOMEWORKLISTSTATS', data)
    },
    setStudentHealthList(context, data) {
      context.commit('SETSTUDENTHEALTHSTATSLIST', data)
    },
    setTeacherStats(context, data) {
      context.commit('SETTEACHERSTATS', data)
    },
    setTeacherStatsList(context, data) {
      context.commit('SETTEACHERSTATSLIST', data)
    }
  }
}

export default routerData
