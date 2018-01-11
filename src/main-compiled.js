'use strict';

var _babelPolyfill = require('babel-polyfill');

var _babelPolyfill2 = _interopRequireDefault(_babelPolyfill);

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

var _elementUi = require('element-ui');

var _elementUi2 = _interopRequireDefault(_elementUi);

require('element-ui/lib/theme-default/index.css');

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _store = require('./vuex/store');

var _store2 = _interopRequireDefault(_store);

var _vuex = require('vuex');

var _vuex2 = _interopRequireDefault(_vuex);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _mock = require('./mock');

var _mock2 = _interopRequireDefault(_mock);

require('font-awesome/css/font-awesome.min.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mock2.default.bootstrap();


_vue2.default.use(_elementUi2.default);
_vue2.default.use(_vueRouter2.default);
_vue2.default.use(_vuex2.default);

var router = new _vueRouter2.default({
  routes: _routes2.default
});

router.beforeEach(function (to, from, next) {
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  var user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' });
  } else {
    next();
  }
});

new _vue2.default({
  router: router,
  store: _store2.default,

  render: function render(h) {
    return h(_App2.default);
  }
}).$mount('#app');

//# sourceMappingURL=main-compiled.js.map