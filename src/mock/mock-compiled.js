'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _axiosMockAdapter = require('axios-mock-adapter');

var _axiosMockAdapter2 = _interopRequireDefault(_axiosMockAdapter);

var _user = require('./data/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Users = _user.Users;

exports.default = {
  bootstrap: function bootstrap() {
    var mock = new _axiosMockAdapter2.default(_axios2.default);

    mock.restore();
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    mock.onPost('/login').reply(function (config) {
      var _JSON$parse = JSON.parse(config.data),
          username = _JSON$parse.username,
          password = _JSON$parse.password;

      return new _promise2.default(function (resolve, reject) {
        var user = null;
        setTimeout(function () {
          var hasUser = _user.LoginUsers.some(function (u) {
            if (u.username === username && u.password === password) {
              user = JSON.parse((0, _stringify2.default)(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user: user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    mock.onGet('/user/list').reply(function (config) {
      var name = config.params.name;

      var mockUsers = _Users.filter(function (user) {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    mock.onGet('/user/listpage').reply(function (config) {
      var _config$params = config.params,
          page = _config$params.page,
          name = _config$params.name;

      var mockUsers = _Users.filter(function (user) {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      var total = mockUsers.length;
      mockUsers = mockUsers.filter(function (u, index) {
        return index < 15 * page && index >= 15 * (page - 1);
      });
      return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    mock.onGet('/user/remove').reply(function (config) {
      var id = config.params.id;

      _Users = _Users.filter(function (u) {
        return u.id !== id;
      });
      return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    mock.onGet('/user/batchremove').reply(function (config) {
      var ids = config.params.ids;

      ids = ids.split(',');
      _Users = _Users.filter(function (u) {
        return !ids.includes(u.id);
      });
      return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    mock.onGet('/user/edit').reply(function (config) {
      var _config$params2 = config.params,
          id = _config$params2.id,
          name = _config$params2.name,
          addr = _config$params2.addr,
          age = _config$params2.age,
          birth = _config$params2.birth,
          sex = _config$params2.sex;

      _Users.some(function (u) {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    mock.onGet('/user/add').reply(function (config) {
      var _config$params3 = config.params,
          name = _config$params3.name,
          addr = _config$params3.addr,
          age = _config$params3.age,
          birth = _config$params3.birth,
          sex = _config$params3.sex;

      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new _promise2.default(function (resolve, reject) {
        setTimeout(function () {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });
  }
};

//# sourceMappingURL=mock-compiled.js.map