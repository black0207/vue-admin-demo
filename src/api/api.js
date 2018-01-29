import axios from 'axios';

let base = '';
let baseCode = 'http://192.168.12.79:8080';//编码url
let baseEnode = '';//解析url
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
export const getServerStatePage = params => { return axios.get(`${baseWGQ}/CBSP/researchServiceState`, { params: params }); }
export const getResolveConfigPage = params => { return axios.get(`${baseWGQ}/CBSP/researchParseConfig`, { params: params }); }
export const addResolveConfig = params => { return axios.get(`${baseWGQ}/CBSP/addParseConfig`, { params: params }); };
export const removeResolveConfig = params => { return axios.get(`${baseWGQ}/CBSP/deleteParseConfig`, { params: params }); };
// export const batchRemoveResolveConfigs = params => { return axios.get(`${baseWGQ}/CBSP/batchDeleteParseConfig`, { params: params }); };
export const associateServers = params => { return axios.get(`${baseWGQ}/CBSP/relateService`, { params: params }); };
export const configIF = params => { return axios.get(`${baseWGQ}/CBSP/controlServiceState`, { params: params }); };

//编码赋码接口
export const addFrontCode = params => { return axios.get(`${baseCode}/CodeSystem/codeType/insert`, { params: params }); };
//zxf增加的
export const getServerInfoPage = params => { return axios.get(`${base}/serverinfo/infopage`, { params: params }); }