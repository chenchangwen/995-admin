<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.userId.value">
            </el-input>
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户主体'"
                      v-model="queryItem.subjectId.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='账号' width="200">
                <template slot-scope="scope">
                    <p>主体:{{scope.row.subject}}</p>
                    <p>主体ID:{{scope.row.subjectId}}</p>
                </template>
            </el-table-column>
            <el-table-column align="left" label='余额' width="150">
                <template slot-scope="scope">
                    {{scope.row.number}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='冻结金额' width="150">
                <template slot-scope="scope">
                    {{scope.row.frozenNumber}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='用户ID' width="150">
                <template slot-scope="scope">
                    {{scope.row.userId}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='冻结金额' width="150">
                <template slot-scope="scope">
                    {{scope.row.frozenNumber}}
                </template>
            </el-table-column>
            <el-table-column label="是否有效" width="110" align="left">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>
            <el-table-column align="left" label='更新时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini"
                               @click="handleUpdate(scope.row,commonItem)">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="150px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'用户ID'">
                    {{form.userId}}
                </el-form-item>
                <el-form-item :label="'主体'">
                    {{form.subject}}
                </el-form-item>
                <el-form-item :label="'主体ID'">
                    {{form.subjectId}}
                </el-form-item>
                <el-form-item :label="'是否可用'">
                    <el-switch
                        v-model="form.enable"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveData(commonItem)"
                           :loading="dialogButtonLoading"
                           :disabled="dialogButtonDisabled">确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let page = new pageInit(
        {
            data: {
                commonItem: {
                    form: {
                        userId: '',
                        subject: '',
                        subjectId: '',
                        enable: ''
                    },
                    rules: {},
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    userId: {
                        key: 'userId',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    subjectId: {
                        key: 'subjectId',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/cents'
                }
            },
            methods: {
                beforeEditRequest(row) {
                    this.postForm = {
                        id: row.id,
                        enable: this.commonItem.form.enable
                    };
                }
            }
        }
    );
    export default page;
</script>
