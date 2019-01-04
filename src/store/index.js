import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import getters from './getters'
import TestItem from './modules/physical/testitem'
import Health from './modules/physical/health'
import Place from './modules/place'
import Teacher from './modules/teacher'
import Common from './modules/common'
import Homework from './modules/homework'
import Lesson from './modules/lesson'
import Student from './modules/student'
import Equipment from './modules/equipment'
import Classes from './modules/class'
import Index from './modules/index'
import routerdata from './modules/routerData'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        app,
        user,
        TestItem,
        Health,
        Common,
        Place,
        Teacher,
        Homework,
        Lesson,
        Student,
        Equipment,
        Classes,
        Index,
        routerdata
    },
    getters
})

export default store