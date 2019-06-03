<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
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
                    {{scope.row.id}}
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
                    {{scope.row.max}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="220">
                <template slot-scope="scope">
                    <el-button type="primary" @click="routerPush($route.path + '/edit', scope.row.id)" size="mini">编辑</el-button>
                    <el-button type="primary" @click="routerPush($route.path + '/edit', scope.row.id)" size="mini">查看名单</el-button>
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
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ';'
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
                // this.queryItem.subjectId.value = this.$route.params.activityId
            },
            methods: {
                beforeRequestMounted() {

                }
            }
        }
    )
    export default page
</script>
