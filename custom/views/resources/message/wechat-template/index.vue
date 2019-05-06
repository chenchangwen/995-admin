<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'open_id'"
                      v-model="queryItem['open_id'].value">
            </el-input>
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'内容'"
                      v-model="queryItem.content.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%">
            <el-table-column  label='消息ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column  label='微信' width="150">
                <template slot-scope="scope">
                    {{scope.row.wechatId}}
                </template>
            </el-table-column>
            <el-table-column  label='open_id' width="150">
                <template slot-scope="scope">
                    {{scope.row.openId}}
                </template>
            </el-table-column>
            <el-table-column  label='内容' min-width="300">
                <template slot-scope="scope">
                    {{scope.row.content}}
                </template>
            </el-table-column>
            <el-table-column  label='事件' width="200">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.eventSubject}}</p>
                    <p>主体ID:{{scope.row.eventSubjectId}}</p>
                    <p>主体描述:{{scope.row.eventSubjectSummary}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='来源' width="200">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.fromSubject}}</p>
                    <p>主体ID:{{scope.row.fromSubjectId}}</p>
                    <p>主体描述:{{scope.row.fromSubjectSummary}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='发送状态' width="150">
                <template slot-scope="scope">
                    {{scope.row.lastSynStatus}}
                </template>
            </el-table-column>
            <el-table-column  label='发送时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column  label='创建时间' width="155">
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
                    ['open_id']: {
                        key: 'open_id',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    content: {
                        key: 'content',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/wechats',
                    queryList:{
                        url :'/users/messages/templates/'
                    },
                    queryCount:{
                        url: '/users/messages/templates/count'
                    }
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
