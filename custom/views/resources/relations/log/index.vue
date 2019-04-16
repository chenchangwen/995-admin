<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'推荐人ID'"
                      v-model="queryItem.kickbackUserId.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>

        </div>
        <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='交易主体' width="200">
                <template slot-scope="scope">
                    {{scope.row.relationKickbackTradeId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='推荐人ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.kickbackUserId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='返佣关系' width="300">
                <template slot-scope="scope">
                    <p>用户层级{{scope.row.kickbackFloor}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='账号类型' width="150">
                <template slot-scope="scope">
                    {{scope.row.kickbackCentSubject}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='获得积分' width="150">
                <template slot-scope="scope">
                    {{scope.row.kickbackCents}}
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
                    kickbackUserId: {
                        key: 'kickbackUserId',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    }
                },
                idKey: 'id',
                apiPrefix: '/relations/kickbacks/logs'
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
