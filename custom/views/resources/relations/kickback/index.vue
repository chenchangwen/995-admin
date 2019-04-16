<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'返点类别'"
                      v-model="queryItem.summary.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='交易主体' width="200">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.subject}}</p>
                    <p>主体ID:{{scope.row.subjectId}}</p>
                    <p>主体名称:{{scope.row.subjectSummary}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='是否无线层' width="150">
                <template slot-scope="scope">
                    {{scope.row.unlimited}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='规则' width="200">
                <template slot-scope="scope">
                    用户角色:{{scope.row.role}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='用户关系' width="200">
                <template slot-scope="scope">
                    层级:{{scope.row.floor}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='返点' width="200">
                <template slot-scope="scope">
                    <p>返点方式:{{scope.row.rate ? '按比例返点' : '直接返点'}}</p>
                    <p>返点账号类别:{{scope.row.centSubject}}</p>
                    <p>冻结时间:{{scope.row.freeze}}</p>
                    <p>返点值:{{scope.row.amount}}</p>
                </template>
            </el-table-column>

            <el-table-column align="left" label='返点类别' width="200">
                <template slot-scope="scope">
                    层级:{{scope.row.summary}}
                </template>
            </el-table-column>

            <el-table-column align="left" label='是否可用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column align="left" label='创建时间' width="155">
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
                    summary: {
                        key: 'summary',
                        operation: '==',
                        value: '',
                        predicate:";"
                    }
                },
                idKey: 'id',
                apiPrefix: '/relations/kickbacks'
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
