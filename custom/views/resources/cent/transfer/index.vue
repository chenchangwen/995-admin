<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'来源用户ID'"
                      v-model="queryItem.fromCentUserId.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%">
            <el-table-column  label='转账ID' min-width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column  label='来源账号' min-width="300">
                <template slot-scope="scope">
                    <p>类型:{{scope.row.fromCentSubject}}</p>
                    <p>账号:{{scope.row.fromCentSubjectId}}</p>
                    <p>用户ID{{scope.row.fromCentUserId}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='目标账号' min-width="300">
                <template slot-scope="scope">
                    <p>类型:{{scope.row.toCentSubject}}</p>
                    <p>账号:{{scope.row.toCentSubjectId}}</p>
                    <p>用户ID{{scope.row.toCentUserId}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='金额' width="150">
                <template slot-scope="scope">
                    <p>变更金额:{{scope.row.number}}</p>
                    <p>手续费:{{scope.row.containFee}}</p>
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
                    fromCentUserId: {
                        key: 'fromCentUserId',
                        operation: '==',
                        value: '',
                        predicate:";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/cents/transfers'
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
