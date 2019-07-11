<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户名称'"
                      v-model="query.userName">
            </el-input>
            <el-select v-model="query.status" clearable placeholder="状态" style="width: 200px">
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" type="primary" v-waves
                       @click="routerPush('/' +$route.matched[0].name + '/activity')">返回
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='所属活动ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.activityMember.activity.id}}
                </template>
            </el-table-column>
            <el-table-column label='所属活动名称' min-width="200">
                <template slot-scope="scope">
                    {{scope.row.activityMember.activity.name}}
                </template>
            </el-table-column>
            <el-table-column label='用户ID' width="100">
                <template slot-scope="scope">
                    {{scope.row.activityMember.userId}}
                </template>
            </el-table-column>
            <el-table-column label='用户名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.activityMember.name}}
                </template>
            </el-table-column>
            <el-table-column label='手机号' width="150">
                <template slot-scope="scope">
                    {{scope.row.activityMember.phone}}
                </template>
            </el-table-column>
            <el-table-column label='支持人次' width="100">
                <template slot-scope="scope">
                    {{scope.row.crowd.crowdStatistic.people}}
                </template>
            </el-table-column>
            <el-table-column label='状态' width="120">
                <template slot-scope="scope">
                    {{scope.row.activityMember.status}}
                </template>
            </el-table-column>
            <el-table-column label='过期时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.crowd.expireTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.activityMember.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'操作'" width="110">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleViewSupport(scope.row)"
                               size="mini">支持详情
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'退款操作'" width="220">
                <template slot-scope="scope">
                    <div v-if="scope.row.activityMember.status!=='REFUND_APPLICATION' && scope.row.activityMember.status!=='REFUND'">
                        <el-button type="primary" @click="handleConfirm(scope.row,commonItem, commonItem.applyOptions)"
                                   size="mini">申请退款
                        </el-button>
                    </div>
                    <div v-if="scope.row.activityMember.status==='REFUND_APPLICATION'">
                        <el-button type="primary" @click="handleConfirm(scope.row,commonItem, commonItem.agreeOptions)"
                                   size="mini">同意退款
                        </el-button>
                        <el-button type="danger" @click="handleConfirm(scope.row,commonItem, commonItem.refuseOptions)"
                                   size="mini">拒绝退款
                        </el-button>
                    </div>
                    <div v-if="scope.row.status==='REFUND'">
                        <p>操作结果:{{scope.row.operationResult}}</p>
                        <p>原因:{{scope.row.operationSummary}}</p>
                        <p>操作人:{{scope.row.operationUserId}}</p>
                        <p>审核时间:{{scope.row.operationTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</p>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <page></page>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    let page = new pageInit(
        {
            data: {
                idKey: 'crowd.id',
                isUseRSQL: false,
                statusOptions: [
                    {
                        value: 'SUCCESS',
                        label: 'SUCCESS'
                    },
                    {
                        value: 'REFUND',
                        label: 'REFUND'
                    },
                    {
                        value: 'GOING',
                        label: 'GOING'
                    },
                    {
                        value: 'EXPIRE',
                        label: 'EXPIRE'
                    }
                ],
                request: {
                    queryList: {
                        url: '/dashboard/distance/activities/members'
                    },
                    queryCount: {
                        url: '/dashboard/distance/activities/members/count'
                    },
                    queryConfirm: {}
                },
                commonItem: {
                    agreeOptions: {
                        dialogStatus: 'agree',
                        confirmOptions: {
                            text: '确定同意?'
                        }
                    },
                    refuseOptions: {
                        dialogStatus: 'refuse',
                        confirmOptions: {
                            text: '确定拒绝?'
                        }
                    },
                    applyOptions: {
                        dialogStatus: 'apply',
                        confirmOptions: {
                            text: '确定申请退款?'
                        }
                    }
                }
            },
            computed: {
                ...mapGetters([
                    'home'
                ])
            },
            methods: {
                handleViewSupport(row){
                    this.routerPush(`/${this.$route.matched[0].name}/activity/crowd/${this.$route.params.activityId}/support/${row.crowd.id}`)
                },
                beforeEditRequest(row) {
                    if (this.dialogStatus) {
                        this.postForm = {
                            id: row.crowd.id,
                            operationSummary: '',
                            operationUserId: parseInt(this.home.user.id)
                        }
                    }
                    if (this.dialogStatus === 'apply') {
                        this.postForm = {
                            id: row.crowd.id,
                        }
                        this.request.queryConfirm.url = '/dashboard/distance/crowds/refund/apply'
                    }
                    if (this.dialogStatus === 'agree') {
                        this.request.queryConfirm.url = '/dashboard/distance/crowds/refund/confirm'
                    }
                    if (this.dialogStatus === 'refuse') {
                        this.request.queryConfirm.url = '/dashboard/distance/crowds/refund/refuse'
                    }
                },
                beforeRequestMounted() {
                    this.query = {
                        activityId: this.$route.params.activityId,
                        userName: ''
                    }
                },
                afterRequestMounted() {

                }
            }
        }
    )
    export default page
</script>
