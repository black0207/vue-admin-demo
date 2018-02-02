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
			<!--configUpdate-->
			<el-table-column prop="associatedServersName" label="关联服务器" show-overflow-tooltip min-width="160" align="center">
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
		<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
		</el-pagination>
		</el-col>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="120px" ref="addForm" :rules="addFormRules">

				<el-form-item label="解析类型" prop="type">
					<el-select v-model="addForm.type" placeholder="请选择">
						<el-option
								v-for="item in resolveTypes"
								:key="item.value"
								:label="item.label"
								:value="item.label">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="解析标识" prop="identifier">
					<el-input v-model="addForm.identifier"></el-input>
				</el-form-item>

				<el-form-item label="解析结果" prop="result">
					<el-input v-model="addForm.result"></el-input>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--关联界面-->
		<el-dialog title="关联服务器" :visible.sync="associationFormVisible" :close-on-click-modal="false" custom-class="customDialogSize">
			<el-form :model="associationForm" label-width="120px" ref="associationForm">
				<el-form-item label="解析类型">
					<el-input v-model="associationForm.type" readonly></el-input>
				</el-form-item>
				<el-form-item label="解析标识">
					<el-input v-model="associationForm.identifier" readonly></el-input>
				</el-form-item>
				<el-form-item label="解析结果">
					<el-input v-model="associationForm.result" readonly></el-input>
				</el-form-item>
				<el-form-item label="关联服务器">
					<el-transfer v-model="associationForm.associatedServersId" :data="serversName" :titles="['备选', '已选']" :button-texts="['删除', '添加']">
					</el-transfer>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="associationFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="associationSubmit" :loading="associationLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>
<style>
	.customDialogSize {
		max-width: 750px;
		min-width: 750px;
	}
</style>

<script>
    import util from '../../common/js/util'
    import { getResolveConfigPage, addResolveConfig, removeResolveConfig, batchRemoveResolveConfigs, associateServers, getServerStatePage, searchCodeType } from '../../api/api';

    export default {
        data() {
            return {
                serversName: [],
				resolveTypes:[],
                resolveQueryWords: '',
                resolveConfigs: [],
                total: 0,
				pageSize: 10,
                page: 1,
                listLoading: false,
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

                addFormVisible: false,//新增界面是否显示
                addLoading: false,

                //新增界面数据
                addForm: {
                    type:'',
                    identifier:'',
                    result:'',
					associatedServersId:[],
                },
                addFormRules: {
                    type: [
						{ required: true }
					],
                    identifier: [
						{ required: true, message: '请输入解析标识', trigger: 'blur' },
					],
					result: [
						{ required: true, message: '请输入解析结果', trigger: 'blur' }
					],
                },

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.page = val;
                this.getResolveConfigs();
            },
            //获取解析配置列表
            getResolveConfigs() {
                let para = {
                    page: this.page,
                    resolveQueryWords: this.resolveQueryWords,
                };
                this.listLoading = true;
                getResolveConfigPage(para).then((res) => {
                    this.total = res.data.length;
                    let data = res.data;
                    let tempResolveConfigs = [];
                    for(let i=0; i<this.total; i++) {
                        let singleResolveConfigs = {
                            configId: '',
                            type: '',
                            identifier: '',
                            result: '',
                            associatedServersName: '',
                            associatedServersId: [],
						};
                        singleResolveConfigs.configId =data[i].configId;
                        singleResolveConfigs.type = data[i].type;
                        singleResolveConfigs.identifier = data[i].identify;
                        singleResolveConfigs.result = data[i].result;
                        if (data[i].serviceName != undefined) {
                            singleResolveConfigs.associatedServersName = data[i].serviceName.join(",");
                            singleResolveConfigs.associatedServersId = data[i].serviceId;
						} else {
                            singleResolveConfigs.associatedServersName = '--';

						}
                        tempResolveConfigs.push(singleResolveConfigs);
					}
					this.resolveConfigs = tempResolveConfigs.filter((u, index) => index < this.pageSize * para.page && index >= this.pageSize * (para.page - 1));
                    this.listLoading = false;
                }, (res) => {
                    this.$message.error('数据加载失败!');
                    this.listLoading = false;
				}).catch(() => {

                });
            },
            //删除
            handleDel: function (index, row) {
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

            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    type: '',
                    identifier: '',
                    result: '',
                    associatedServersId: [],
                };
                let para = {};
                searchCodeType(para).then((res) => {
                    console.log(res.data);
                    let data = res.data;
                    let tempResolveTypes = [];
                    for(let i=0; i<data.length; i++){
                        tempResolveTypes.push(
                            {
								value: data[i].typeId,
								label: data[i].typeName,
                            });
                    }
                    this.resolveTypes = tempResolveTypes;
				});
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;

							let para = {
								type: this.addForm.type,
								identify: this.addForm.identifier,
								result: this.addForm.result,
	//                            associatedServersId: [],
							};
							addResolveConfig(para).then((res) => {

								this.addLoading = false;

								this.$message({
									message: '添加成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.resolveQueryWords = '',
								this.getResolveConfigs();
							});
						});
                    }
                });
            },

            //显示关联界面
            handleAssociation: function (index, row) {
                this.associationForm.configId = row.configId;
                this.associationForm.type = row.type;
                this.associationForm.identifier = row.identifier;
                this.associationForm.result = row.result;
                this.associationForm.associatedServersId = row.associatedServersId;
                let para = {
                    serverQueryWords: '',
				};
                getServerStatePage(para).then((res) => {
                    let serversInfo = res.data;
                    let tempServersName = [];
                    let len = res.data.length;
                    for (let i=0; i<len; i++) {
                        tempServersName[i] =  {
                            key: serversInfo[i].serverId,
							label: serversInfo[i].serverName,
						};
					}
					this.serversName = tempServersName;
                });

                this.associationFormVisible = true;

            },

            //关联页面提交
            associationSubmit: function () {
                this.$refs.associationForm.validate((valid) => {
//                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.associationLoading = true;
                            if (this.associationForm.associatedServersId[0] == 0) {
                                this.associationForm.associatedServersId.shift();
							}
//                            console.log('this.associationForm.associatedServersId: '+this.associationForm.associatedServersId);

                            let para = {
                                configId: this.associationForm.configId,
                                associatedServersId: this.associationForm.associatedServersId.join(","),
                            };
//                            console.log('para.associatedServersId: '+para.associatedServersId);
//                            console.log('type of para.associatedServersId: '+typeof(para.associatedServersId));
                            associateServers(para).then((res) => {
                                this.associationLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['associationForm'].resetFields();
                                this.associationFormVisible = false;
                                this.getResolveConfigs();
                            },(res) => {
                                this.associationLoading = false;
                                this.$message.error('错了哦，这是一条错误消息');
							});
                        });
//                    }
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
            this.getResolveConfigs();
        }
    }

</script>

<style scoped>

</style>