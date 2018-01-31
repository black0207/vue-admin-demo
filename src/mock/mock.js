import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users } from './data/user';
import { Servers } from './data/user';
import { ResolveConfigs } from './data/user';
import { Serverinfo } from './data/user';
let _Users = Users;
let _Servers = Servers;
let _ResolveConfigs = ResolveConfigs;
let _Serverinfo = Serverinfo;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
   let mock = new MockAdapter(axios);

    mock.restore();//关闭mock模拟数据

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 500, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表
    mock.onGet('/user/list').reply(config => {
      let {name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 15 * page && index >= 15 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //zqc增加的
    //获取服务器状态列表（分页）
      mock.onGet('/server/statepage').reply(config => {
          let {page, name} = config.params;
          let mockServers = _Servers.filter(server => {
              if (name && server.name.indexOf(name) == -1) return false;
              return true;
          });
          let total = mockServers.length;
          mockServers = mockServers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve([200, {
                      total: total,
                      servers: mockServers
                  }]);
              }, 1000);
          });
      });

      //获取解析配置列表（分页）
      mock.onGet('/resolve/configpage').reply(config => {
          let {page, resolveType} = config.params;
          let mockResolveConfigs = _ResolveConfigs.filter(resolveConfigs => {
              if (resolveType && resolveConfigs.resolveType.indexOf(resolveType) == -1) return false;
              return true;
          });
          let total = mockResolveConfigs.length;
          mockResolveConfigs = mockResolveConfigs.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve([200, {
                      total: total,
                      resolveConfigs: mockResolveConfigs,
                  }]);
              }, 1000);
          });
      });
      //zqc

      //zxf增加的
      //获取服务器管理信息列表（分页）
      mock.onGet('/serverinfo/infopage').reply(config => {
          let {page, name} = config.params;
          let mockServerinfo = _Serverinfo.filter(serverinfo => {
              if (name && serverinfo.name.indexOf(name) == -1) return false;
              return true;
          });
          let total = mockServerinfo.length;
          mockServerinfo = mockServerinfo.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
          return new Promise((resolve, reject) => {
              setTimeout(() => {
                  resolve([200, {
                      total: total,
                      serverinfo: mockServerinfo
                  }]);
              }, 1000);
          });
      });
      //zxf

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, addr, age, birth, sex } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.addr = addr;
          u.age = age;
          u.birth = birth;
          u.sex = sex;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    // 新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, addr, age, birth, sex } = config.params;
      _Users.push({
        name: name,
        addr: addr,
        age: age,
        birth: birth,
        sex: sex
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });


  }
};