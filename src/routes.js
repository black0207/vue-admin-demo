import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import serverMan from './views/nav2/serverMan.vue'
import serverState  from './views/nav2/serverState.vue'
import configMan from './views/nav2/configMan.vue'
import Table2 from './views/nav2/Table2.vue'
import Form from './views/nav2/Form.vue'
import user from './views/nav2/user.vue'
import frontCodeMan from './views/nav3/frontCodeMan.vue'
import CodeTypeMan from './views/nav3/CodeTypeMan.vue'
import Page5 from './views/nav3/Page5.vue'
import codeAllocation from './views/nav3/codeAllocation.vue'
import Page6 from './views/nav1/Page6.vue'
import codeOverview from './views/overview/codeOverview.vue'
import analysisOverview from './views/overview/analysisOverview.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    /*{
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/main', component: Main, name: '主页' }
        ]
    },*/
    {
        path: '/',
        component: Home,
        name: '解析服务管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
           /* { path: '/main', component: Main, name: '主页', hidden: true },*/
            { path: '/configStats', component: analysisOverview, name: '解析概览统计' },
            { path: '/serverMan', component: serverMan, name: '解析服务器管理' },
            { path: '/serverState', component: serverState, name: '服务器状态管理' },
            { path: '/configMan', component: configMan, name: '解析配置管理' },
            { path: '/form', component: Form, name: 'Form', hidden: true },
            { path: '/user', component: user, name: '列表',hidden:true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '编码赋码管理',
        iconCls: 'el-icon-edit-outline',
        children: [
            { path: '/codeStats', component: codeOverview, name: '编码概览统计' },
            { path: '/CodeTypeMan', component: CodeTypeMan, name: '编码类型管理', },
            { path: '/frontCodeMan', component: frontCodeMan, name: '编码码段管理' },
           /* { path: '/codeStatsDetail', component: echarts, name: '编码码段统计' },*/
        ]
    },
    /*{
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },*/
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;