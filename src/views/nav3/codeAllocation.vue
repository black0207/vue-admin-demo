<template>
	<section>
		<div>前码段分配</div>
		<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
			<el-form-item label="姓名" prop="name">
				<el-input v-model="addForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-radio-group v-model="addForm.sex">
					<el-radio class="radio" :label="1">男</el-radio>
					<el-radio class="radio" :label="0">女</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="年龄">
				<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
			</el-form-item>
			<el-form-item label="生日">
				<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
			</el-form-item>
			<el-form-item label="地址">
				<el-input type="textarea" v-model="addForm.addr"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="addFormVisible = false">取消</el-button>
			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
		</div>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				},

				codeTableVisible: false,//后码段界面是否显示
				editLoading: false,
				//编辑界面数据
				backData: [{index:1,name:"李振营",sex:1,age:22,birth:2010-1-1,addr:"北四环中路211号"}],

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {



			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示后码段管理界面
			handleBackCode: function (index, row) {
				this.codeTableVisible = true;
				//this.editForm = Object.assign({}, row);
				/* this.$router.push({
				 path:"/backCodeMan",
				 params:{
				 frontCode:row.name
				 }
				 });*/
			},
			//后码段界面操作
			handleBCinfo: function (index, row) {
				this.$confirm('确认提交吗？', '提示', {})
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
						addUser(para).then((res) => {
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