<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户名称'"
                      v-model="query.userName">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" type="primary" v-waves
                       @click="routerPush('/' +$route.matched[0].name + '/activity/crowd/' + $route.params.activityId)">返回
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='所属活动ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.activity.id}}
                </template>
            </el-table-column>
            <el-table-column label='所属活动名称' min-width="200">
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

        </el-table>
        <page></page>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'

    let page = new pageInit(
        {
            data: {
                request: {
                    queryPrefix: '/dashboard/distance/crowds/items'
                }
            },
            computed: {
                ...mapGetters([
                    'home'
                ])
            },
            methods: {
                beforeRequestMounted() {
                    this.query = {
                        crowdId: this.$route.params.crowdId,
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
