<template>
	<section>
		<!--link页面-->
		<el-col :span="24" style="padding-bottom: 10px;padding-top: 10px;">
			<span>服务器：{{serverName}}</span>
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
		<el-table :data="resolveConfigsIn" highlight-current-row v-loading="listLoadingIn" max-height="500" style="width: 100%;" border>
			<!--选择框-->
			<!--<el-table-column type="selection" width="55"></el-table-column>-->

			<el-table-column type="index" width="80" align="center" label="序号">
			</el-table-column>
			<!--type-->
			<el-table-column prop="type" label="解析类型" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--identifier-->
			<el-table-column prop="identifier" label="解析标识" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--result-->
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
		<el-table :data="resolveConfigsOut" highlight-current-row v-loading="listLoadingOut" max-height="500" style="width: 100%;" border>
			<!--选择框-->
			<!--<el-table-column type="selection" width="55"></el-table-column>-->

			<el-table-column type="index" width="80" align="center" label="序号">
			</el-table-column>
			<!--type-->
			<el-table-column prop="type" label="解析类型" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--identifier-->
			<el-table-column prop="identifier" label="解析标识" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--result-->
			<el-table-column prop="result" label="解析结果" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>

			<el-table-column label="操作" min-width="180" align="center">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
				</template>
			</el-table-column>
		</el-table>


	</section>
</template>
<style>

</style>

<script>
    import util from '../../common/js/util'
    import { removeResolveConfigFromServer, addResolveConfigToServer, searchResolveConfigsIn, searchResolveConfigsOut, getResolveConfigPage, addResolveConfig, removeResolveConfig, batchRemoveResolveConfigs, associateServers, getServerStatePage, searchCodeType } from '../../api/api';

    export default {
        data() {
            return {
                serverId: this.$route.query.serverInfo.serverId,
                serverName: this.$route.query.serverInfo.serverName,
                resolveConfigsIn: [],
                resolveConfigsOut: [],

                resolveQueryWordsIn: '',
                resolveQueryWordsOut: '',

                listLoadingIn: false,
                listLoadingOut: false,

//				sels: [],//列表选中列


            }
        },
        methods: {

            //获取已添加的解析配置列表
            getResolveConfigsIn: function () {
                let para = {
                    type: 'in',
                    resolveQueryWords: this.resolveQueryWordsIn,
                    serverId: this.serverId,
                };
                this.listLoadingIn = true;
                searchResolveConfigsIn(para).then((res) => {
                    let len = res.data.length;
                    let data = res.data;
                    let tempResolveConfigsIn = [];
                    for(let i=0; i<len; i++) {
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

                    this.listLoadingIn = false;
                }, (res) => {
                    this.$message.error('数据加载失败!');
                    this.listLoadingIn = false;
				}).catch(() => {

                });
            },

            //获取未添加的解析配置列表
            getResolveConfigsOut: function () {
                let para = {
                    type: 'out',
                    resolveQueryWords: this.resolveQueryWordsOut,
                    serverId: this.serverId,
                };
                this.listLoadingOut = true;
                searchResolveConfigsOut(para).then((res) => {
                    let len = res.data.length;
                    let data = res.data;
                    let tempResolveConfigsOut = [];
                    for(let i=0; i<len; i++) {
                        let singleResolveConfigOut = {
                            configId: '',
                            type: '',
                            identifier: '',
                            result: '',
                        };
                        singleResolveConfigOut.configId =data[i].configId;
                        singleResolveConfigOut.type = data[i].type;
                        singleResolveConfigOut.identifier = data[i].identify;
                        singleResolveConfigOut.result = data[i].result;

                        tempResolveConfigsOut.push(singleResolveConfigOut);
                    }
                    this.resolveConfigsOut = tempResolveConfigsOut;

                    this.listLoadingOut = false;
                }, (res) => {
                    this.$message.error('数据加载失败!');
                    this.listLoadingOut = false;
                }).catch(() => {

                });
            },

            //处理删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该解析项吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoadingIn = true;
                    let para = {
                        serverId: this.serverId,
                        configId: row.configId,
                    };
                    removeResolveConfigFromServer(para).then((res) => {
                        this.listLoadingIn = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.resolveQueryWordsIn = '';
                        this.resolveQueryWordsOut = '';
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
                    this.listLoadingOut = true;
                    let para = {
                        serverId: this.serverId,
                        configId: row.configId,
                    };
                    addResolveConfigToServer(para).then((res) => {
                        this.listLoadingOut = false;
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.resolveQueryWordsIn = '';
                        this.resolveQueryWordsOut = '';
                        this.getResolveConfigsIn();
                        this.getResolveConfigsOut();
                    });
                }).catch(() => {

                });

            },

//            selsChange: function (sels) {
//                this.sels = sels;
//            },
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