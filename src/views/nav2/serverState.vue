<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="serverQueryWords" placeholder="服务器名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getServerStates">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="serversState" highlight-current-row v-loading="listLoading" style="width: 100%;" border>

			<el-table-column label="序号" type="index" width="80" align="center">
			</el-table-column>
			<!--name-->
			<el-table-column prop="serverName" label="服务器名称" min-width="140" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<!--workingState-->
			<el-table-column prop="workingState" label="工作状态" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--softwareVersion-->
			<el-table-column prop="softwareVersion" label="软件版本" min-width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--configUpdate-->
			<el-table-column prop="configUpdateState" label="配置更新状态" min-width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<!--resolveStatistic-->
			<el-table-column prop="resolveQuantity" label="解析量统计" min-width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="操作" min-width="150" align="center">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleControl(scope.$index, scope.row)">状态控制</el-button>
					<el-button type="primary" size="small" @click="handleResolveConfigs(scope.$index, scope.row)">配置管理</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--状态控制界面-->
		<el-dialog title="状态控制" :visible.sync="controlFormVisible" :close-on-click-modal="false" custom-class="customControlDialogSize">
			<el-form :model="controlForm" label-width="120px" ref="controlForm">
				<el-form-item label="服务器名称">
					<el-input v-model="controlForm.serverName" readonly style="width: 415px;"></el-input>
				</el-form-item>

				<el-form-item label="配置更新">
					<el-input v-model="controlForm.configUpdateState" readonly style="width: 300px;" placeholder="请手动更新配置" ></el-input>
					<el-button type="success" @click.native="configUpdate" :loading="updateLoading" style="width: 100px; margin-left: 10px;">更新</el-button>
				</el-form-item>
				<el-form-item label="软件版本">
					<el-input v-model="controlForm.softwareVersion" readonly style="width: 300px;"></el-input>
					<el-button type="success" @click.native="checkUpdate" disabled style="width: 100px; margin-left: 10px;">检查更新</el-button>
				</el-form-item>
				<el-form-item label="开关机">
					<el-button :disabled="turnOnDisabled" type="success" @click.native="turnOn" :loading="turnOnLoading" style="width: 100px;">开机</el-button>
					<el-button :disabled="turnOffDisabled" type="danger" @click.native="turnOff" :loading="turnOffLoading" style="width: 100px; margin-left: 10px;">关机</el-button>

				</el-form-item>
			</el-form>
		</el-dialog>

	</section>
</template>

<style>
	.customControlDialogSize {
		max-width: 600px;
		min-width: 600px;
	}
</style>

<script>
	import util from '../../common/js/util'
	import { getServerStatePage, configIF } from '../../api/api';

	export default {
		data() {
            return {
                serverQueryWords:'',
                serversState: [],
                total: 0,
				pageSize: 10,
                page: 1,
                listLoading: false,
//				sels: [],//列表选中列

                controlFormVisible: false,//编辑界面是否显示
                updateLoading: false,
                turnOffLoading: false,
                turnOnLoading: false,
                turnOnDisabled: false,
                turnOffDisabled: false,

                //控制界面数据
                controlForm: {
					serverId:'',
                    serverName: '',
                    softwareVersion: '',
                    configUpdateState: '',
                },
            }
        },


		methods: {

			handleCurrentChange(val) {
				this.page = val;
				this.getServerStates();
			},
			//获取服务器状态列表
            getServerStates() {
				let para = {
					page: this.page,
                    serverQueryWords: this.serverQueryWords,
				};
                this.listLoading = true;
                getServerStatePage(para).then((res) => {
                    console.log(res.data);
					this.total = res.data.length;
					let data = res.data;
					let tempServersState = [];
					for (let i=0; i<this.total; i++) {
                        let singleServersState = {
                            serverId: '',
                            serverName: '',
                            workingState: '',
                            softwareVersion: '',
                            configUpdateState: '',
                            resolveQuantity: '',
                        };
                        singleServersState.serverId = data[i].serverId;
                        singleServersState.serverName = data[i].serverName;
                        singleServersState.workingState = data[i].workState;
                        singleServersState.softwareVersion = data[i].softVersion;
                        singleServersState.configUpdateState = data[i].updateState;
                        singleServersState.resolveQuantity = data[i].analyCount;

                        tempServersState.push(singleServersState);

					}
//
                    this.serversState = tempServersState.filter((u, index) => index < this.pageSize * para.page && index >= this.pageSize * (para.page - 1));
					this.listLoading = false;
				}, (res) => {
                    this.$message.error('数据加载失败!');
                    this.listLoading = false;
				});
			},

			//显示控制界面
			handleControl: function (index, row) {
			    if (row.workingState == 'on') {
			        this.turnOnDisabled = true;
                    this.turnOffDisabled = false;
				} else if (row.workingState == 'off'){
                    this.turnOnDisabled = false;
                    this.turnOffDisabled = true;
				}
                this.controlForm.serverId = row.serverId;
                this.controlForm.serverName = row.serverName;
                this.controlForm.softwareVersion = row.softwareVersion;
                this.controlForm.configUpdateState = '';
                this.controlFormVisible = true;
			},
            handleResolveConfigs:function (index, row) {

			    this.$router.push({
					path:"/link",
					query:{
					    serverInfo:row
					}
				});

            },
			//更新配置
            configUpdate: function () {
                this.updateLoading = true;
                let para = {
                    type: 'update',
                    serviceId: this.controlForm.serverId,
				};
                configIF(para).then((res) => {
                    let resArray = res.data.split(",");
                    if( resArray[0] == 'success') {
                        this.updateLoading = false;
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                        this.controlForm.configUpdateState = '已更新,更新时间: '+ resArray[1];
                        this.getServerStates();
					} else if ( resArray[0] == 'fail') {
                        this.updateLoading = false;
                        this.$message.error('更新失败！');
					}

				}, (res) => {
                    this.updateLoading = false;
                    this.$message.error('出错了！');
                });
			},

            //开机
            turnOn: function () {
                this.turnOnLoading = true;
                let para = {
                    type: 'turnOn',
                    serviceId: this.controlForm.serverId,
                };
                configIF(para).then((res) => {
                    let resArray = res.data.split(",");
                    if( resArray[0] == 'success') {
                        this.turnOnLoading = false;
                        this.$message({
                            message: '开机成功',
                            type: 'success',
                        });
                        this.turnOnDisabled = true;
                        this.turnOffDisabled = false;
                        this.getServerStates();
					} else if ( resArray[0] == 'fail') {
                        this.turnOnLoading = false;
                        this.$message.error('开机失败！');
                    }

                },(res) => {
                    this.turnOnLoading = false;
                    this.$message.error('出错了');
				});
            },

            //关机
            turnOff: function () {
                this.turnOffLoading = true;
                let para = {
                    type: 'turnOff',
                    serviceId: this.controlForm.serverId,
                };
                configIF(para).then((res) => {
                    let resArray = res.data.split(",");
                    if( resArray[0] == 'success') {
                        this.turnOffLoading = false;
                        this.$message({
                            message: '关机成功',
                            type: 'success',
                        });
                        this.turnOnDisabled = false;
                        this.turnOffDisabled = true;
                        this.getServerStates();
					} else if ( resArray[0] == 'fail') {
                        this.turnOffLoading = false;
                        this.$message.error('关机失败！');
                    }

                }, (res) => {
                    this.turnOffLoading = false;
                    this.$message.error('出错了！');
                });
            },
		},
		mounted() {
			this.getServerStates();
		},
	}

</script>

<style scoped>

</style>