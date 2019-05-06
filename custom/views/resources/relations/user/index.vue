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
            <el-table-column  label='关系类型' min-width="300">
                <template slot-scope="scope">
                    <p>名称:{{scope.row.relation.name}}</p>
                    <p>主体:{{scope.row.relation.subject}}</p>
                    <p>主体ID:{{scope.row.relation.subjectId}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='用户ID' width="95">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column  label='用户名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.userName}}
                </template>
            </el-table-column>
            <el-table-column  label='是否无线层' width="150">
                <template slot-scope="scope">
                    {{scope.row.unlimited}}
                </template>
            </el-table-column>
            <el-table-column  label='层级' width="150">
                <template slot-scope="scope">
                    {{scope.row.relateFloor}}
                </template>
            </el-table-column>

            <el-table-column  label='推荐人ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.relateUserId}}
                </template>
            </el-table-column>
            <el-table-column  label='推荐人名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.relateUserName}}
                </template>
            </el-table-column>
            <el-table-column  label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" disabled size="mini">重置用户关系</el-button>
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
                commonItem: {
                    form: {
                        //名称
                        name: '',
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonItem'
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
                request: {
                    queryPrefix: '/relations/users'
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
