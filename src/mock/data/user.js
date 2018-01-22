import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: 'admin'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        birth: Mock.Random.date(),
        sex: Mock.Random.integer(0, 1)
    }));
}
export { LoginUsers, Users};


//zqc增加的
const Servers = [];
for (let i = 0; i < 99; i++) {
  Servers.push(Mock.mock({
        name: Mock.Random.cname(),
        workingState: Mock.Random.integer(0, 1),
        softwareVersion: Mock.Random.date(),
        configUpdate: Mock.Random.integer(0, 1),
        resolveStatistic: Mock.Random.integer(0, 1000),
    }));
}
export { Servers };

const ResolveConfigs = [];
for (let i = 0; i < 99; i++) {
    ResolveConfigs.push(Mock.mock({
        resolveType: Mock.Random.integer(0, 5),
        resolveId: Mock.Random.integer(0, 5),
        resolveRes: Mock.Random.date(),
        associatedServers: Mock.Random.integer(0, 1),
    }));
}
export { ResolveConfigs } ;
