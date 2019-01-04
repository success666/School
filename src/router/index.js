import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

Vue.use(Router)

import Layout from '../views/layout/Layout'
import Login from '../views/login/index'
import newPageHtml from '../views/pageHtml/newPageHtml'
import NotFound from '../views/404'
import DashBoard from '../views/dashboard/index'
import AccountTab from '../views/accountMgmt/accountTab'
import AccountMgmt from '../views/accountMgmt/account'
import AccountMgmtAdd from '../views/accountMgmt/accountAdd'
import AccountMgmtEdit from '../views/accountMgmt/accountEdit'
import AccountRole from '../views/accountMgmt/role'
import AccountRoleAdd from '../views/accountMgmt/roleAdd'
import AccountRoleEdit from '../views/accountMgmt/roleEdit'
import TestItemList from '../views/physical/testitem/testitemlist'
import TestItemDetail from '../views/physical/testitem/testitemdetail'
import DuidanceDeyail from '../views/physical/testitem/guidanceDeyail'
import TestItemImport from '../views/physical/testitem/batchimport'
import HealthImport from '../views/physical/health/batchimport'
import HealthItemDetail from '../views/physical/health/healthItemdetail'
import HealthForm from '../views/physical/health/healthform'
import TestItemForm from '../views/physical/testitem/testitemform'
import HealthList from '../views/physical/health/healthlist'
// 修改密码

import ModifyPwd from '../views/login/modifyPwd'
// 体质统计
import HealthStats from '../views/physical/healthstats/healthStats'
import HistoryPeformance from '../views/physical/healthstats/historicalPerformance'
import studentHealthStatsList from '../views/physical/healthstats/studentHealthStatsList'

// 班级分析
import ClassAnalysis from '../views/physical/classAnalysis/classAnalysis'
import SingleAnalysis from '../views/physical/classAnalysis/singleAnalysis'
import ClassAnalysisDetail from '../views/physical/classAnalysis/classAnalysisDetail'
import ClassAnalysisMgmt from '../views/physical/classAnalysisMgmt'

import EquipmentList from '../views/resourcemgmt/equipment/equipmentlist'
import StudentSearchList from '../views/resourcemgmt/student/studentsearchlist'

import EquipmentForm from '../views/resourcemgmt/equipment/equipmentform'
import EquipmentEditForm from '../views/resourcemgmt/equipment/equipmenteditform'
import EquipmentImport from '../views/resourcemgmt/equipment/batchimport'
// 器材统计
import EquipmentStats from '../views/resourcemgmt/equipment/equipmentStats'
import DetailList from '../views/resourcemgmt/equipment/detailList'

import ClassStudentList from '../views/resourcemgmt/student/classstudentlist'
import StudentForm from '../views/resourcemgmt/student/studentform'
import ClassList from '../views/resourcemgmt/student/classlist'
import PlaceList from '../views/resourcemgmt/place/placelist'
import PlaceStats from '../views/resourcemgmt/place/placestats'
import PlaceForm from '../views/resourcemgmt/place/placeform'
import PlaceImport from '../views/resourcemgmt/place/batchimport'
import ClassForm from '../views/resourcemgmt/student/classform'
import StudentDetail from '../views/resourcemgmt/student/studentdetail'
// 师资
import Teachermgmt from '../views/resourcemgmt/teacher/teachermgmt'
import TeacherList from '../views/resourcemgmt/teacher/teacherlist'
import TeacherStats from '../views/resourcemgmt/teacher/teacherstats'
import TeacherStatsList from '../views/resourcemgmt/teacher/teacherstatslist'
import TeacherEdit from '../views/resourcemgmt/teacher/teacheredit'
import TeacherDetail from '../views/resourcemgmt/teacher/teacherdetail'
// 学生统计 // 学生统计-统计图表 // 学生统计-数据详情 // 学生统计-学生列表
import StudentStats from '../views/resourcemgmt/student/studentStats'
import DataDetails from '../views/resourcemgmt/student/detailList'
import StudentList from '../views/resourcemgmt/student/studentList'
// 教务管理
// 智慧课堂管理
import Lessonmgmt from '../views/edumanagement/lesson/lessonmgmt'
import LessonList from '../views/edumanagement/lesson/lessonlist'
import LessonPerformance from '../views/edumanagement/lesson/lessonperformance'
import PersionalReport from '../views/edumanagement/lesson/persionalreport'
import ClassStats from '../views/edumanagement/lesson/classStats'
import LessonClassStudentList from '../views/edumanagement/lesson/classStudentList'
import SportStats from '../views/edumanagement/lesson/sportStats'

import HomeworkList from '../views/edumanagement/homework/homeworklist'
import HomeworkStats from '../views/edumanagement/homework/homeworkstats'
import Studentliststats from '../views/edumanagement/homework/studentliststats'
import Homeworkliststats from '../views/edumanagement/homework/homeworkliststats'
import PersonalHomeWordEditForm from '../views/edumanagement/homework/personalhomewordeditform'
import HomeworkDetail from '../views/edumanagement/homework/homeworkdetail'
import AddHomework from '../views/edumanagement/homework/addhomework'
import PersonalDetail from '../views/edumanagement/homework/personaldetail'
// 教案管理
import TeachingMgmt from '../views/edumanagement/teachingplan/teachingMgmt'
import TeachingplanMgmt from '../views/edumanagement/teachingplan/teachingplanMgmt'
import OutlineMgmt from '../views/edumanagement/teachingplan/outlineMgmt'
import AddTeachPlan from '../views/edumanagement/teachingplan/addteachplan'
import EditTeachPlan from '../views/edumanagement/teachingplan/addteachplan'
import EditTeachingsSeps from '../views/edumanagement/teachingplan/editTeachingsSeps'

import StudentImport from '../views/resourcemgmt/student/batchimport'
import IndexTab from '../views/dashboard/indextabel'
import EduMgmt from '../views/edumanagement/edumgmt'
import PhyMgmt from '../views/physical/phymgmt'
import ResourceMgmt from '../views/resourcemgmt/resourcemgmt'

export const constantRouterMap = [
    { path: '/login', name: 'login', component: Login },
    { path: '/modifypwd', name: 'ModifyPwd', component: ModifyPwd },
    { path: '/notfound', name: 'notfound', component: NotFound },
    { path: '/newPageHtml', name: 'newPageHtml', component: newPageHtml },
    // { path: '*', redirect: '/notfound' },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: 'Dashboard',
        hidden: true,
        children: [
            { path: 'dashboard', name: 'DashboardMain', component: DashBoard },
            {
                path: '/accountManagement_lv2',
                name: 'accountManagement',
                component: AccountTab,
                redirect: '/accountManagement_lv2/account',
                meta: { title: '运营账号管理' },
                // 运营账号管理
                children: [
                    { path: 'account', name: 'account', component: AccountMgmt, meta: { title: '账号新增', showMenu: "/accountManagement_lv2" } },
                    { path: 'accountadd', name: 'accountadd', component: AccountMgmtAdd, meta: { title: '账号新增', showMenu: "/accountManagement_lv2" } },
                    { path: 'accountedit', name: 'accountedit', component: AccountMgmtEdit, meta: { title: '账号编辑', showMenu: "/accountManagement_lv2" } },
                    { path: 'role', name: 'role', component: AccountRole, meta: { title: '角色管理', showMenu: "/accountManagement_lv2" } },
                    { path: 'roleadd', name: 'roleadd', component: AccountRoleAdd, meta: { title: '角色新增', showMenu: "/accountManagement_lv2" } },
                    { path: 'roleedit', name: 'roleedit', component: AccountRoleEdit, meta: { title: '角色编辑', showMenu: "/accountManagement_lv2" } }
                    // { path: 'role', name: 'role', component: AccountRole }
                ]
            },
            { path: 'indexTab', name: 'IndexTab', component: IndexTab },
            {
                path: 'homework',
                name: 'EdukMgmt',
                component: EduMgmt,
                redirect: '/homework/homeworkList',
                meta: { title: '教务管理' },
                children: [
                    { path: 'homeworkList', name: 'HomeworkList', component: HomeworkList, meta: { title: '作业管理', keepAlive: true, showMenu: '/homework' } },
                    { path: '/homeworkDetail', name: 'HomeworkDetail', component: HomeworkDetail, meta: { title: '班级作业详情', keepAlive: false, showMenu: '/homework' } },
                    { path: '/addHomework', name: 'AddHomework', component: AddHomework, meta: { title: '新增作业', keepAlive: false, showMenu: '/homework' } },
                    { path: 'physicalDetail', name: 'HomeworkphysicalDetail', component: TestItemDetail, meta: { title: '体测详情', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: '/editHomework', name: 'EditHomework', component: AddHomework, meta: { title: '编辑作业', keepAlive: false, showMenu: '/homework' } },
                    { path: '/personalHomeWordEditForm', name: 'PersonalHomeWordEditForm', component: PersonalHomeWordEditForm, meta: { title: '编辑作业', keepAlive: false, showMenu: '/homework' } },
                    { path: '/personalDetail', name: 'PersonalDetail', component: PersonalDetail, meta: { title: '个人作业详情', keepAlive: false, showMenu: '/homework' } },
                    // 作业统计
                    { path: 'homeworkStats', name: 'HomeworkStats', component: HomeworkStats, meta: { title: '作业统计', keepAlive: true, showMenu: '/homework' } },
                    { path: 'homeworkliststats', name: 'Homeworkliststats', component: Homeworkliststats, meta: { title: '作业列表', keepAlive: true, showMenu: '/homework' } },
                    { path: 'studentliststats', name: 'Studentliststats', component: Studentliststats, meta: { title: '学生列表', keepAlive: true, showMenu: '/homework' } },
                ]
            },
            {
                path: 'lessonManagemnt',
                name: 'Lessonmgmt',
                component: Lessonmgmt,
                redirect: '/lessonManagemnt/LessonList',
                meta: { title: '教务管理' },
                children: [
                    { path: 'LessonList', name: 'LessonList', component: LessonList, meta: { title: '智慧体育课堂', keepAlive: true, showMenu: '/lessonManagemnt' } },
                    { path: 'lessonPerformance', name: 'LessonPerformance', component: LessonPerformance, meta: { title: '班级课堂表现', keepAlive: true, showMenu: '/lessonManagemnt' } },
                    { path: '/persionalReport', name: 'PersionalReport', component: PersionalReport, meta: { title: '个人课堂表现', keepAlive: false, showMenu: '/lessonManagemnt' } },
                    // 课堂统计
                    { path: 'classStats', name: 'classStats', component: ClassStats, meta: { title: '课堂统计', keepAlive: true, showMenu: '/lessonManagemnt' } },
                    { path: 'classStudentList', name: 'classStudentList', component: LessonClassStudentList, meta: { title: '课堂统计-数据详情', keepAlive: true, showMenu: '/lessonManagemnt' } },
                    { path: 'sportStats', name: 'sportStats', component: SportStats, meta: { title: '课堂运动详情统计', keepAlive: true, showMenu: '/lessonManagemnt' } }
                ]
            },
            {
                path: 'teachingMgmt',
                name: 'teachingMgmt',
                component: TeachingMgmt,
                redirect: '/teachingMgmt/teachingplanMgmt',
                meta: { title: '教案管理' },
                children: [
                    //  教案管理
                    // { path: 'teachingMgmt', name: 'teachingMgmt', component: TeachingMgmt, meta: { title: '教案管理', keepAlive: true, showMenu: "/teachingMgmt" }},
                    { path: 'teachingplanMgmt', name: 'teachingplanMgmt', component: TeachingplanMgmt, meta: { title: '教案管理', keepAlive: true, showMenu: '/teachingMgmt' }},
                    { path: 'outlineMgmt', name: 'outlineMgmt', component: OutlineMgmt, meta: { title: '大纲管理', keepAlive: true, showMenu: '/teachingMgmt' }},
                    { path: 'addteachplan', name: 'addteachplan', component: AddTeachPlan, meta: { title: '新增教案', keepAlive: true, showMenu: '/teachingMgmt' }},
                    { path: 'editteachplan', name: 'editteachplan', component: EditTeachPlan, meta: { title: '编辑教案', keepAlive: true, showMenu: '/teachingMgmt' }},
                    { path: 'editTeachingsSeps', name: 'editTeachingsSeps', component: EditTeachingsSeps, meta: { title: '编辑教学过程', keepAlive: true, showMenu: '/teachingMgmt' }},
                ]
            },
            {
                path: 'physicalManageSecondary1',
                name: 'PhyMgmt',
                component: PhyMgmt,
                redirect: '/healthStats',
                meta: { title: '体质管理' },
                children: [
                    { path: '/testItemList', name: 'TestItemList', component: TestItemList, meta: { title: '体测管理', keepAlive: true, showMenu: "/physicalManageSecondary1" } },
                    { path: '/testItemDetail', name: 'TestItemDetail', component: TestItemDetail, meta: { title: '体测详情', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/duidanceDeyail', name: 'DuidanceDeyail', component: DuidanceDeyail, meta: { title: '指导点详情', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/testItemImport', name: 'TestItemImport', component: TestItemImport, meta: { title: '批量导入体测', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/healthImport', name: 'HealthImport', component: HealthImport, meta: { title: '批量导入体检', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/healthItemDetail', name: 'HealthItemDetail', component: HealthItemDetail, meta: { title: '体检详情', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/testItemForm', name: 'TestItemForm', component: TestItemForm, meta: { title: '编辑体测', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/addTestItemForm', name: 'AddTestItemForm', component: TestItemForm, meta: { title: '添加体测', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/healthList', name: 'HealthList', component: HealthList, meta: { title: '体检管理', keepAlive: true, showMenu: "/physicalManageSecondary1" } },
                    { path: '/healthForm', name: 'HealthForm', component: HealthForm, meta: { title: '编辑体检', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    { path: '/addHealthForm', name: 'AddHealthForm', component: HealthForm, meta: { title: '添加体检', keepAlive: false, showMenu: "/physicalManageSecondary1" } },
                    // 体质统计
                    { path: '/healthStats', name: 'healthStats', component: HealthStats, meta: { title: '体质统计', keepAlive: true, showMenu: "/physicalManageSecondary1" } },
                    { path: '/studentHealthStatsList', name: 'studentHealthStatsList', component: studentHealthStatsList, meta: { title: '体质统计(班级)', keepAlive: true, showMenu: "/physicalManageSecondary1" } },
                    { path: '/historyPeformance', name: 'historyPeformance', component: HistoryPeformance, meta: { title: '体质统计-历史成绩', keepAlive: false, showMenu: "/physicalManageSecondary1" } }
                ]
            },
            {
                path: 'classAnalysis',
                name: 'ClassAnalysis',
                component: ClassAnalysisMgmt,
                redirect: '/classAnalysis/classAnalysisSummary',
                meta: { title: '班级分析' },
                children: [
                    // 班级分析
                    { path: 'classAnalysisSummary', name: 'classAnalysis', component: ClassAnalysis, meta: { title: '班级列表', keepAlive: true, showMenu: "/classAnalysis" } },
                    { path: 'singleAnalysis', name: 'singleAnalysis', component: SingleAnalysis, meta: { title: '班级单项分析', keepAlive: false, showMenu: "/classAnalysis" } },
                    { path: 'classAnalysisDetail', name: 'classAnalysisDetail', component: ClassAnalysisDetail, meta: { title: '班级整体分析', keepAlive: false, showMenu: "/classAnalysis" } }
                ]
            },
            {
                path: 'studentManagement',
                name: 'ResourceMgmt',
                component: ResourceMgmt,
                redirect: '/studentManagement/classList',
                meta: { title: '学生管理' },
                children: [
                    { path: 'studentSearchList', name: 'StudentSearchList', component: StudentSearchList, meta: { title: '学生列表', keepAlive: true, showMenu: '/studentManagement' } },
                    { path: 'classStudentList', name: 'ClassStudentList', component: ClassStudentList, meta: { title: '班级学生列表', keepAlive: true, showMenu: '/studentManagement' } },
                    { path: 'classList', name: 'ClassList', component: ClassList, meta: { title: '班级列表', keepAlive: true, showMenu: '/studentManagement' } },
                    { path: 'physicalDetail', name: 'PhysicalDetail', component: TestItemDetail, meta: { title: '体测详情', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'studentStats', name: 'studentStats', component: StudentStats, meta: { title: '学生统计', keepAlive: true, showMenu: '/studentManagement' } },
                    { path: 'studentForm', name: 'StudentForm', component: StudentForm, meta: { title: '编辑学生', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'addStudentForm', name: 'AddStudentForm', component: StudentForm, meta: { title: '添加学生', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'studentImport', name: 'StudentImport', component: StudentImport, meta: { title: '批量导入', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'classForm', name: 'ClassForm', component: ClassForm, meta: { title: '编辑班级', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'addClassForm', name: 'AddClassForm', component: ClassForm, meta: { title: '添加班级', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'studentDetail', name: 'StudentDetail', component: StudentDetail, meta: { title: '学生详情', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'dataDetails', name: 'dataDetails', component: DataDetails, meta: { title: '学生统计-数据详情', keepAlive: false, showMenu: '/studentManagement' } },
                    { path: 'studentList', name: 'studentList', component: StudentList, meta: { title: '学生统计-学生列表', keepAlive: false, showMenu: '/studentManagement' } }
                ]
            },
            {
                path: 'teacherManagement',
                name: 'Teachermgmt',
                component: Teachermgmt,
                redirect: '/teacherManagement/teacherList',
                meta: { title: '师资管理' },
                children: [
                    { path: 'teacherList', name: 'TeacherList', component: TeacherList, meta: { title: '师资列表', keepAlive: true, showMenu: '/teacherManagement' } },
                    { path: 'teacherStats', name: 'teacherStats', component: TeacherStats, meta: { title: '师资统计', keepAlive: true, showMenu: '/teacherManagement' } },
                    { path: 'teacherStatsList', name: 'teacherStatsList', component: TeacherStatsList, meta: { title: '师资统计列表', keepAlive: true, showMenu: '/teacherManagement' } },
                    { path: 'teacherEdit', name: 'TeacherEdit', component: TeacherEdit, meta: { title: '添加或编辑师资', keepAlive: false, showMenu: '/teacherManagement' } },
                    { path: 'teacherDetail', name: 'TeacherDetail', component: TeacherDetail, meta: { title: '师资详情', keepAlive: false, showMenu: '/teacherManagement' } }
                ]
            },
            {
                path: 'equipmentManagement',
                name: 'ResourceMgmt',
                component: ResourceMgmt,
                redirect: '/equipmentManagement/equipmentList',
                meta: { title: '器材管理' },
                children: [
                    { path: 'equipmentList', name: 'EquipmentList', component: EquipmentList, meta: { title: '器材详情', keepAlive: true, showMenu: '/equipmentManagement' } },
                    { path: 'equipmentForm', name: 'EquipmentForm', component: EquipmentForm, meta: { title: '添加器材', keepAlive: false, showMenu: '/equipmentManagement' } },
                    { path: 'equipmentEditForm', name: 'EquipmentEditForm', component: EquipmentEditForm, meta: { title: '编辑器材', keepAlive: false, showMenu: '/equipmentManagement' } },
                    { path: 'equipmentImport', name: 'EquipmentImport', component: EquipmentImport, meta: { title: '批量导入器材', keepAlive: false, showMenu: '/equipmentManagement' } },

                    { path: 'equipmentStats', name: 'equipmentStats', component: EquipmentStats, meta: { title: '器材统计', keepAlive: true, showMenu: '/equipmentManagement' } },
                    { path: 'detailList', name: 'detailList', component: DetailList, meta: { title: '器材统计-详情列表', keepAlive: false, showMenu: '/equipmentManagement' } }
                ]
            },
            {
                path: 'fieldManagement',
                name: 'ResourceMgmt',
                component: ResourceMgmt,
                redirect: '/fieldManagement/placeList',
                meta: { title: '场地管理' },
                children: [
                    { path: 'placeList', name: 'PlaceList', component: PlaceList, meta: { title: '场地详情', keepAlive: true, showMenu: '/fieldManagement' } },
                    { path: 'placestats', name: 'PlaceStats', component: PlaceStats, meta: { title: '场地统计', keepAlive: true, showMenu: '/fieldManagement' } },
                    { path: 'placeForm', name: 'PlaceForm', component: PlaceForm, meta: { title: '编辑场地', keepAlive: false, showMenu: '/fieldManagement' } },
                    { path: 'addPlaceForm', name: 'AddPlaceForm', component: PlaceForm, meta: { title: '添加场地', keepAlive: false, showMenu: '/fieldManagement' } },
                    { path: 'placeImport', name: 'PlaceImport', component: PlaceImport, meta: { title: '批量导入场地', keepAlive: false, showMenu: '/fieldManagement' } }
                ]
            }
        ]
    }

]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})
