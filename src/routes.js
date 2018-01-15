import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav2/Table.vue'
import Table1 from './views/nav2/Table1.vue'
import Table2 from './views/nav2/Table2.vue'
import Form from './views/nav2/Form.vue'
import user from './views/nav2/user.vue'
import Page4 from './views/nav3/Page4.vue'
import Page5 from './views/nav3/Page5.vue'
import Page51 from './views/nav3/Page51.vue'
import Page6 from './views/nav1/Page6.vue'
import echarts from './views/charts/echarts.vue'

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
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/page6', component: Page6, name: '用户管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '解析管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '服务器管理' },
            { path: '/table1', component: Table1, name: '解析配置管理' },
            { path: '/table2', component: Table2, name: '解析配置统计' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '编码赋码管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '前段码分配/管理' },
            { path: '/page5', component: Page5, name: '编码统计' },
            { path: '/page51', component: Page51, name: '编码分配查询' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;