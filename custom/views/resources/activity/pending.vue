<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'活动名称'"
                      v-model="queryItem.name.value">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search"
                       @click="routerPush('/' +$route.matched[0].name + '/activity')">返回
            </el-button>

        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='标题' min-width="200"  >
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column label='简介' width="200">
                <template slot-scope="scope">
                    {{scope.row.summary}}
                </template>
            </el-table-column>

            <el-table-column label='发起人ID' width="100">
                <template slot-scope="scope">
                    {{scope.row.summary}}
                </template>
            </el-table-column>

            <el-table-column label='发起人姓名' width="100">
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

            <el-table-column align="center" :label="'操作'" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="qrcode('http://mp.huzhubb.com/activities/'+scope.row.id)" >查看活动详情</el-button>

                    <el-button type="primary" @click="handleConfirm(scope.row,commonItem, commonItem.agreeOptions)" size="mini">审核通过</el-button>
                    <el-button type="danger"  @click="handleConfirm(scope.row,commonItem, commonItem.refuseOptions)" size="mini">审核不通过</el-button>
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
    import {mapGetters} from 'vuex';
    import QRCode from 'qrcode'


    let page = new pageInit(
        {
            data: {
                dialogVisible: false,

                pendingCount: 0,
                commonItem:{
                    agreeOptions: {
                        dialogStatus: 'agree',
                        confirmOptions: {
                            text: '确定审核通过?'
                        }
                    },
                    refuseOptions: {
                        dialogStatus: 'refuse',
                        confirmOptions: {
                            text: '确定审核不通过?'
                        }
                    }
                },
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
                        value: 'NEW',
                        predicate: ''
                    }
                },
                request: {
                    queryList:{
                        url: '/activities'
                    },
                    queryCount:{
                        url: '/activities/count'
                    }
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            methods: {
                beforeEditRequest(row) {

                    if (this.dialogStatus === 'agree') {
                        this.postForm = {
                            id: row.id,
                            operationSummary: '',
                            operationUserId: this.home.user.id
                        };
                        this.request.queryConfirm ={
                            url: '/dashboard/distance/activities/confirm'
                        }
                    }

                    if (this.dialogStatus === 'refuse') {
                        this.postForm = {
                            id: row.id,
                            operationSummary: '',
                            operationUserId: this.home.user.id
                        };
                        this.request.queryConfirm ={
                            url: '/dashboard/distance/activities/refuse'
                        }
                    }
                },
                afterRequestMounted() {
                    let options = {
                        url: '/activities/count',
                        method: 'get',
                        params: {
                            search: 'status==NEW'
                        }
                    }
                    let that = this
                    request(options).then(function(response) {
                        that.pendingCount = response.data
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
