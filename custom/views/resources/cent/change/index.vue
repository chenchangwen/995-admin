<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.userId.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>

        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%">
            <el-table-column  label='变更ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column  label='账号' min-width="300">
                <template slot-scope="scope">
                    <p>类型:{{scope.row.centSubject}}</p>
                    <p>账号:{{scope.row.centSubjectId}}</p>
                    <p>用户ID{{scope.row.userId}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='事件' min-width="150">
                <template slot-scope="scope">
                    {{scope.row.fromSubjectSummary}}
                </template>
            </el-table-column>
            <el-table-column  label='来源' min-width="150">
                <template slot-scope="scope">
                    <p>类型:{{scope.row.fromSubject}}</p>
                    <p>账号:{{scope.row.fromSubjectId}}</p>
                    <p>用户ID{{scope.row.userId}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='变动金额' width="150">
                <template slot-scope="scope">
                    <p>变更金额:{{scope.row.changedNumber}}</p>
                    <p>手续费:{{scope.row.changedFee}}</p>
                    <p>变更后:{{scope.row.changedLeftNumber}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='状态' width="150">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="155" >
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
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
                //查询对象
                queryItem: {
                    userId: {
                        key: 'userId',
                        operation: '==',
                        value: '',
                        predicate:";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/cents/changes'
                }
            },
            methods: {
                beforeOpenDialog(row) {

                },
                afterCloseDialog(row) {

                }
            }
        }
    );
    export default page;
</script>
