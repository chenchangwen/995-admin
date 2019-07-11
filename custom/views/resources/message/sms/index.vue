<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'模版ID'"
                      v-model="queryItem.smsTemplateId.value">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'手机号'"
                      v-model="queryItem.phoneNumbers.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit
                  highlight-current-row>
            <el-table-column  label='消息ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column  label='模版ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.smsTemplate.id}}
                </template>
            </el-table-column>
            <el-table-column  label='内容' min-width="300">
                <template slot-scope="scope">
                    {{scope.row.templateParam}}
                </template>
            </el-table-column>
            <el-table-column  label='手机号' width="150">
                <template slot-scope="scope">
                    {{scope.row.phoneNumbers}}
                </template>
            </el-table-column>
            <el-table-column  label='事件' min-width="150">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.eventSubject}}</p>
                    <p>主体ID:{{scope.row.eventSubjectId}}</p>
                    <p>主体描述:{{scope.row.eventSubjectSummary}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='来源' min-width="150">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.fromSubject}}</p>
                    <p>主体ID:{{scope.row.fromSubjectId}}</p>
                    <p>主体描述:{{scope.row.fromSubjectSummary}}</p>
                </template>
            </el-table-column>
            <el-table-column  label='发送状态' width="150">
                <template slot-scope="scope">
                    {{scope.row.reslutCode}}
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
                    smsTemplateId: {
                        key: 'smsTemplate.id',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    phoneNumbers: {
                        key: 'phoneNumbers',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/sms'
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
