<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="编码类型/类型ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="typeData" border  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100% ;">
     <!-- <el-table-column type="selection" width="55">
      </el-table-column>-->
      <el-table-column type="index" width="100" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="typeId" label="编码类型ID" width="320" sortable align="center">
      </el-table-column>
      <el-table-column prop="typeName" label="编码类型名称" min-width="320"  sortable align="center">
      </el-table-column>
      <el-table-column prop="rule" label="编码规则" min-width="550" sortable align="center">
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template scope="scope">
          <el-button type="primary" plain size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
         <!-- <el-button size="small" type="info"  @click="handleBackCode(scope.$index, scope.row)">后码段管理</el-button>-->
          <el-button type="danger" plain disabled=true size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
     <!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" :label-position="labelPosition" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item label="编码类型ID" v-if="false">
          <el-input v-model="editForm.id" ></el-input>
        </el-form-item>
        <el-form-item label="编码类型名称" prop="typeName">
          <el-input v-model="editForm.typeName"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码规则" prop="rule">
          <el-input v-model="editForm.rule" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="自定义编码类型" :visible.sync="addFormVisible" :close-on-click-modal="false" :before-close="addFormClose">
      <el-form :model="addForm" :label-position="labelPosition" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item label="编码类型名称" prop="typeName">
          <el-input v-model="addForm.typeName" name="typeName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="编码规则" prop="rule">
          <el-input type="textarea" :row="3" v-model="addForm.rule" ></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormClose">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>


  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { searchCodeType,addCodeType,updateCodeType,getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        labelPosition:"left",
        typeData: [],
        total: 0,
        page: 1,
        pageSize:10,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          typeName: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          rule: [
            { required: true, message: '请输入编码规则', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          typeName: '',
          rule: ''
        },



        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          typeName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          rule: [
            { required: true, message: '请输入编码规则', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          typeName: '',
          rule: ''
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
        this.getData();
      },
      //获取数据列表
      getData() {
        let para = {
          page: this.page,
          condition : this.filters.name,
          pageSize : this.pageSize
        };
        this.listLoading = true;
        //NProgress.start();

        searchCodeType(para).then((res)=>{
          //console.log(res.data);
          this.total = res.data.length;//数据总条目
          this.typeData = res.data.filter((u, index) => index < para.pageSize * para.page && index >= para.pageSize * (para.page - 1));//显示分页后的数据
          this.listLoading = false;
        });


        //NProgress.done();

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

      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          typeName: '',
          rule: ''

        };
      },
      addFormClose:function () {

        this.$refs['addForm'].resetFields();
        //location.reload();
        this.addFormVisible = false;
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);

            updateCodeType(para).then((res) => {
              this.editLoading = false;
            //NProgress.done();
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.$refs['editForm'].resetFields();
            this.editFormVisible = false;
            this.getData();
          });
          });
          }
        });
      },
      //新增编码类型
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);

            addCodeType(para).then((res) => {
              this.addLoading = false;
            if(res.data == "success"){
              this.$message({
                message: '新增编码成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getData();
            }else {
              this.$message({
                message: '新增编码失败',
                type: 'error'
              });
            }
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
      //this.getUsers();
      this.getData();
    }
  }

</script>

<style scoped>

</style>