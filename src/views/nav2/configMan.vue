<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.resolveType" placeholder="类型/标识"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getResolveConfigs">查询</el-button>
				</el-form-item>
				<el-form-item>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="resolveConfigs" highlight-current-row v-loading="listLoading" style="width: 100%;" border>
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60" align="center">
			</el-table-column>
			<!--name-->
			<el-table-column prop="resolveType" label="解析类型" width="140" sortable align="center">
			</el-table-column>
			<!--workingState-->
			<el-table-column prop="resolveId" label="解析标识" width="140" sortable align="center">
			</el-table-column>
			<!--softwareVersion-->
			<el-table-column prop="resolveRes" label="解析结果" width="140" sortable align="center">
			</el-table-column>
			<!--configUpdate-->
			<el-table-column prop="associatedServers" label="关联服务器" width="160" align="center">
			</el-table-column>
			<!--resolveStatistic-->
			<el-table-column label="操作" min-width="180" align="center">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">更新</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
		<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
		</el-pagination>
		</el-col>

		<!--更新界面-->
		<el-dialog title="更新" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="服务器名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="配置更新">
					<el-radio-group v-model="editForm.config">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="软件版本更新">
					<el-input-number v-model="editForm.softwareVersion" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
				<el-form-item label="关机/重启">
					<el-button type="danger">关机</el-button>
					<el-button type="success">重启</el-button>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="解析类型" prop="resolveType">
					<!--<el-select v-model="value" placeholder="请选择">-->
						<!--<el-option-->
								<!--v-for="item in options"-->
								<!--:key="item.value"-->
								<!--:label="item.label"-->
								<!--:value="item.value">-->
						<!--</el-option>-->
					<!--</el-select>-->
				</el-form-item>
				<el-form-item label="解析标识">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="关联服务器">
					<!--<el-select-->
							<!--v-model="value9"-->
							<!--multiple-->
							<!--filterable-->
							<!--remote-->
							<!--reserve-keyword-->
							<!--placeholder="请输入关键词"-->
							<!--:remote-method="remoteMethod"-->
							<!--:loading="loading">-->
						<!--<el-option-->
								<!--v-for="item in options4"-->
								<!--:key="item.value"-->
								<!--:label="item.label"-->
								<!--:value="item.value">-->
						<!--</el-option>-->
					<!--</el-select>-->
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
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getResolveConfigPage } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    resolveType: ''
                },
                resolveConfigs: [],
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
            //性别显示转换
//			formatSex: function (row, column) {
//				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
//			},
            handleCurrentChange(val) {
                this.page = val;
                this.getResolveConfigs();
            },
            //获取用户列表
            getResolveConfigs() {
                let para = {
                    page: this.page,
                    resolveType: this.filters.resolveType,
                };
                this.listLoading = true;
                //NProgress.start();
                getResolveConfigPage(para).then((res) => {
                    this.total = res.data.total;
                    this.resolveConfigs = res.data.resolveConfigs;
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
                    let para = { id: row.id };
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getResolveConfigs();
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
                                this.getResolveConfigs();
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
                                this.getResolveConfigs();
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
                        this.getResolveConfigs();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getResolveConfigs();
        }
    }

</script>

<style scoped>

</style>