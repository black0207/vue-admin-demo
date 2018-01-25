import axios from 'axios';

let base = '';
let baseCode = 'http://192.168.12.79:8080';//编码url
let baseEnode = '';//解析url
let baseWGQ = 'http://192.168.12.86:8080';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

//zqc增加的
export const getServerStatePage = params => { return axios.get(`${baseWGQ}/CBSP/researchServiceState`, { params: params }); }
export const getResolveConfigPage = params => { return axios.get(`${baseWGQ}/CBSP/researchParseConfig`, { params: params }); }
export const addResolveConfig = params => { return axios.get(`${baseWGQ}/CBSP/addParseConfig`, { params: params }); };
export const removeResolveConfig = params => { return axios.get(`${baseWGQ}/CBSP/deleteParseConfig`, { params: params }); };
// export const batchRemoveResolveConfigs = params => { return axios.get(`${baseWGQ}/CBSP/batchDeleteParseConfig`, { params: params }); };
export const associateServers = params => { return axios.get(`${baseWGQ}/CBSP/associateServers`, { params: params }); };
export const configIF = params => { return axios.get(`${baseWGQ}/CBSP/associateServers`, { params: params }); };

//编码赋码接口
export const addFrontCode = params => { return axios.get(`${baseCode}/CodeSystem/codeType/insert`, { params: params }); };