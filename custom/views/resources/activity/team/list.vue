<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-select v-model="queryItem.status.value" clearable placeholder="状态" style="width: 200px">
                <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
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
                    {{scope.row.subjectId}}
                </template>
            </el-table-column>
            <el-table-column label='所属活动名称' min-width="200">
                <template slot-scope="scope">
                    {{scope.row.subjectName}}
                </template>
            </el-table-column>
            <el-table-column label='联合发起人姓名' width="150">
                <template slot-scope="scope">
                    {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column label='联合发起人ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column label='旗下人数' width="100">
                <template slot-scope="scope">
                    {{scope.row.teamStatistic.people}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='是否可用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.disable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" @click="routerPush($route.path + '/edit', scope.row.id)" size="mini">编辑</el-button>
                    <el-button type="primary" @click="handleViewMember(scope.row)" size="mini">查看名单</el-button>
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
                statusOptions: [
                    {
                        value: 'true',
                        label: '可用'
                    },
                    {
                        value: 'false',
                        label: '禁用'
                    }
                ],
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ';'
                    },
                    status: {
                        key: 'disable',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    subjectId: {
                        key: 'subjectId',
                        operation: '==',
                        value: '',
                        predicate: ''
                    }
                },
                request: {
                    queryPrefix: '/teams'
                }
            },
            created(){
                this.queryItem.subjectId.value = this.$route.params.activityId
            },
            methods: {
                handleViewMember(row){
                    this.routerPush(`/${this.$route.matched[0].name}/activity/team/${this.$route.params.activityId}/member/${row.id}`)
                },
                beforeRequestMounted() {

                }
            }
        }
    )
    export default page
</script>
