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
    <el-table :data="preCodeData" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55" v-if="false">
      </el-table-column>
      <el-table-column type="index" width="80" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="preCodeId" label="前码段ID" width="300" sortable v-if="false" align="center">
      </el-table-column>
      <el-table-column prop="preCode" label="前码段" min-width="300" sortable align="center">
      </el-table-column>
      <el-table-column prop="codeType" label="编码类型" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="organizationName" label="组织名" min-width="400"  sortable align="center">
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template scope="scope">
          <el-button size="small" v-if="false" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="small" type="primary" plain  @click="assignBackCode(scope.$index, scope.row)">后码段分配</el-button>
          <el-button size="small" type="success " plain  @click="handleBackCode(scope.$index, scope.row)">后码段管理</el-button>
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
    <el-dialog title="编辑前码段" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-position="labelPosition" label-width="80px" :rules="editFormRules" ref="editForm">

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
    <el-dialog title="新增前码段" :visible.sync="addFormVisible" :close-on-click-modal="false" >
      <el-form :model="addForm" label-positon="labelPosition" label-width="120px"  :rules="addFormRules" ref="addForm">

        <el-form-item label="编码类型" prop="codeTypeId">
        <el-select v-model="addForm.codeTypeId" filterable @change="getFrontCodeByCodeTypeId" style="width: 100%" placeholder="请选择">
          <el-option
                  v-for="item in allCodeTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="前段码" prop="preCode"  v-if="frontCodeDisplay">
          <el-input v-model="addForm.preCode"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="前段码" prop="preCode1" v-if="!frontCodeDisplay">
          <el-select v-model="addForm.preCode1"  filterable style="width: 100%" placeholder="请选择">
            <el-option
                    v-for="item in frontCodeByCT"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织机构名称" prop="organizationId">
          <el-select v-model="addForm.organizationId" filterable style="width: 100%" placeholder="请选择">
            <el-option
                    v-for="item in allCodeNames"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--后码段查询管理界面-->
    <el-dialog title="后码段管理" :visible.sync="codeTableVisible" :close-on-click-modal="false" @close="dialogClose">
      <!--后码段列表-->
      <el-table :data="suffixCodeData"  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;margin-top: -30px">
        <el-table-column type="selection" width="55" v-if="false">
        </el-table-column>
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>
        <el-table-column prop="preCode" label="前码段" min-width="150" sortable>
        </el-table-column>
        <el-table-column prop="suffixcode" label="后段码" min-width="150" sortable>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120" sortable>
        </el-table-column>
        <el-table-column prop="codeDis" label="描述" width="200" sortable>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template scope="scope">
            <el-button type="danger" size="small" v-if="scope.row.status != '已禁用'" @click="handleBCStatus(scope.$index, scope.row)">禁用</el-button>
            <el-button type="success" size="small" v-if="scope.row.status == '已禁用'" @click="handleBCStatus(scope.$index, scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>

        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange1" :page-size="pageSize1" :total="total1" style="float:right;display:inline-block;height: 50px;;">
        </el-pagination>

    </el-dialog>


    <!--后码段分配-->
    <el-dialog title="后码段分配" :visible.sync="backEditFormVisible" :close-on-click-modal="false">
      <div style="padding-left: 10px ;background-color:#d4edfc;height: 35px;line-height: 35px;">前码段信息</div>
      <el-table :data="assignData" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-table-column type="selection" width="55" v-if="false">
        </el-table-column>
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>

        <el-table-column prop="preCode" label="前码段" min-width="150" sortable>
        </el-table-column>
        <el-table-column prop="codeType" label="编码类型" min-width="120" sortable>
        </el-table-column>
        <el-table-column prop="organizationName" label="所属机构" min-width="200" sortable>
        </el-table-column>


      </el-table>
      <div style="margin-top:20px;padding-left: 10px ;background-color:#d4edfc;height: 35px;line-height: 35px;">后段码分配</div>
      <el-form :model="assignForm" :label-position="labelPosition" label-width="120px" :rules="editFormRules" ref="assignForm" style="margin-top: 20px">

        <el-form-item label="后段码数量" prop="number" style="padding-left: 20px">
          <el-input-number v-model="assignForm.number" style="text-align: center" auto-complete="off"></el-input-number>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="assignSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import {getFrontCodeByCodeTypeId,searchOrgInfo,searchCodeType,modifySuffixStatus,searchSuffixCode,addSuffixCode,addPreCode,searchPreCode,  batchRemoveUser,} from '../../api/api';

  export default {
    data() {
      return {
        filters: {
          precode: ''
        },
        labelPosition:'left',
        frontCodeDisplay:true,
        preCodeData: [],
        suffixCodeData:[],
        allCodeTypes:[],//存储所有编码类型
        allCodeNames:[],//存储所有公司名称
        frontCodeByCT:[],//存储前码段信息BYcodeType
        total: 0,
        page: 1,
        pageSize:10,
        total1: 0,
        page1: 1,
        pageSize1:10,//后码段列表页面容量
        listLoading: false,
        sels: [],//列表选中列
        currentPreCode:'',
        currentPreCodeId:'',
        dsStatus:false,

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
          preCode: [
            { required: true, message: '请输入前段码', trigger: 'blur' }
          ],
          preCode1: [
            { required: true, message: '请输入前段码', trigger: 'blur' }
          ],
          codeTypeId: [
            { required: true, message: '请选择编码类型', trigger: 'blur' }
          ],
          organizationId: [
            { required: true, message: '请选择组织机构', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          preCode: '',
          preCode1:'',
          codeTypeId: '',
          organizationId: ''
        },
        //分配页面是否展示
        backEditFormVisible: false,
        assignForm:{
          number:''
        },
        backData: [{preCodeId:"李振营",preCode:1,codeType:22,organizationName:2010-1-1}],
        assignData:[],

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
      handleCurrentChange1(val) {
        this.page1 = val;
        this.handleBackCode1();
      },
      dialogClose(){
        this.suffixCodeData = [];
        this.page1 = 1;
        this.total1 = 0;
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
      //根据codeTypeId 查询前码段分配信息
      getFrontCodeByCodeTypeId() {
        let para = {
          codeTypeId:this.addForm.codeTypeId
        };
        getFrontCodeByCodeTypeId(para).then((res)=>{
          console.log(res.data);
        let  temp = res.data.dataList;
          switch (res.data.type){
            case "add":
                  this.frontCodeDisplay = true;
                  break;
            case "json":
                  this.frontCodeDisplay = false;
                  for(var i=0;i<temp.length;i++){
                    this.frontCodeByCT.push({id:temp[i]+'',name:temp[i]});
                  };
                  break;
            case "fail":
                  this.$message("输入错误！");
                  break;
            default:
              this.frontCodeDisplay = true;
          }

        });
      },
      //修改后段码状态（禁用）
      handleBCStatus: function (index, row) {
        this.$confirm('确认禁用该后段码吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
        //NProgress.start();
        let para = Object.assign({},row);
        if (para.status !="已禁用"){
          para.status = "已禁用";
        }else{
          para.status = "未使用";
        };

        modifySuffixStatus(para).then((res) => {
          this.listLoading = false;
        if (res.data == "success"){
          this.$message({
            message: '操作成功！',
            type: 'success'
          });
          this.handleBackCode1();
        }else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

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
        let tempData = Object.assign({}, row);
        this.assignData= [{preCodeId:tempData.preCodeId,preCode:tempData.preCode,codeType:tempData.codeType,organizationName:tempData.organizationName}]
      },
      //后段码页面分页操作
      handleBackCode1:function () {

        let preCodeId = this.suffixCodeData[0].preCodeId;
        let preCodeName = this.suffixCodeData[0].preCode;
        let para = {
          page: this.page1,
          preCode:preCodeId,
          preCodeName:preCodeName,
          pageSize : this.pageSize1
        };
        let formateData = [];
        this.listLoading = true;

        searchSuffixCode(para).then((res) => {
          this.total1 = res.data.length;//数据总条目
        for(var i=0;i<res.data.length;i++){

          formateData.push({
            "preCodeId":para.preCode,
            "preCode":para.preCodeName,
            "suffixcode": res.data[i].suffixCode,
            "status": this.switchStatus(res.data[i].status),
            "codeDis" : res.data[i].description || "暂无描述",
          })
        }
        this.suffixCodeData = formateData.filter((u, index) => index < para.pageSize * para.page && index >= para.pageSize * (para.page - 1));//显示分页后的数据
        this.listLoading = false;
        //NProgress.done();
      });

      },
      //显示后码段管理界面并查询数据
      handleBackCode: function (index, row){
          let para = {
            page: this.page1,
            preCode:Object.assign({}, row).preCodeId,
            preCodeName:Object.assign({}, row).preCode,
            pageSize : this.pageSize1
          };
          let formateData = [];
          this.listLoading = true;

          searchSuffixCode(para).then((res) => {
            this.total1 = res.data.length;//数据总条目
          for(var i=0;i<res.data.length;i++){

            formateData.push({
              "preCodeId":para.preCode,
              "preCode":para.preCodeName,
              "suffixcode": res.data[i].suffixCode,
              "status": this.switchStatus(res.data[i].status),
              "codeDis" : res.data[i].description || "暂无描述",
            })
          }
          this.suffixCodeData = formateData.filter((u, index) => index < para.pageSize * para.page && index >= para.pageSize * (para.page - 1));//显示分页后的数据
          this.listLoading = false;
          //NProgress.done();
          });
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
        let para = {};
        searchCodeType(para).then((res)=>{
          //console.log(res.data);
        let typeDatas = res.data;
        let tempData = [];
        for(var i=0;i<typeDatas.length;i++){
          tempData.push({value:typeDatas[i].typeId+'',label:typeDatas[i].typeName});
        }
        this.allCodeTypes = tempData;
      });

        searchOrgInfo(para).then((res)=>{
          let tempData1 = [];
        let orgNames = res.data;
        for(var i=0;i<orgNames.length;i++){
          tempData1.push({value:orgNames[i].organizationId+'',label:orgNames[i].organizationName});
        }
        this.allCodeNames = tempData1;
        });

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

              this.addLoading = false;
            addPreCode(para).then((res) => {

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
      //分配后段码
      assignSubmit: function () {
        let para = {
          page: this.page,
          preCode:this.assignData[0].preCodeId,
          num:Object.assign({}, this.assignForm).number,
          pageSize : this.pageSize
        };
        let formateData = [];
        this.listLoading = true;
        //NProgress.start();
        addSuffixCode(para).then((res) => {
          console.log(res.data);
        if(res.data == "success"){
          this.backEditFormVisible = false;
          this.$refs['assignForm'].resetFields();
          this.$message({
            message: '新增编码成功！',
            type: 'success'
          });
        }else {
          this.$message({
            message: '操作失败！',
            type: 'error'
          });
        }

          this.listLoading = false;
      });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
     switchStatus: function (status) {
       switch(status){
         case 1 :
              status = "未使用";
               break;
         case 2 :
              status = "已使用";
               break;
         case 3 :
               status = "已禁用";
               break;
         default :
              status = "未使用";
       }
       return status;
     }
    },
    mounted() {
      this.getPreCodeList();
    }
  }

</script>

<style scoped>

</style>