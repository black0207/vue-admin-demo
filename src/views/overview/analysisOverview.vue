<template>
    <section class="chart-container">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-row class="grid-content bg-purple">
                    <el-col :span="10" class="grid-left">
                        <i class="el-icon-menu"></i>
                    </el-col>
                    <el-col :span="14" class="grid-right">
                        <div class="title">解析服务器总数</div>
                        <div class="number">{{allServiceCount}}</div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="12">
                <el-row class="grid-content bg-purple">
                    <el-col :span="10" class="grid-left">
                        <i class="el-icon-view"></i>
                    </el-col>
                    <el-col :span="14" class="grid-right">
                        <div class="title">解析量总数</div>
                        <div class="number">{{allAnalysisCount}}</div>
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
                    <div id="analysisPieChart" style="width:100%; height:500px;">

                    </div>
                </div>
            </el-col>
        </el-row>

    </section>
</template>

<script>
    import echarts from 'echarts';
    import {getAnalysisCount} from "../../api/api";

    export default {
        data() {
            return {
                allServiceCount:0,
                allAnalysisCount:0,
                serverName:[],
                analysisCount:[]

            }
        },

        methods: {
            //获取编码概览统计数据
            showAnalysisData(){
                getAnalysisCount().then((res) => {
                    this.allServiceCount = res.data[res.data.length - 1].parseCount;//解析服务器总数
                    this.allAnalysisCount = res.data[res.data.length - 2].parseCount;//解析量总数
                    for (var k=0;k<res.data.length - 2;k++) {
                        this.serverName.push(res.data[k].serverName);
                        this.analysisCount.push(res.data[k].parseCount);
                    };
                    this.drawColumnChart();
                    this.drawPieChart();
                })
                    .catch(function (error) {
                        console.log(error);
                        alert("服务器数据请求失败！")
                    });
            },
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                    title: { text: '各解析服务器解析情况' },
                    tooltip: {},
                    color:['#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    xAxis: {
                      data: this.serverName,
                        name:'服务器名称'
                    },
                    yAxis: {
                        show:true,
                        name:'解析数量',
                    },
                    series: [{
                        name: '数量',
                        type: 'bar',
                        data: this.analysisCount
                    }]
                },true);
            },
            drawPieChart(){
                var pieData= [];
                for (var k=0;k<this.serverName.length;k++) {
                    var obj ={};
                    obj.name = this.serverName[k];
                    obj.value = this.analysisCount[k];
                    pieData.push(obj);
                };
                console.log(pieData);
                this.chartColumn = echarts.init(document.getElementById('analysisPieChart'));
                this.chartColumn.setOption({
                    title: { text: '各解析服务器解析情况' },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        y: 'bottom',
                        data:this.serverName
                    },
                    series: [
                        {
                            name:'解析情况',
                            type:'pie',
                            radius: ['50%', '75%'],
                            avoidLabelOverlap: false,
                            label: {

                                normal: {
                                    show: true,
                                    formatter: "{c} ({d}%)",
                                    textStyle: {
                                        fontSize: '12',
                                        fontWeight: 'bold'
                                    }
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '16',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                }
                            },
                            data:pieData
                        }
                    ]
                },true);
            }

        },

        mounted: function () {
            this.showAnalysisData()
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
