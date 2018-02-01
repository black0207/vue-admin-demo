import axios from 'axios';

let base = '';
let baseCode = 'http://192.168.12.79:8080';//编码url
let baseEnode = '';//解析url
let baseInfo = 'http://192.168.12.86:8080';//解析服务器查询url
let baseAddInfo = 'http://192.168.12.86:8080';//解析服务器添加url
let baseEditInfo = 'http://192.168.12.86:8080';//解析服务器更新url
let baseDeleteInfo = 'http://192.168.12.86:8080';//解析服务器删除url
let baseWGQ = 'http://192.168.12.86:8080';
let suffixCode = 'http://192.168.12.150:8080';//后段码url

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//新增编码类型 by LZY
export const addCodeType = params => { return axios.post(`${baseCode}/CodeSystem/codeType/insert`, params); };
//编辑编码类型 by LZY
export const updateCodeType = params => { return axios.post(`${baseCode}/CodeSystem/codeType/update`, params); };
//查询编码类型 by LZY
export const searchCodeType = params => { return axios.get(`${baseCode}/CodeSystem/codeType/queryByCondition`, { params: params }); };
//查询公司/组织的名称ID by LZY
export const  searchOrgInfo = params =>{ return axios.get(`${baseCode}/CodeSystem/organization/findList`, { params: params });};
//查询前码段 by LZY
export const searchPreCode = params => { return axios.get(`${baseCode}/CodeSystem/preCode/findList`, { params: params }); };
//新增前码段 by LZY
export const addPreCode = params => { return axios.post(`${baseCode}/CodeSystem/preCode/insert`, params); };
//批量生成后码段 by LZY
export const  addSuffixCode = params =>{ return axios.post(`${suffixCode}/CodeSystem/SuffixCode/batchInsert`, params);};
//查询特定前段码对应的后码段 by LZY
export const  searchSuffixCode = params =>{ return axios.get(`${suffixCode}/CodeSystem/SuffixCode/findSuffixList`, { params: params });};
//修改后码段状态 by LZY
export const  modifySuffixStatus = params =>{ return axios.post(`${suffixCode}/CodeSystem/SuffixCode/modifySuffixCode`, params);};




//zqc增加的
//获取服务器状态信息
export const getServerStatePage = params => { return axios.get(`${baseWGQ}/Manager/researchServiceState`, { params: params }); }
//获取配置信息
export const getResolveConfigPage = params => { return axios.get(`${baseWGQ}/Manager/researchParseConfig`, { params: params }); }
//添加一条配置
export const addResolveConfig = params => { return axios.get(`${baseWGQ}/Manager/addParseConfig`, { params: params }); };
//删除一条配置
export const removeResolveConfig = params => { return axios.get(`${baseWGQ}/Manager/deleteParseConfig`, { params: params }); };
//将一条配置关联到服务器
export const associateServers = params => { return axios.get(`${baseWGQ}/Manager/relateService`, { params: params }); };
//服务器状态控制接口（更新配置、开机、关机）
export const configIF = params => { return axios.get(`${baseWGQ}/Manager/controlServiceState`, { params: params }); };
//查询一个服务器上已有的配置
export const searchResolveConfigsIn = params => { return axios.get(`${baseWGQ}/Manager/operationServerConfig`, { params: params }); };
//查询一个服务器上未添加过的配置
export const searchResolveConfigsOut = params => { return axios.get(`${baseWGQ}/Manager/operationServerConfig`, { params: params }); };
//从服务器上删除一条配置
export const removeResolveConfigFromServer = params => { return axios.get(`${baseWGQ}/Manager/deleteOperServerConfig`, { params: params }); };
//向服务器添加一条配置
export const addResolveConfigToServer = params => { return axios.get(`${baseWGQ}/Manager/addOperServerConfig`, { params: params }); };
//zqc

//编码赋码接口
export const addFrontCode = params => { return axios.get(`${baseCode}/CodeSystem/codeType/insert`, { params: params }); };
//编码概览统计接口--by way
export const getCount = params => { return axios.get(`${baseCode}/CodeSystem/statistics/getCount`); };
export const getCodeType = params => { return axios.get(`${baseCode}/CodeSystem/statistics/getSufCodeByCodeType`); };
export const getSufCodeCount = params => { return axios.get(`${baseCode}/CodeSystem/statistics/getSufCodeCountByOrgName`, { params: params }); };

//解析概览统计接口--by way
let analysisAdr = 'http://192.168.12.86:8080';//编码url
export const getAnalysisCount = params => { return axios.get(`${analysisAdr}/Manager/countParseInfo`); };

//zxf增加的
export const getServerInfoPage = params => { return axios.get(`${baseInfo}/Manager/researchServiceInfo`, { params: params }); }
export const addServerInfo = params => { return axios.get(`${baseAddInfo}/Manager/addServiceInfo`, { params: params }); }
export const editServerInfo = params => { return axios.get(`${baseEditInfo}/Manager/updateServiceInfo`, { params: params }); }
export const deleteServerInfo = params => { return axios.get(`${baseDeleteInfo}/Manager/deleteServiceInfo`, { params: params }); }
// export const getServerInfoPage = params => { return axios.get(`${base}/serverinfo/infopage`, { params: params }); }