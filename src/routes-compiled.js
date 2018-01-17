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

var _serverMan = require('./views/nav2/serverMan.vue');

var _serverMan2 = _interopRequireDefault(_serverMan);

var _serverState = require('./views/nav2/serverState.vue');

var _serverState2 = _interopRequireDefault(_serverState);

var _configMan = require('./views/nav2/configMan.vue');

var _configMan2 = _interopRequireDefault(_configMan);

var _Table = require('./views/nav2/Table2.vue');

var _Table2 = _interopRequireDefault(_Table);

var _Form = require('./views/nav2/Form.vue');

var _Form2 = _interopRequireDefault(_Form);

var _user = require('./views/nav2/user.vue');

var _user2 = _interopRequireDefault(_user);

var _frontCodeMan = require('./views/nav3/frontCodeMan.vue');

var _frontCodeMan2 = _interopRequireDefault(_frontCodeMan);

var _backCodeMan = require('./views/nav3/backCodeMan.vue');

var _backCodeMan2 = _interopRequireDefault(_backCodeMan);

var _Page = require('./views/nav3/Page5.vue');

var _Page2 = _interopRequireDefault(_Page);

var _codeAllocation = require('./views/nav3/codeAllocation.vue');

var _codeAllocation2 = _interopRequireDefault(_codeAllocation);

var _Page3 = require('./views/nav1/Page6.vue');

var _Page4 = _interopRequireDefault(_Page3);

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
    name: '解析服务管理',
    iconCls: 'el-icon-message',
    children: [{ path: '/main', component: _Main2.default, name: '主页', hidden: true }, { path: '/serverMan', component: _serverMan2.default, name: '解析服务器管理' }, { path: '/serverState', component: _serverState2.default, name: '服务器状态管理' }, { path: '/configMan', component: _configMan2.default, name: '解析配置管理' }, { path: '/configStats', component: _echarts2.default, name: '解析配置统计' }, { path: '/form', component: _Form2.default, name: 'Form', hidden: true }, { path: '/user', component: _user2.default, name: '列表', hidden: true }]
}, {
    path: '/',
    component: _Home2.default,
    name: '编码赋码管理',
    iconCls: 'fa fa-id-card-o',
    children: [{ path: '/frontCodeMan', component: _frontCodeMan2.default, name: '前/后码段管理' }, { path: '/codeStats', component: _echarts2.default, name: '编码统计' }]
}, {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
}];

exports.default = routes;

//# sourceMappingURL=routes-compiled.js.map