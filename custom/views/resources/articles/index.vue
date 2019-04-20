<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'标题'"
                      v-model="queryItem.title.value" clearable>
            </el-input>


            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleEdit()" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>

            <el-table-column label="标题" width="110" align="left">
                <template slot-scope="scope">
                    {{scope.row.title}}
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="155" align="left">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column label="作者" width="110" align="left">
                <template slot-scope="scope">
                    {{scope.row.author}}
                </template>
            </el-table-column>


            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
                    title: {
                        key: 'title',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                apiPrefix: '/articles',
            },
            methods: {
                handleEdit(id){
                    this.$router.push(this.$route.path + "/edit" +  (id ? ('/'+ id) : ''));
                }
            },
            components: {

            }
        }
    );
    export default page;
</script>
