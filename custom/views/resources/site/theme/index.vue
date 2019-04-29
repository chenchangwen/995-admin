<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'名称'"
                      v-model="queryItem.name.value">
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
            <el-table-column align="left" label='名称' width="200">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='描述' width="200">
                <template slot-scope="scope">
                    {{scope.row.summary}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='类型' width="200">
                <template slot-scope="scope">
                    {{scope.row.type}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='路径' width="200">
                <template slot-scope="scope">
                    {{scope.row.path}}
                </template>
            </el-table-column>
            <el-table-column align="left" label='是否可用' width="100">
                <template slot-scope="scope">
                    <i :class="scope.row.disable ? 'el-icon-success' : 'el-icon-error'"></i>
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
                </template>
            </el-table-column>
        </el-table>
        <page></page>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="commonItem" :model="commonItem.form" label-position="left"
                     label-width="80px"
                     style='width: 400px; margin-left:50px;'>
                <el-form-item :label="'名称'" prop="name">
                    <el-input v-model="form.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item :label="'描述'">
                    <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="描述"
                        v-model="form.summary">
                    </el-input>
                </el-form-item>

                <el-form-item :label="'类型'" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="'路径'">
                    <el-input v-model="form.path" placeholder="路径"></el-input>
                </el-form-item>
                <el-form-item :label="'是否可用'">
                    <el-switch
                        v-model="form.disable"
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
                typeOptions:[
                    {
                        value: 'NEW',
                        text: 'NEW'
                    },
                    {
                        value: 'PRODUCT',
                        text: 'PRODUCT'
                    },
                    {
                        value: 'FEW',
                        text: 'FEW'
                    },
                    {
                        value: 'DOCUMENT',
                        text: 'DOCUMENT'
                    }
                ],
                commonItem: {
                    form: {
                        name: '',
                        type: '',
                        path: '',
                        summary: '',
                        disable: true
                    },
                    rules: {
                        name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
                        type: [{required: true, message: '请选择类型', trigger: 'blur'}],
                    },
                    formName: 'commonItem'
                },
                //查询对象
                queryItem: {
                    name: {
                        key: 'name',
                        operation: '==',
                        value: '',
                        predicate:";"
                    }
                },
                idKey: 'id',
                request: {
                    queryPrefix: '/sites/themes'
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
