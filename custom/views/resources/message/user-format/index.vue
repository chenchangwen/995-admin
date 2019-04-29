<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                      v-model="queryItem.userId.value">
            </el-input>
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'内容'"
                      v-model="queryItem.content.value">
            </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
            </el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate(commonItem)" type="primary"
                       icon="el-icon-edit">新增
            </el-button>
        </div>
        <el-table :data="items" v-loading="itemsLoading" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="left" label='ID' width="300">
                <template slot-scope="scope">
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版名称' width="150">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版格式' width="150">
                <template slot-scope="scope">
                    {{scope.row.content}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='模版示例' width="200">
                <template slot-scope="scope">
                    {{scope.row.example}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='是否可用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.enable ? 'el-icon-success' : 'el-icon-error'"></i>
                </template>
            </el-table-column>
            <el-table-column align="left" label='创建时间' width="155">
                <template slot-scope="scope">
                    {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
                </template>
            </el-table-column>
            <el-table-column align="left" :label="'操作'" width="230">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleUpdate(scope.row,commonItem)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleConfirm(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :rules="commonItem.rules" ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'ID'" v-if="dialogStatus ==='update'">
                    {{form.id}}
                </el-form-item>
                <el-form-item :label="'模版名称'" prop="name">
                    <el-input v-model="form.name" placeholder="模版名称"></el-input>
                </el-form-item>
                <el-form-item :label="'模版格式'" prop="content">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="模版示例"
                        v-model="form.content">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'模版示例'" prop="example">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="模版示例"
                        v-model="form.example">
                    </el-input>
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
                //创建表单
                commonItem: {
                    form: {
                        name: '',
                        content: '',
                        example: '',
                        enable: '',
                    },
                    rules: {
                        name: [{required: true, message: '模版名称不能为空', trigger: 'blur'}],
                        content: [{required: true, message: '模版格式不能为空', trigger: 'blur'}],
                        example: [{required: true, message: '模版示例不能为空', trigger: 'blur'}],
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    userId: {
                        key: 'id',
                        operation: '==',
                        value: '',
                        predicate: ";"
                    },
                    content: {
                        key: 'content',
                        operation: '==',
                        value: '',
                        predicate: ""
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/users/messages/formats'
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
