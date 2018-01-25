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
		<el-table :data="servers" highlight-current-row v-loading="listLoading" style="width: 100%;" border>

			<el-table-column label="序号" type="index" width="80" align="center">
			</el-table-column>
			<!--name-->
			<el-table-column prop="serviceName" label="服务器名称" min-width="140" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<!--workingState-->
			<el-table-column prop="workState" label="工作状态" min-width="140" sortable align="center">
			</el-table-column>
			<!--softwareVersion-->
			<el-table-column prop="softVersion" label="软件版本" min-width="140" sortable align="center">
			</el-table-column>
			<!--configUpdate-->
			<el-table-column prop="updateState" label="配置更新状态" min-width="160" sortable align="center">
			</el-table-column>
			<!--resolveStatistic-->
			<el-table-column prop="analyCount" label="解析量统计" min-width="160" sortable align="center">
			</el-table-column>
			<el-table-column label="操作" min-width="150" align="center">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleControl(scope.$index, scope.row)">状态控制</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--状态控制界面-->
		<el-dialog title="状态控制" v-model="controlFormVisible" :close-on-click-modal="false">
			<el-form :model="controlForm" label-width="120px" ref="controlForm">
				<el-form-item label="服务器名称">
					<el-input v-model="controlForm.serviceName" readonly style="width: 200px;"></el-input>
				</el-form-item>

				<el-form-item label="配置更新">
					<el-input v-model="controlForm.config" readonly style="width: 200px;" placeholder="请手动更新配置"></el-input>
					<el-button type="success" @click.native="configUpdate" :loading="updateLoading">更新</el-button>
				</el-form-item>
				<el-form-item label="软件版本">
					<el-input v-model="controlForm.softVersion" readonly style="width: 200px;"></el-input>
					<el-button type="success" @click.native="checkUpdate" disabled>检查更新</el-button>
				</el-form-item>
				<el-form-item label="关机/重启">
					<el-button type="danger" @click.native="controlOff" :loading="offLoading">关机</el-button>
					<el-button type="success" @click.native="controlRestart" :loading="restartLoading">重启</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getServerStatePage, configIF } from '../../api/api';

	export default {
		data() {
            return {
                serverQueryWords:'',
                servers: [],
                total: 0,
                page: 1,
                listLoading: false,
//				sels: [],//列表选中列

                controlFormVisible: false,//编辑界面是否显示
                updateLoading: false,
                offLoading: false,
                restartLoading: false,

                //控制界面数据
                controlForm: {
					serverId:'',
                    serviceName: '',
                    softVersion: '',
                    config: '',
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
//					page: this.page,
                    serverQueryWords: this.serverQueryWords,
				};
                this.listLoading = true;

                getServerStatePage(para).then((res) => {
					this.total = res.data.length;
					this.servers = res.data;
//					console.log(res.data);
					this.listLoading = false;
				});
			},

			//显示控制界面
			handleControl: function (index, row) {
				this.controlFormVisible = true;
				this.controlForm = Object.assign({}, row);
			},

			//更新配置
            configUpdate: function () {
                this.updateLoading = true;
                let para = {
                    type: 'update',
                    serviceId: this.controlForm.serverId,
				};
                configIF(para).then((res) => {
                    this.updateLoading = false;
                    this.$message({
                        message: '更新成功',
                        type: 'success'
                    });
                    this.controlForm.config = '已更新,更新时间:'+res.updateTime;
                    this.getServerStates();

				});
			},
            //关机
            controlOff: function () {
                this.offLoading = true;
                let para = {
                    type: 'off',
                    serviceId: this.controlForm.serverId,
                };
                configIF(para).then((res) => {
                    this.offLoading = false;
                    this.$message({
                        message: '关机成功',
                        type: 'success'
                    });
                });
            },
            //重启
            controlRestart: function () {
                this.restartLoading = true;
                let para = {
                    type: 'restart',
                    serviceId: this.controlForm.serverId,
                };
                configIF(para).then((res) => {
                    this.restartLoading = false;
                    this.$message({
                        message: '重启成功',
                        type: 'success',
                    });
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