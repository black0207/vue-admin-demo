<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.precode" placeholder="前码段/组织名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getPreCodeList">查询</el-button>
        </el-form-item>
       <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="preCodeData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55" v-if="false">
      </el-table-column>
      <el-table-column type="index" width="80" label="序号">
      </el-table-column>
      <el-table-column prop="preCodeId" label="前码段ID" width="300" sortable>
      </el-table-column>
      <el-table-column prop="preCode" label="前码段" min-width="300" sortable>
      </el-table-column>
      <el-table-column prop="codeType" label="编码类型" width="150" sortable>
      </el-table-column>
      <el-table-column prop="organizationName" label="组织名" min-width="400"  sortable>
      </el-table-column>

      <el-table-column label="操作" width="300">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="info"  @click="assignBackCode(scope.$index, scope.row)">后码段分配</el-button>
          <el-button size="small" type="success "  @click="handleBackCode(scope.$index, scope.row)">后码段管理</el-button>
          <!--<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
    <!--  <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>-->
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑前码段" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="前码段ID" prop="preCodeId">
          <el-input v-model="editForm.preCodeId" auto-complete="off" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="前码段" prop="preCode">
          <el-input v-model="editForm.preCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码类型" prop="codeType">
          <el-input v-model="editForm.codeType" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织名" prop="organizationName">
          <el-input v-model="editForm.organizationName" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="分配前码段" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="前段码" prop="preCode">
        <el-input v-model="addForm.preCode" auto-complete="off"></el-input>
      </el-form-item>
        <el-form-item label="编码类型ID" prop="codeTypeId">
          <el-input v-model="addForm.codeTypeId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="组织ID" prop="organizationId">
          <el-input v-model="addForm.organizationId" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--后码段界面-->
    <el-dialog title="后码段管理" v-model="codeTableVisible" :close-on-click-modal="false">
      <!--后码段列表-->
      <el-table :data="backData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" v-if="false">
        </el-table-column>
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>
        <el-table-column prop="name" label="前码段" width="120" sortable>
        </el-table-column>
        <el-table-column prop="sex" label="组织名" width="100" :formatter="formatSex" sortable>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100" sortable>
        </el-table-column>
        <el-table-column prop="birth" label="日期" width="120" sortable>
        </el-table-column>
        <el-table-column prop="addr" label="地址" min-width="250" sortable>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template scope="scope">
            <el-button size="small" @click="handleBCinfo(scope.$index, scope.row)">禁用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <!--后码段分配-->
    <el-dialog title="后码段分配" v-model="backEditFormVisible" :close-on-click-modal="false">
      <div>前码段信息</div>
      <el-table :data="backData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" v-if="false">
        </el-table-column>
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>
        <el-table-column prop="name" label="前码段" width="120" sortable>
        </el-table-column>
        <el-table-column prop="sex" label="组织名" width="100" :formatter="formatSex" sortable>
        </el-table-column>
        <el-table-column prop="age" label="年龄" width="100" sortable>
        </el-table-column>
        <el-table-column prop="birth" label="日期" width="120" sortable>
        </el-table-column>
        <el-table-column prop="addr" label="地址" min-width="250" sortable>
        </el-table-column>

      </el-table>
      <div>后段码分配</div>
      <el-form :model="assignForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="后段码数量" prop="number">
          <el-input-number v-model="assignForm.number" auto-complete="off"></el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {addPreCode,searchPreCode, getUserListPage, removeUser, batchRemoveUser, editUser, addUser ,addFrontCode} from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          precode: ''
        },
        preCodeData: [],
        total: 0,
        page: 1,
        pageSize:3,
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
          preCodeId:'',
          preCode: '',
          codeTypeId: '',
          codeType:'',
          organizationId: '',
          organizationName:''
        },

        codeTableVisible: false,//后码段界面是否显示
        editLoading: false,
        //编辑界面数据
        backData: [{index:1,name:"李振营",sex:1,age:22,birth:2010-1-1,addr:"北四环中路211号"}],

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          preCodeName: [
            { required: true, message: '请输入前段码', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          preCode: '',
          codeTypeId: '',
          organizationId: ''
        },
        //分配页面是否展示
        backEditFormVisible: false,
        assignForm:{
          number:''
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
        this.getPreCodeList();
      },
      //获取前码段列表
      getPreCodeList() {
        let para = {
          page: this.page,
          condition: this.filters.precode,
          pageSize : this.pageSize
        };
        let formateData = [];
        this.listLoading = true;
        //NProgress.start();
        searchPreCode(para).then((res) => {
          this.total = res.data.length;//数据总条目
          for(var i=0;i<res.data.length;i++){

            formateData.push({
              "preCodeId":res.data[i].preCodeId,
              "preCode":res.data[i].preCode,
              "codeType": res.data[i].codeType.typeName,
              "organizationName": res.data[i].organization.organizationName,
              "organizationId" : res.data[i].organization.organizationId,
              "codeTypeId" : res.data[i].codeType.typeId,
            })
          }
          this.preCodeData = formateData.filter((u, index) => index < para.pageSize * para.page && index >= para.pageSize * (para.page - 1));//显示分页后的数据
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
      //显示分配界面
      assignBackCode: function (index, row) {
        this.backEditFormVisible = true;
        this.assignForm = Object.assign({}, row);
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
          preCode: '',
          codeTypeId: '',
          organizationId: ''
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

            addPreCode(para).then((res) => {
              this.addLoading = false;
            //NProgress.done();
            if(res.data == "success"){
              this.$message({
                message: '新增编码成功',
                type: 'success'
              });
              this.$refs['addForm'].resetFields();
              this.addFormVisible = false;
              this.getPreCodeList();
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
      this.getPreCodeList();
    }
  }

</script>

<style scoped>

</style>