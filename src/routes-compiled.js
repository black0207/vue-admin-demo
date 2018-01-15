'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Login = require('./views/Login.vue');

var _Login2 = _interopRequireDefault(_Login);

var _ = require('./views/404.vue');

var _2 = _interopRequireDefault(_);

var _Home = require('./views/Home.vue');

var _Home2 = _interopRequireDefault(_Home);

var _Main = require('./views/Main.vue');

var _Main2 = _interopRequireDefault(_Main);

var _Table = require('./views/nav2/Table.vue');

var _Table2 = _interopRequireDefault(_Table);

var _Table3 = require('./views/nav2/Table1.vue');

var _Table4 = _interopRequireDefault(_Table3);

var _Table5 = require('./views/nav2/Table2.vue');

var _Table6 = _interopRequireDefault(_Table5);

var _Form = require('./views/nav2/Form.vue');

var _Form2 = _interopRequireDefault(_Form);

var _user = require('./views/nav2/user.vue');

var _user2 = _interopRequireDefault(_user);

var _Page = require('./views/nav3/Page4.vue');

var _Page2 = _interopRequireDefault(_Page);

var _Page3 = require('./views/nav3/Page5.vue');

var _Page4 = _interopRequireDefault(_Page3);

var _Page5 = require('./views/nav3/Page51.vue');

var _Page6 = _interopRequireDefault(_Page5);

var _Page7 = require('./views/nav1/Page6.vue');

var _Page8 = _interopRequireDefault(_Page7);

var _echarts = require('./views/charts/echarts.vue');

var _echarts2 = _interopRequireDefault(_echarts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = [{
    path: '/login',
    component: _Login2.default,
    name: '',
    hidden: true
}, {
    path: '/404',
    component: _2.default,
    name: '',
    hidden: true
}, {
    path: '/',
    component: _Home2.default,
    name: '',
    iconCls: 'fa fa-address-card',
    leaf: true,
    children: [{ path: '/page6', component: _Page8.default, name: '用户管理' }]
}, {
    path: '/',
    component: _Home2.default,
    name: '解析管理',
    iconCls: 'el-icon-message',
    children: [{ path: '/main', component: _Main2.default, name: '主页', hidden: true }, { path: '/table', component: _Table2.default, name: '服务器管理' }, { path: '/table1', component: _Table4.default, name: '解析配置管理' }, { path: '/table2', component: _Table6.default, name: '解析配置统计' }, { path: '/form', component: _Form2.default, name: 'Form' }, { path: '/user', component: _user2.default, name: '列表' }]
}, {
    path: '/',
    component: _Home2.default,
    name: '编码赋码管理',
    iconCls: 'fa fa-id-card-o',
    children: [{ path: '/page4', component: _Page2.default, name: '前段码分配/管理' }, { path: '/page5', component: _Page4.default, name: '编码统计' }, { path: '/page51', component: _Page6.default, name: '编码分配查询' }]
}, {
    path: '/',
    component: _Home2.default,
    name: 'Charts',
    iconCls: 'fa fa-bar-chart',
    children: [{ path: '/echarts', component: _echarts2.default, name: 'echarts' }]
}, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
}];

exports.default = routes;

//# sourceMappingURL=routes-compiled.js.map