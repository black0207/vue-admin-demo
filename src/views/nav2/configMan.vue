<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="resolveQueryWords" placeholder="类型/标识/结果"></el-input>
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
			<!--<el-table-column type="selection" width="55">-->
			<!--</el-table-column>-->
			<el-table-column type="index" width="80" align="center" label="序号">
			</el-table-column>
			<!--name-->
			<el-table-column prop="type" label="解析类型" min-width="140" sortable align="center">
			</el-table-column>
			<!--workingState-->
			<el-table-column prop="identify" label="解析标识" min-width="140" sortable align="center">
			</el-table-column>
			<!--softwareVersion-->
			<el-table-column prop="result" label="解析结果" min-width="140" sortable align="center">
			</el-table-column>
			<!--configUpdate-->
			<el-table-column prop="associatedServers" label="关联服务器" min-width="160" align="center">
			</el-table-column>
			<!--resolveStatistic-->
			<el-table-column label="操作" min-width="180" align="center">
				<template scope="scope">
					<el-button type="primary" size="small" @click="handleAssociation(scope.$index, scope.row)">关联</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
		<!--<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
		<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
		</el-pagination>
		</el-col>

		<!--关联界面-->
		<el-dialog title="关联服务器" v-model="associationFormVisible" :close-on-click-modal="false">
			<el-form :model="associationForm" label-width="120px" ref="associationForm">
				<el-form-item label="解析类型">
					<el-input v-model="associationForm.type" readonly></el-input>
				</el-form-item>
				<el-form-item label="解析标识">
					<el-input v-model="associationForm.identify" readonly></el-input>
				</el-form-item>
				<el-form-item label="解析结果">
					<el-input v-model="associationForm.result" readonly></el-input>
				</el-form-item>
				<el-form-item label="关联服务器">
					<el-transfer v-model="associationForm.servers" :data="dataConfigs" :titles="['备选', '已选']" :button-texts="['删除', '添加']">
					</el-transfer>
				</el-form-item>


			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="associationFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="associationSubmit" :loading="associationLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" ref="addForm">
				<el-form-item label="解析类型">
					<el-select v-model="addForm.type" placeholder="请选择">
						<el-option
								v-for="item in resolveTypes"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="解析标识">
					<el-input v-model="addForm.identify" ></el-input>
				</el-form-item>

				<el-form-item label="解析结果">
					<el-input v-model="addForm.result" ></el-input>
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
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getResolveConfigPage, addResolveConfig, removeResolveConfig, batchRemoveResolveConfigs } from '../../api/api';

    export default {
        data() {
            return {
                resolveTypes: [
                    {
						value: 'Ecode',
						label: 'Ecode'
					}, {
						value: '港名',
						label: '港名'
					},
				],
                resolveQueryWords: '',
                resolveConfigs: [],
                total: 0,
                page: 1,
                listLoading: false,
				sels: [],//列表选中列

                associationFormVisible: false,//编辑界面是否显示
                associationLoading: false,
//                editFormRules: {
//                    name: [
//                        { required: true, message: '请输入姓名', trigger: 'blur' }
//                    ]
//                },
                //关联界面数据
                associationForm: {
                    type: '',
                    identify: '',
                    result: '',
                    servers:[],
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
//                addFormRules: {
//                    name: [
//                        { required: true, message: '请输入姓名', trigger: 'blur' }
//                    ]
//                },
                //新增界面数据
                addForm: {
                    type:'',
                    identify:'',
                    result:'',
                },

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
//                    page: this.page,
                    resolveQueryWords: this.resolveQueryWords,
                };
                console.log(para.resolveQueryWords);
                this.listLoading = true;
                getResolveConfigPage(para).then((res) => {
                    console.log(this.resolveQueryWords);
                    this.total = res.data.length;
//                    console.log(res.data.length);
                    this.resolveConfigs = res.data;
                    console.log(this.resolveConfigs);
                    this.listLoading = false;
//                    this.listLoading = true;
                });
            },
            //删除
            handleDel: function (index, row) {
                console.log(row.configId);
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;

                    let para = { configId: row.configId };
                    removeResolveConfig(para).then((res) => {
                        this.listLoading = false;

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
            handleAssociation: function (index, row) {
                this.associationFormVisible = true;
                this.associationForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    type:'',
                    identify:'',
                    result:'',
                };
            },
            //编辑
            associationSubmit: function () {
                this.$refs.associationForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.associationLoading = true;

                            let para = Object.assign({}, this.associationForm);
//                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            associateServers(para).then((res) => {
                                this.associationLoading = false;

                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['associationForm'].resetFields();
                                this.associationFormVisible = false;
                                this.getResolveConfigs();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
//                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;

                            let para = Object.assign({}, this.addForm);
                            addResolveConfig(para).then((res) => {
                                this.addLoading = false;

                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getResolveConfigs();
                            });
                        });
//                    }
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
                    let para = { ids: ids };
                    batchRemoveCoonfigs(para).then((res) => {
                        this.listLoading = false;

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