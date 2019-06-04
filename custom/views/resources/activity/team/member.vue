<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'姓名'"
                      v-model="query.userName">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" type="primary" v-waves >导出</el-button>

            <el-button class="filter-item" type="primary" v-waves
                       @click="routerPush('/' +$route.matched[0].name + '/activity')">返回
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row
                  style="width: 100%">
            <el-table-column label='用户ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.teamMember.userId}}
                </template>
            </el-table-column>
            <el-table-column label='姓名' min-width="200">
                <template slot-scope="scope">
                    {{scope.row.teamMember.userName}}
                </template>
            </el-table-column>
            <el-table-column label='手机' width="150">
                <template slot-scope="scope">
                    {{scope.row.activityMember.phone}}
                </template>
            </el-table-column>

            <el-table-column label='微信' width="150">
                <template slot-scope="scope">
                    {{scope.row.activityMember.third}}
                </template>
            </el-table-column>

            <el-table-column label='状态' width="120">
                <template slot-scope="scope">
                    {{scope.row.activityMember.status}}
                </template>
            </el-table-column>
        </el-table>
        <page></page>
    </div>
</template>

<script>
    let page = new pageInit(
        {

            data: {
                isUseRSQL: false,
                request: {
                    queryPrefix: '/dashboard/distance/teams/members'
                }
            },

            methods: {
                beforeRequestMounted() {
                    this.query = {
                        teamId: this.$route.params.teamId,
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
