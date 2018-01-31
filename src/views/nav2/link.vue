<template>
	<section>
		<!--link页面-->
		<el-col :span="24" style="padding-bottom: 10px;padding-top: 10px;">
			<span>服务器：{{this.serverInfo.serverName}}</span>
			<!--<el-form :inline="true">-->
				<!--<el-form-item>-->
					<!--<el-input v-model="resolveQueryWords" placeholder="类型/标识/结果"></el-input>-->
				<!--</el-form-item>-->
				<!--<el-form-item>-->
					<!--<el-button type="primary" @click="getResolveConfigs">查询</el-button>-->
				<!--</el-form-item>-->
				<!--<el-form-item>-->
				<!--<el-button type="primary" @click="handleAdd">新增</el-button>-->
				<!--</el-form-item>-->
			<!--</el-form>-->
		</el-col>
		<el-col :span="24" style="padding-bottom: 5px;">
			<el-form :inline="true">
				<el-form-item label="已添加的解析信息： " >
					<el-input v-model="resolveQueryWordsIn" placeholder="类型/标识/结果"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getResolveConfigsIn">筛选</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--已添加的配置-->
		<el-table :data="resolveConfigsIn" highlight-current-row v-loading="listLoading" max-height="500" style="width: 100%;" border>

			<el-table-column type="index" width="80" align="center" label="序号">
			</el-table-column>
			<!--name-->
			<el-table-column prop="type" label="解析类型" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--workingState-->
			<el-table-column prop="identifier" label="解析标识" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--softwareVersion-->
			<el-table-column prop="result" label="解析结果" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>

			<el-table-column label="操作" min-width="180" align="center">
				<template scope="scope">
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-col :span="24" style="padding-bottom: 5px;padding-top: 10px;">
			<el-form :inline="true">
				<el-form-item label="未添加的解析信息： " >
					<el-input v-model="resolveQueryWordsOut" placeholder="类型/标识/结果"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getResolveConfigsOut">筛选</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--未添加的配置-->
		<el-table :data="resolveConfigsOut" highlight-current-row v-loading="listLoading" max-height="500" style="width: 100%;" border>

			<el-table-column type="index" width="80" align="center" label="序号">
			</el-table-column>
			<!--name-->
			<el-table-column prop="type" label="解析类型" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--workingState-->
			<el-table-column prop="identifier" label="解析标识" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--softwareVersion-->
			<el-table-column prop="result" label="解析结果" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>

			<el-table-column label="操作" min-width="180" align="center">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleAssociation(scope.$index, scope.row)">添加</el-button>
				</template>
			</el-table-column>
		</el-table>


	</section>
</template>
<style>

</style>

<script>
    import util from '../../common/js/util'
    import { getResolveConfigPage, addResolveConfig, removeResolveConfig, batchRemoveResolveConfigs, associateServers, getServerStatePage, searchCodeType } from '../../api/api';

    export default {
        data() {
            return {
                resolveConfigsIn: [],
                resolveConfigsOut: [],


                serversName: [],
				resolveTypes:[],
                resolveQueryWordsIn: '',
                resolveQueryWordsOut: '',
//                resolveConfigs: [],
//                total: 0,
//				pageSize: 10,
//                page: 1,
                listLoading: false,
				serverInfo: this.$route.query.serverInfo,
//				sels: [],//列表选中列

                associationFormVisible: false,//关联界面是否显示
                associationLoading: false,

                //关联界面数据
                associationForm: {
                    configId: '',
                    type: '',
                    identifier: '',
                    result: '',
                    associatedServersId: [],

                },

            }
        },
        methods: {
            handleCurrentChange(val) {
//                this.page = val;
                this.getResolveConfigsIn();
                this.getResolveConfigsOut();

            },
            //获取已添加的解析配置列表
            getResolveConfigsIn() {
                let para = {
//                    page: this.page,
                    resolveQueryWordsIn: this.resolveQueryWordsIn,
                    serverId: this.serverInfo.serverId,
                };
                this.listLoading = true;
                searchResolveConfigsIn(para).then((res) => {
                    this.total = res.data.length;
                    let data = res.data;
                    let tempResolveConfigsIn = [];
                    for(let i=0; i<this.total; i++) {
                        let singleResolveConfigIn = {
                            configId: '',
                            type: '',
                            identifier: '',
                            result: '',
						};
                        singleResolveConfigIn.configId =data[i].configId;
                        singleResolveConfigIn.type = data[i].type;
                        singleResolveConfigIn.identifier = data[i].identify;
                        singleResolveConfigIn.result = data[i].result;

                        tempResolveConfigsIn.push(singleResolveConfigIn);
					}
					this.resolveConfigsIn = tempResolveConfigsIn;

                    this.listLoading = false;
                }, (res) => {
                    this.$message.error('数据加载失败!');
                    this.listLoading = false;
				}).catch(() => {

                });
            },

            //获取未添加的解析配置列表
            getResolveConfigsOut() {
                let para = {
//                    page: this.page,
                    resolveQueryWordsOut: this.resolveQueryWordsOut,
                    serverId: this.serverInfo.serverId,
                };
                this.listLoading = true;
                searchResolveConfigsOut(para).then((res) => {
                    this.total = res.data.length;
                    let data = res.data;
                    let tempResolveConfigsIn = [];
                    for(let i=0; i<this.total; i++) {
                        let singleResolveConfigIn = {
                            configId: '',
                            type: '',
                            identifier: '',
                            result: '',
                        };
                        singleResolveConfigIn.configId =data[i].configId;
                        singleResolveConfigIn.type = data[i].type;
                        singleResolveConfigIn.identifier = data[i].identify;
                        singleResolveConfigIn.result = data[i].result;

                        tempResolveConfigsIn.push(singleResolveConfigIn);
                    }
                    this.resolveConfigsIn = tempResolveConfigsIn;

                    this.listLoading = false;
                }, (res) => {
                    this.$message.error('数据加载失败!');
                    this.listLoading = false;
                }).catch(() => {

                });
            },

            //处理删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该解析项吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {
                        serverId: this.serverInfo.serverId,
                        configId: row.configId,
                    };
                    removeResolveConfigFromServer(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getResolveConfigsIn();
                        this.getResolveConfigsOut();
                    });
                }).catch(() => {

                });
            },

            //处理添加
            handleAdd: function (index, row) {
                this.$confirm('确认添加该解析项吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {
                        serverId: this.serverInfo.serverId,
                        configId: row.configId,
                    };
                    addResolveConfigToServer(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.getResolveConfigsIn();
                        this.getResolveConfigsOut();
                    });
                }).catch(() => {

                });

            },

            selsChange: function (sels) {
                this.sels = sels;
            },
//            //批量删除
//            batchRemove: function () {
//                var ids = this.sels.map(item => item.id).toString();
//                this.$confirm('确认删除选中记录吗？', '提示', {
//                    type: 'warning'
//                }).then(() => {
//                    this.listLoading = true;
//                    let para = { ids: ids };
//                    batchRemoveCoonfigs(para).then((res) => {
//                        this.listLoading = false;
//
//                        this.$message({
//                            message: '删除成功',
//                            type: 'success'
//                        });
//                        this.getResolveConfigs();
//                    });
//                }).catch(() => {
//
//                });
//            }
        },
        mounted() {
            this.getResolveConfigsIn();
            this.getResolveConfigsOut();
        }
    }

</script>

<style scoped>

</style>