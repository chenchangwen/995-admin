<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.userId.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonForm)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='变更ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='账号' width="300">
                <template slot-scope="scope">
                    <p>类型:{{scope.row.centSubject}}</p>
                    <p>账号:{{scope.row.centSubjectId}}</p>
                    <p>用户ID{{scope.row.userId}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='事件' width="300">
                <template slot-scope="scope">
                    {{scope.row.fromSubjectSummary}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='来源' width="300">
                <template slot-scope="scope">
                    <p>类型:{{scope.row.fromSubject}}</p>
                    <p>账号:{{scope.row.fromSubjectId}}</p>
                    <p>用户ID{{scope.row.userId}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='变动金额' width="150">
                <template slot-scope="scope">
                    <p>变更金额:{{scope.row.changedNumber}}</p>
                    <p>手续费:{{scope.row.changedFee}}</p>
                    <p>变更后:{{scope.row.changedLeftNumber}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='状态' width="150">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" width="155" align="left">
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
                commonForm: {
                    form: {
                        //名称
                        name: '',
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonForm'
                },
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
                apiPrefix: '/cents/changes'
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
