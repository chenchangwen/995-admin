<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'模版ID'"
                      v-model="queryItem.id.value">
            </el-input>
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'模版名称'"
                      v-model="queryItem.templateName.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='消息ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='微信' width="150">
                <template slot-scope="scope">
                    {{scope.row.wechatId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.templateName}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.templateId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版格式' width="150">
                <template slot-scope="scope">
                    <span v-html="scope.row.content"></span>
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版示例' width="150">
                <template slot-scope="scope">
                    {{scope.row.contentExample}}
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
                //查询对象
                queryItem: {
                    id: {
                        key: 'id',
                        operation: '==',
                        value: '',
                        predicate:";"
                    },
                    templateName: {
                        key: 'templateName',
                        operation: '==',
                        value: '',
                        predicate:""
                    }
                },
                idKey: 'id',
                apiPrefix: '/wechats',
                apiQueryListUrl: '/users/messages/templates/formats',
                apiQueryCountUrl: '/users/messages/templates/formats/count'

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
