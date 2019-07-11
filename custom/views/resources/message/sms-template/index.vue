<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'模版ID'"
                      v-model="queryItem.id.value">
            </el-input>
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'模版名称'"
                      v-model="queryItem.name.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit
                  highlight-current-row>
            <el-table-column  label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>

            <el-table-column  label='模版名称'>
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>

            <el-table-column  label='签名' width="150">
                <template slot-scope="scope">
                    {{scope.row.signName}}
                </template>
            </el-table-column>

            <el-table-column  label='模版码' width="150">
                <template slot-scope="scope">
                    {{scope.row.templateCode}}
                </template>
            </el-table-column>

            <el-table-column  label='是否可用' width="150">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>
            <el-table-column  label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="center" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,commonItem)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'模版名称'" prop="name">
                    {{form.name}}
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
                <el-button type="primary" @click="saveData(commonItem)" v-if="dialogStatus!=='create'"
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
                test: '',
                //创建表单
                commonItem: {
                    form: {
                        enable: true,
                        name: '',
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    id: {
                        key: 'id',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/sms/templates',
                }
            },
            methods: {
                beforeEditRequest(row) {
                    if (this.dialogStatus === 'update') {
                        this.postForm = _.cloneDeep(this.commonItem.form);
                        delete this.postForm.name;
                    }
                },
                afterCloseDialog(row) {

                }
            }
        }
    );
    export default page;
</script>
