<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.serviceName" placeholder="服务器名称/ 地址/ 归属信息"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">添加</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="serverinfo" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<!--<el-table-column type="selection" width="55">-->
			<!--</el-table-column>-->
			<el-table-column type="index" width="80" label="序号" align="center">
			</el-table-column>
			<el-table-column prop="serviceName" label="服务器名称" width="280" sortable align="center">
			</el-table-column>
			<!--<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="serviceAddress" label="服务器地址" width="280" sortable align="center">
			</el-table-column>
			<el-table-column prop="serviceKey" label="管理秘钥" width="280" sortable align="center">
			</el-table-column>
			<!--<el-table-column prop="birth" label="生日" width="120" sortable>-->
			<!--</el-table-column>-->
			<el-table-column prop="serInfor" label="服务器归属信息" min-width="280" sortable align="center">
			</el-table-column>
			<el-table-column label="操作" width="280" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">更新</el-button>
					<!--<el-button size="small" @click="handleState(scope.$index, scope.row)">状态管理</el-button>-->
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize":total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--更新界面-->
		<el-dialog title="更新" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="服务器名称" prop="serviceName">
					<el-input v-model="editForm.serviceName" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="性别">-->
					<!--<el-radio-group v-model="editForm.sex">-->
						<!--<el-radio class="radio" :label="1">男</el-radio>-->
						<!--<el-radio class="radio" :label="0">女</el-radio>-->
					<!--</el-radio-group>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="年龄">-->
					<!--<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="生日">-->
					<!--<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>-->
				<!--</el-form-item>-->
				<el-form-item label="服务器地址" prop="serviceAddress">
					<el-input type="textarea" v-model="editForm.serviceAddress"></el-input>
				</el-form-item>
				<el-form-item label="管理秘钥" prop="serviceKey">
				<el-input type="textarea" v-model="editForm.serviceKey" ></el-input>
			    </el-form-item>
				<el-form-item label="服务器归属信息" prop="serInfor">
					<el-input type="textarea" v-model="editForm.serInfor" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--添加界面-->
		<el-dialog title="添加" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="服务器名称" prop="serviceName">
					<el-input v-model="addForm.serviceName" auto-complete="off"></el-input>
				</el-form-item>
				<!--<el-form-item label="性别">-->
					<!--<el-radio-group v-model="addForm.sex">-->
						<!--<el-radio class="radio" :label="1">男</el-radio>-->
						<!--<el-radio class="radio" :label="0">女</el-radio>-->
					<!--</el-radio-group>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="年龄">-->
					<!--<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>-->
				<!--</el-form-item>-->
				<!--<el-form-item label="生日">-->
					<!--<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>-->
				<!--</el-form-item>-->
				<el-form-item label="服务器地址" prop="serviceAddress">
					<el-input type="textarea" v-model="addForm.serviceAddress" ></el-input>
				</el-form-item>
				<el-form-item label="管理秘钥" prop="serviceKey">
					<el-input type="textarea" v-model="addForm.serviceKey" ></el-input>
				</el-form-item>
				<el-form-item label="服务器归属信息" prop="serInfor">
					<el-input type="textarea" v-model="addForm.serInfor" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getServerInfoPage, addServerInfo,editServerInfo,deleteServerInfo } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
                    serviceName: ''
				},
				serverinfo: [],
				total: 0,
				page: 1,
				pageSize:15,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
                    serviceName: [
						{ required: true, message: '请输入服务器名称', trigger: 'blur' }
					],
                    serviceAddress: [
                        { required: true, message: '请输入服务器地址', trigger: 'blur' }
                    ],
                    serviceKey: [
                        { required: true, message: '请输入服务器秘钥', trigger: 'blur' }
                    ],
                    serInfor: [
                        { required: true, message: '请输入服务器归属信息', trigger: 'blur' }
                    ]
				},
				//更新界面数据
				editForm: {
					serviceId: 0,
                    serviceName: '',
                    serviceAddress: '',
                    serviceKey: '',
                    serInfor: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
                    serviceName: [
						{ required: true, message: '请输入服务器名称', trigger: 'blur' }
					],
                    serviceAddress: [
                        { required: true, message: '请输入服务器地址', trigger: 'blur' }
                    ],
                    serviceKey: [
                        { required: true, message: '请输入服务器秘钥', trigger: 'blur' }
                    ],
                    serInfor: [
                        { required: true, message: '请输入服务器归属信息', trigger: 'blur' }
                    ]
				},
				//添加界面数据
				addForm: {
                    serviceName: '',
                    serviceAddress: '',
                    serviceKey: '',
                    serInfor: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
                    serviceName: this.filters.serviceName,
					pageSize: this.pageSize
				};
//				console.log(para.serviceName);
				this.listLoading = true;
				//NProgress.start();
                getServerInfoPage(para).then((res) => {
					this.total = res.data.length;
					this.serverinfo = res.data;
                    this.serverinfo = res.data.filter((u, index) => index < para.pageSize * para.page && index >= para.pageSize * (para.page - 1));//显示分页后的数据
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { serviceId: row.serviceId };
                    deleteServerInfo(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示状态管理界面
			handleState: function (index, row) {
				//this.editFormVisible = true;
				//this.editForm = Object.assign({}, row);
				this.$router.push("/serverState");
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
                    serviceName: '',
                    serviceAddress:'',
                    serviceKey: '',
                    serInfor: ''
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
							editServerInfo(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
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
							addServerInfo(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
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
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>