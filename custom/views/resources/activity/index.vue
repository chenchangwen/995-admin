<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'活动名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-select v-model="queryItem.status.value" clearable placeholder="状态" style="width: 200px">
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>

            <el-button class="filter-item" type="primary" v-waves @click="routerPush( $route.path + '/pending')">待审核({{pendingCount}})条</el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='标题' min-width="200">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label='简介' width="200">
                <template slot-scope="scope">
                    {{scope.row.summary}}
                </template>
            </el-table-column>
            <el-table-column label='人数上限' width="100">
                <template slot-scope="scope">
                    {{scope.row.max}}
                </template>
            </el-table-column>
            <el-table-column label='当前报名' width="100">
                <template slot-scope="scope">
                    {{scope.row.activityStatistic.people}}
                </template>
            </el-table-column>
            <el-table-column label='活动时限' width="220">
                <template slot-scope="scope">
                    <p>报名截止:{{scope.row.enrollEndTime}}</p>
                    <p>活动开始:{{scope.row.beginTime}}</p>
                    <p>活动结束:{{scope.row.endTime}}</p>
                </template>
            </el-table-column>
            <el-table-column label='状态' width="100">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="320">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="qrcode('http://mp.huzhubb.com/activities/'+scope.row.id)" >查看活动详情</el-button>
                    <el-button type="primary" @click="routerPush($route.path + '/edit', scope.row.id)" size="mini">编辑</el-button>
                    <el-button type="primary" @click="routerPush($route.path + '/crowd', scope.row.id)" size="mini">众筹详情</el-button>
                    <el-button type="primary" @click="routerPush($route.path + '/team', scope.row.id)" size="mini">查看联合发起人</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog
            title="使用微信扫码浏览"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">


<!--            <span id="qrcode" class="qrcode"></span>-->
            <div class="qrcode_box">
                <canvas class="qrcode" ></canvas>
            </div>

            <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
                </el-dialog>
        <page></page>
    </div>
</template>

<script>

    import QRCode from 'qrcode'

    let page = new pageInit(
        {
            data: {
                dialogVisible: false,
                pendingCount: 0,
                statusOptions: [
                    {
                        value: 'NEW',
                        label: 'NEW'
                    },
                    {
                        value: 'DRAFT',
                        label: 'DRAFT'
                    },
                    {
                        value: 'SUCCESS',
                        label: 'SUCCESS'
                    },
                    {
                        value: 'REFUSE',
                        label: 'REFUSE'
                    },
                    {
                        value: 'GOING',
                        label: 'GOING'
                    },
                    {
                        value: 'CLOSE',
                        label: 'CLOSE'
                    },
                    {
                        value: 'END',
                        label: 'END'
                    }
                    //NEW 待审核，DRAFT 草稿,REFUSE 拒绝，GOING 进行中,CLOSE 关闭,END 截止报名,SUCCESS 完结
                ],
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ';'
                    },
                    status: {
                        key: 'status',
                        operation: '==',
                        value: '',
                        predicate: ''
                    }
                },
                request: {
                    queryPrefix: '/activities'
                }
            },
            methods: {
                afterRequestMounted(){
                    let options = {
                        url: '/activities/count',
                        method: 'get',
                        params:{
                            search : 'status==NEW'
                        }
                    }
                    let that = this;
                    request(options).then(function (response) {
                        that.pendingCount = response.data;
                    })
                },
                qrcode (text) {


                    this.dialogVisible = true;
                    this.$nextTick(() => {
                        var canvas = document.querySelector('canvas')
                        QRCode.toCanvas(canvas, text,
                            {width: 300, height:300,render:"table"})
                    })


                      }
            }
        }
    )
    export default page
</script>
