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
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">状态控制</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--状态控制界面-->
		<el-dialog title="状态控制" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" ref="editForm">
				<el-form-item label="服务器名称">
					<el-input v-model="editForm.serviceName" readonly style="width: 200px;"></el-input>
				</el-form-item>

				<el-form-item label="配置更新">
					<el-input v-model="editForm.config" readonly style="width: 200px;"></el-input>
					<el-button type="success" @click.native="configUpdate">更新</el-button>
					<!--<el-transfer v-model="editForm.config" :data="dataConfigs" :titles="['备选', '已选']" :button-texts="['删除', '添加']">-->
					<!--</el-transfer>-->
				</el-form-item>
				<el-form-item label="软件版本">
					<el-input v-model="editForm.softVersion" readonly style="width: 200px;"></el-input>

					<el-button type="success" @click.native="checkUpdate">检查更新</el-button>
				</el-form-item>
				<el-form-item label="关机/重启">
					<el-button type="danger" @click.native="editOff" :loading="editLoading">关机</el-button>
					<el-button type="success" @click.native="editRestart">重启</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getServerStatePage } from '../../api/api';

	export default {
		data() {
            return {
                serverQueryWords:'',
                servers: [],
                total: 0,
                page: 1,
                listLoading: false,
//				sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
//				editFormRules: {
//					name: [
//						{ required: true, message: '请输入姓名', trigger: 'blur' }
//					]
//				},
                //编辑界面数据
                editForm: {
//					id: 0,
                    serviceName: '',
                    softVersion: '',
                    config: '',

                },
//                dataConfigs: [
//                    {
//                        key: 1,
//                        label: '配置1',
//                    },
//                    {
//                        key: 2,
//                        label: '配置2',
//                    },
//                    {
//                        key: 3,
//                        label: '配置3',
//                    },
//                    {
//                        key: 4,
//                        label: '配置4',
//                    },
//                    {
//                        key: 5,
//                        label: '配置5',
//                    },
//                    {
//                        key: 6,
//                        label: '配置6',
//                    },
//                    {
//                        key: 7,
//                        label: '配置7',
//                    },
//                    {
//                        key: 8,
//                        label: '配置8',
//                    },
//                    {
//                        key: 9,
//                        label: '配置9',
//                    },
//                    {
//                        key: 10,
//                        label: '配置10',
//                    },
//                ],
//
//                softwareVersions: [
//                    {
//						value: '1',
//						label: '111'
//					}, {
//						value: '2',
//						label: '222'
//					}, {
//						value: '3',
//						label: '333'
//					}, {
//						value: '4',
//						label: '444'
//					}, {
//						value: '5',
//						label: '555'
//                	},
//				],

//				addFormVisible: false,//新增界面是否显示
//				addLoading: false,
//				addFormRules: {
//					name: [
//						{ required: true, message: '请输入姓名', trigger: 'blur' }
//					]
//				},
//				//新增界面数据
//				addForm: {
//					name: '',
//					sex: -1,
//					age: 0,
//					birth: '',
//					addr: ''
//				}
//
//			}
            }
        },
		methods: {
			//性别显示转换
//			formatSex: function (row, column) {
//				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
//			},
			handleCurrentChange(val) {
				this.page = val;
				this.getServerStates();
			},
			//获取用户列表
            getServerStates() {
				let para = {
//					page: this.page,
                    serverQueryWords: this.serverQueryWords,
				};
                this.listLoading = true;

                getServerStatePage(para).then((res) => {
					this.total = res.data.length;
					this.servers = res.data;
					console.log(res.data);
					this.listLoading = false;

				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getServerStates();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getServerStates();
							});
						});
					}
				});
			},
            //关机
            editOff: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认关机？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getServerStates();
                            });
                        });
                    }
                });
            },
            //重启
            editRestart: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getServerStates();
                            });
                        });
                    }
                });
            },
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getServerStates();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getServerStates();
					});
				}).catch(() => {

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