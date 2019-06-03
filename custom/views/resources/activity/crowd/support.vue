<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户名称'"
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
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search"
                       @click="routerPush('/' +$route.matched[0].name + '/activity')">返回
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='所属活动ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.activity.id}}
                </template>
            </el-table-column>
            <el-table-column label='所属活动名称' width="min-200">
                <template slot-scope="scope">
                    {{scope.row.activity.name}}
                </template>
            </el-table-column>
            <el-table-column label='支持用户ID' width="100">
                <template slot-scope="scope">
                    {{scope.row.crowdItem.userId}}
                </template>
            </el-table-column>
            <el-table-column label='支持用户名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.crowdItem.userName}}
                </template>
            </el-table-column>
            <el-table-column label='鼓励文字' width="200">
                <template slot-scope="scope">
                    {{scope.row.crowdItem.summary}}
                </template>
            </el-table-column>
            <el-table-column label='支持金额' width="100">
                <template slot-scope="scope">
                    {{scope.row.crowdItem.total}}
                </template>
            </el-table-column>
            <el-table-column label='订单编号' width="100">
                <template slot-scope="scope">
                    {{scope.row.crowdItem.id}}
                </template>
            </el-table-column>
            <el-table-column label='状态' width="120">
                <template slot-scope="scope">
                    {{scope.row.crowdItem.status}}
                </template>
            </el-table-column>

            <el-table-column label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'操作'" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" @click="handleUpdate(scope.row,commonItem, commonItem.agreeOptions)">同意
                    </el-button>
                    <el-button type="danger" @click="handleUpdate(scope.row,commonItem, commonItem.agreeOptions)">拒绝
                    </el-button>
                </template>
            </el-table-column>

        </el-table>
        <page></page>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    let page = new pageInit(
        {
            data: {
                isUseRSQL: false,
                commonItem:{
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
                    }
                },
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
                    queryPrefix: '/dashboard/distance/crowds/items'
                }
            },
            computed: {
                ...mapGetters([
                    'home',
                ])
            },
            methods: {
                beforeRequestMounted() {
                    this.query = {
                        crowdId : this.$route.params.crowdId,
                        userName:''
                    }

                    if (this.dialogStatus === 'agree') {
                        this.postForm = {
                            id: row.id,
                            operationSummary: '',
                            operationUserId: this.home.user.id
                        };
                        this.request.queryConfirm ={
                            url: '/confirm'
                        }
                    }

                    if (this.dialogStatus === 'refuse') {
                        this.postForm = {
                            id: row.id,
                            operationSummary: '',
                            operationUserId: this.home.user.id
                        };
                        this.request.queryConfirm ={
                            url: '/refuse'
                        }
                    }
                },
                afterRequestMounted() {

                }
            }
        }
    )
    export default page
</script>
