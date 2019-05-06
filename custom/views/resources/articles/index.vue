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
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%">
            <el-table-column label="id" width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column label="创建时间" width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>

            <el-table-column label="作者" width="150">
                <template slot-scope="scope">
                    {{scope.row.author}}
                </template>
            </el-table-column>

            <el-table-column label='置顶' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.top ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>

            <el-table-column label="状态" width="150">
                <template slot-scope="scope">
                    {{scope.row.status}}
                </template>
            </el-table-column>

            <el-table-column label="标题" min-width="350">
                <template slot-scope="scope">
                    {{scope.row.title}}
                </template>
            </el-table-column>

            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleConfirm(scope.row)">删除</el-button>
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
                request: {
                    queryPrefix: '/articles'
                }
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
