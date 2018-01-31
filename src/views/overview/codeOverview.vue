<template>
    <section class="chart-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-row class="grid-content bg-purple">
                    <el-col :span="10" class="grid-left">
                        <i class="el-icon-star-on"></i>
                    </el-col>
                    <el-col :span="14" class="grid-right">
                        <div class="title">编码类型</div>
                        <div class="number">{{totalCount.codeCount}}</div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="6">
                <el-row class="grid-content bg-purple">
                    <el-col :span="10" class="grid-left">
                        <i class="el-icon-date"></i>
                    </el-col>
                    <el-col :span="14" class="grid-right">
                        <div class="title">组织名数量/前段码数量</div>
                        <div class="number">{{totalCount.orgCount}}/{{totalCount.preCodeCount}}</div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row class="grid-content bg-purple">
                    <el-col :span="4" class="grid-left">
                        <i class="el-icon-setting"></i>
                    </el-col>
                    <el-col :span="5" class="grid-right">
                        <div class="title">码池容量</div>
                        <div class="number">{{totalCount.sufCodeCount}}</div>
                    </el-col>
                    <el-col :span="5" class="grid-right">
                        <div class="title">已分配</div>
                        <div class="number">{{totalCount.sufHaveUseCount}}</div>
                    </el-col>
                    <el-col :span="5" class="grid-right">
                        <div class="title">未分配</div>
                        <div class="number">{{totalCount.sufNoUseCount}}</div>
                    </el-col>
                    <el-col :span="5" class="grid-right">
                        <div class="title">禁用</div>
                        <div class="number">{{totalCount.sufCantUseCount}}</div>
                    </el-col>

                </el-row>
            </el-col>


        </el-row>
        <el-row :gutter="20">
            <el-col :span="12" >
                <div class="chart-panel">
                    <div id="chartColumn" style="width:100%; height:500px;"></div>
                </div>

            </el-col>
            <el-col :span="12" >
                <div class="chart-panel">
                    <el-row style="height:80px;padding-top:20px;text-align: center">
                        <el-form :inline="true" :model="searchCompanyForm" class="demo-form-inline" ref="searchCompanyForm">
                            <el-form-item prop="name" label="查看组织名码段信息":rules="[{ required: true, message: '名称不能为空'}]">
                                <el-input type="name" v-model="searchCompanyForm.name" placeholder="请输入组织名"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('searchCompanyForm')">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                    <div id="orgColumnChart" style="width:100%; height:400px;">
                    </div>
                </div>
            </el-col>
        </el-row>

    </section>
</template>

<script>
    import echarts from 'echarts';
    import {getCount,getCodeType,getSufCodeCount} from "../../api/api";

    var totalCount = {
        codeCount:0,
        orgCount:0,
        preCodeCount:0,
        sufNoUseCount:0,
        sufHaveUseCount:0,
        sufCantUseCount:0,
        sufCodeCount:0,

    }
    var pieCount = {
        sufNoUseCount:0,
        sufHaveUseCount:0,
        sufCantUseCount:0,
        title:''
    }
    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null,
                totalCount,
                codeTypeName:[],
                codeTypeNumber:[],
                pieCount,
                companyBarBottomData:[],
                companyBarTopData:[],
                searchCompanyForm:{
                    name:''
                },
            }
        },

        methods: {
            //获取编码概览统计数据
            getTotalCount(){
                getCount().then((res) => {
                    this.totalCount.codeCount = res.data.codeCount;//编码类型
                    this.totalCount.orgCount = res.data.orgCount;//公司总数
                    this.totalCount.preCodeCount = res.data.preCodeCount;//前码段
                    this.totalCount.sufCodeCount = res.data.sufCodeCount;//码池容量
                    this.totalCount.sufNoUseCount = res.data.sufNoUseCount;//未使用
                    this.totalCount.sufHaveUseCount = res.data.sufHaveUseCount;//已使用
                    this.totalCount.sufCantUseCount = res.data.sufCantUseCount;//禁用
                });
            },
            //获取编码类型统计柱状图
            getCodeTypeData(){
                getCodeType().then((res) =>{
                    var typeData = res.data;
                    for (var k=0;k<5;k++) {
                        this.codeTypeName.push(typeData[k].typeName);
                        this.codeTypeNumber.push(typeData[k].sufNumber);
                    };
                    this.drawColumnChart();
                });
            },
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  title: { text: '编码类型统计' },
                  tooltip: {},
                    color:[ '#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                  xAxis: {
                      data: this.codeTypeName
                  },
                  yAxis: {},
                  series: [{
                      name: '销量',
                      type: 'bar',
                      data: this.codeTypeNumber
                    }]
                },true);
            },
            //查询公司码段情况
            companyCodeChart(parm){
                let para = {
                    organizationName:parm
                }
                getSufCodeCount(para).then((res) => {
                        if(res.data.sufHaveUseCount==0&&res.data.sufCantUseCount==0&&res.data.sufNoUseCount==0){
                            document.getElementById("orgColumnChart").style.visibility = "hidden";
                            this.openError();
                        }else{
                            console.log("success");
                            document.getElementById("orgColumnChart").style.visibility = "visible";
                            //初始化清空图表数组
                            this.companyBarBottomData.splice(0,this.companyBarBottomData.length);
                            this.companyBarTopData.splice(0,this.companyBarTopData.length);
                            /* document.getElementById("orgColumnChart").innerText='';*/
                            this.pieCount.sufHaveUseCount = res.data.sufHaveUseCount;
                            this.pieCount.sufCantUseCount = res.data.sufCantUseCount;
                            this.pieCount.sufNoUseCount = res.data.sufNoUseCount;
                            this.pieCount.title = parm;
                            //公司码段总和
                            let total = res.data.sufHaveUseCount+res.data.sufCantUseCount+res.data.sufNoUseCount;
                            this.companyBarBottomData.push(0);
                            //已使用底部数据
                            this.companyBarBottomData.push(total-res.data.sufHaveUseCount);
                            //未使用底部数据
                            this.companyBarBottomData.push(total-res.data.sufHaveUseCount-res.data.sufNoUseCount);
                            //禁用底部数据
                            this.companyBarBottomData.push(0);

                            this.companyBarTopData.push(total);
                            this.companyBarTopData.push(res.data.sufHaveUseCount);
                            this.companyBarTopData.push(res.data.sufNoUseCount);
                            this.companyBarTopData.push(res.data.sufCantUseCount);
                            this.drawOrgColumnChart();
                        }

                });

            },
            drawOrgColumnChart(){
                this.chartColumn = echarts.init(document.getElementById('orgColumnChart'));
                this.chartColumn.clear();
                this.chartColumn.setOption({
                    title: {
                        text: this.pieCount.title+'码段情况',
                        left: 'center',
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            var tar = params[1];
                            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                        }
                    },
                    grid: {
                       x: '10%', y: '20%', width: '45%', height: '70%'
                        ,
                    },
                    color:['#ca8622', '#546570', '#c4ccd3'],
                    xAxis: {
                        type : 'category',
                        splitLine: {show:false},
                        data : ['总码段','已分配','未分配','禁用']
                    },
                    yAxis: {
                        type : 'value'
                    },
                    series: [
                        {
                            name: '辅助',
                            type: 'bar',
                            stack:  '总量',
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                },
                                emphasis: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: 'rgba(0,0,0,0)'
                                }
                            },
                            data:  this.companyBarBottomData
                        },
                        {
                            name: '码段数量',
                            type: 'bar',
                            stack: '总量',

                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside'
                                }
                            },
                            data:this.companyBarTopData
                        },
                        {
                            type: 'pie',
                            radius: [0, '50%'],
                            center: ['75%', '50%'],
                            data:[
                                {value:this.pieCount.sufHaveUseCount, name:'已分配'},
                                {value:this.pieCount.sufNoUseCount, name:'未分配'},
                                {value:this.pieCount.sufCantUseCount, name:'禁用'},
                            ].sort(function (a, b) { return a.value - b.value; }),
                        }
                    ]
                },true);
            },
            drawCharts() {
                    this.getCodeTypeData();
                    this.getTotalCount();
                    //this.companyCodeChart();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //调用查询接口，画出图表
                        this.companyCodeChart(this.searchCompanyForm.name)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            openError() {
                this.$notify.error({
                    title: '注意',
                    message: '无此组织名码段信息!'
                });
            }
        },

        mounted: function () {
            this.drawCharts()
        },
       /* updated: function () {
            this.drawCharts()
        }*/
    }
</script>

<style scoped lang="less" rel="stylesheet/less">
    .chart-container {
        margin-top: 20px;
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-row {
        margin-bottom: 20px;
        &:last-child {
             margin-bottom: 0;
         }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #eef1f6;
    }
    .bg-purple-light {
        background: #eef1f6;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
        padding: 20px;
        .grid-left{
            text-align: center;
            i{
                font-size: 100px;
                color: darkturquoise;
            }
        }
        .grid-right{
            .number{
                color: #2a2f43;
                font-size: 4em;
                margin: 0;
            }
        }
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .chart-panel{
        padding:10px;
        background-color: #eef1f6;
    }
</style>
