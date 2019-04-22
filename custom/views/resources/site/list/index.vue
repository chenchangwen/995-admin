<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleEdit()" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='摘要' width="200">
                <template slot-scope="scope">
                    {{scope.row.summary}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.siteTheme.name}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='用户ID' width="100">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='是否可用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.disable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>
            <el-table-column align="left" label='过期时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.sitePayment.expireTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
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
                        predicate:";"
                    }
                },
                idKey: 'id',
                apiPrefix: '/sites'
            },
            methods: {
                handleEdit(id){
                    this.$router.push(this.$route.path + "/edit" +  (id ? ('/'+ id) : ''));
                }
            }
        }
    );
    export default page;
</script>
