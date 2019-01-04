const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    roles: state => state.user.roles,
    homeworkstatsStudent: state => state.routerdata.homeworkstatsStudent,
    homeworkliststats: state => state.routerdata.homeworkliststats,
    studentHealthStatsList: state => state.routerdata.studentHealthStatsList,
    teacherstats: state => state.routerdata.teacherstats,
    teacherstatslist: state => state.routerdata.teacherstatslist
}
export default getters